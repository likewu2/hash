import { JSONObject } from "blockprotocol";
import Ajv2019, { AnySchemaObject } from "ajv/dist/2019";
import addFormats from "ajv-formats";
import $RefParser, {
  FileInfo,
  JSONSchema,
} from "@apidevtools/json-schema-ref-parser";
import { cloneDeep } from "lodash";
import { FRONTEND_URL } from "../config";
import {
  DestructuredSchema,
  DestructuredSchemaParent,
  DestructuredSchemaProperty,
} from "../../graphql/apiTypes.gen";

/**
 * Given a list of all properties, check if any duplicates are present by the property name.
 * @param allProps list of properties to duplicate check
 * @returns a list of type-mismatch errors. Does not throw an exception.
 */
const propertyKeyValidator = <T extends [x: string, _: any][]>(
  ...allProps: T
) => {
  const seen: Map<string, any> = new Map([]);
  const duplicateErrors: string[] = [];

  // Iterate all props, check for duplicates and throw an error if types mismatch
  for (const [prop, value] of allProps) {
    if (seen.has(prop)) {
      const other = seen.get(prop);

      if (value?.type !== other?.type) {
        duplicateErrors.push(
          `Type mismatch on "${prop}". Got "${value?.type}" expected "${other?.type}"`,
        );
      }
    }

    seen.set(prop, value);
  }

  return duplicateErrors;
};

/**
 * Flatten JSONSchema into all properties. This traverses schemas recursively.
 * Caveat of using recursing is potential stack overflow due to (lack of) tail call optimization.
 * Could be rewritten to an iterative implementation.
 *   - but realistically schemas are not going to inherit deeply enough for stack overflow.
 */
const flattenNestedProps = (schema: JSONSchema): [_: string, __: any][] => {
  const currentProps = Object.entries(schema?.properties ?? {});
  const newProps =
    schema?.allOf?.flatMap((prop: any) => {
      if (typeof prop !== "boolean") {
        return flattenNestedProps(prop);
      } else {
        return [];
      }
    }) ?? [];

  return [...currentProps, ...newProps];
};

export const jsonSchemaVersion = "https://json-schema.org/draft/2019-09/schema";

/**
 * Generates a URI for a schema in a HASH instance.
 * $ids should use absolute URIs, and will need to be re-written if the origin changes.
 * $refs should use relative URIs, which can be resolved relative to the $id's origin.
 * If $refs used absolute URIs, they would need to be re-written if the origin changes also,
 *    which would be (a) more writes, and (b) more complex if a schema has $refs to external URIs.
 * @todo rewrite schema $ids when FRONTEND_URL config is changed.
 *    ideally this URL would be configurable in an admin panel and stored in the db.
 * */
export const generateSchema$id = (
  accountId: string,
  entityTypeId: string,
  relative: boolean = false,
) => {
  return `${relative ? "" : FRONTEND_URL}/${accountId}/types/${entityTypeId}`;
};

/**
 * Given a Schema$id, generate an appropriate $ref to put into allOf field on JSON schema.
 * This can be used to inherit from other schemas.
 * */
export const schema$idRef = (schema$id: string) => {
  return JSON.stringify([{ $ref: schema$id }]);
};

type SchemaResolverFunction = (url: string) => Promise<AnySchemaObject>;

/**
 * Empty, default resolver for $refs in JSON Schemas
 * @todo check that $refs point to URIs which return at least valid JSON.
 *    We might not want to check each is a valid schema as they might link on to many more.
 *    For schemas stored in HASH, we know they're valid (since each is checked on insert).
 */
const emptySchemaResolver = async (_url: string) => ({});

/**
 * Error that represents a type mismatch in the JSONSchema validation step.
 * This error class exists for filtering purposes.
 */
export class TypeMismatch extends Error {
  constructor(msg: string) {
    super(msg);
    Object.setPrototypeOf(this, TypeMismatch.prototype);
  }
}

const parentSchemaIds = (allOf: any[] | undefined): string[] => {
  return allOf
    ? allOf?.flatMap((schema: JSONSchema) => {
        if (typeof schema === "object") {
          // This flattening operation is not that efficient.
          return [schema.$id, ...parentSchemaIds(schema.allOf ?? ([] as any))];
        } else {
          return [];
        }
      }) ?? []
    : [];
};

// @todo: Currently this function uses a _lot_ of recursion.
// Ideally this would be replaced with iterative tree traversal to prevent stack overflow.
const destructureSchemaParents = (
  schema: JSONSchema,
  seen: Set<string>,
): DestructuredSchemaParent[] => {
  const { $id, allOf, properties } = schema;

  // if the schema doesn't have an $id, we're not interested in extracting props.
  if (!$id) {
    return [];
  }

  const currentProps: DestructuredSchemaProperty[] =
    Object.entries(properties ?? {}).map(([name, content]) => ({
      name,
      content,
    })) ?? [];

  // Note that we are traversing the parents twice.
  // this is the first time to add it to the list of parents if it hasn't been seen already
  const parents =
    allOf?.flatMap((prop: any) => {
      if (typeof prop !== "boolean") {
        return destructureSchemaParents(prop, seen);
      } else {
        return [];
      }
    }) ?? [];

  if (!seen.has($id)) {
    seen.add($id);
    return [
      <DestructuredSchemaParent>{
        id: $id,
        // Second time parents are traversed are for getting all `$id`s of parents.
        parents: parentSchemaIds(schema.allOf),
        properties: currentProps,
      },
      ...parents,
    ];
  } else {
    return [];
  }
};

const destructureSchema = (schema: JSONSchema): DestructuredSchema => {
  const currentProps: DestructuredSchemaProperty[] = Object.entries(
    schema?.properties ?? {},
  ).map(([name, content]) => ({ name, content }));

  const seen = new Set([schema.$id]);

  const parentSchemas =
    schema?.allOf?.flatMap((prop: any) => {
      if (typeof prop !== "boolean") {
        return destructureSchemaParents(prop, seen);
      } else {
        return [];
      }
    }) ?? [];

  return <DestructuredSchema>{
    id: schema.title ?? schema.$id,
    parentSchemas,
    properties: currentProps ?? [],
  };
};

/**
 * Class that encapsulates JsonSchema validation.
 */
export class JsonSchemaCompiler {
  private ajv: Ajv2019;
  private resolver: SchemaResolverFunction;

  constructor(resolver: SchemaResolverFunction) {
    this.resolver = resolver;

    this.ajv = new Ajv2019({
      addUsedSchema: false, // stop AJV trying to add compiled schemas to the instance
      // At validation time, don't use the "proper" resolver.
      loadSchema: emptySchemaResolver,
    });

    this.ajv.addKeyword({
      keyword: "componentId",
      schemaType: "string",
    });

    addFormats(this.ajv);
    // allOfCompatibility(this.ajv);
  }

  /**
   * Validate uniqueness of properties using json-schema-ref-parser
   * the reason why AJV is not used, is because refs are not inlined in AJV.
   * AJV does merge properties, but overrides any duplicates, which can still produce validation errors
   * This validation step ensures schemas do not override (duplicate) keys with incompatible types.
   * @param schema schema object
   * @throws if any types of duplicate properties mismatch
   */
  async prevalidateProperties(schema: any): Promise<JSONSchema> {
    const self = this;
    const dereferences = await $RefParser.dereference(schema, {
      dereference: {
        circular: false,
      },
      resolve: {
        // Look up http references through class-supplied resolver.
        http: {
          order: 1,
          read(file: FileInfo) {
            return self.resolver(file.url);
          },
        },
      },
    });
    if (dereferences.properties && dereferences.allOf) {
      // flattenNestedProps is recursivly defined
      const res = flattenNestedProps(dereferences);
      if (res.length > 0) {
        // Check for type incompatibilities.
        // @todo: does not handle format or other type-related properties. Only checks for type.
        const duplicateErrors = propertyKeyValidator(...res);
        if (duplicateErrors.length > 0) {
          throw new TypeMismatch(duplicateErrors.join("\n"));
        }
      }
    }

    return dereferences;
  }

  /**
   * Create a JSON schema
   * @param title the name of the schema, e.g. Person
   * @param accountId the account it belongs to
   * @param entityTypeId the entityId of this entityType
   * @param maybeStringifiedSchema schema definition fields (in either a JSON string or JS object)
   *    (e.g. 'properties', 'definition', 'description')
   * @param description optional description for the type
   * @returns schema the complete JSON schema object
   */
  async jsonSchema(
    title: string,
    accountId: string,
    entityTypeId: string,
    maybeStringifiedSchema: string | JSONObject = {},
    description?: string,
  ) {
    if (title[0] !== title[0].toUpperCase()) {
      throw new Error(
        `Schema title should be in PascalCase, you passed '${title}'`,
      );
    }

    const partialSchema: JSONObject =
      typeof maybeStringifiedSchema === "string"
        ? JSON.parse(maybeStringifiedSchema)
        : maybeStringifiedSchema;

    const schema = {
      ...partialSchema,
      $schema: jsonSchemaVersion,
      $id: generateSchema$id(accountId, entityTypeId),
      title,
      type: partialSchema.type ?? "object",
      description: partialSchema.description ?? description,
    };

    try {
      // modifies schema in-line, therefore schema is cloned.
      await this.prevalidateProperties(cloneDeep(schema));
    } catch (err: any) {
      // underlying $RefParser is more strict than ajv when it comes to validation
      //  - because of ref-inlining, every allOf/oneOf/other referenced schemas are validated
      // We could allow this to throw any error before AJV takes over if desired.
      // For now we only report our custom type mismatch errors.
      if (err instanceof TypeMismatch) {
        throw err;
      }
    }

    try {
      await this.ajv.compileAsync(schema);
    } catch (err: any) {
      throw new Error(
        `Error in provided type schema: ${(err as Error).message}`,
      );
    }

    return schema;
  }

  async deconstructedJsonSchema(
    maybeStringifiedSchema: string | JSONObject = {},
  ) {
    const schema: JSONObject =
      typeof maybeStringifiedSchema === "string"
        ? JSON.parse(maybeStringifiedSchema)
        : maybeStringifiedSchema;

    const bundledSchema = await this.prevalidateProperties(schema);

    return destructureSchema(bundledSchema);
  }
}
