import { allOfResolve, JsonSchemaCompiler } from "./jsonSchema";

const jsonSchemaCompiler = new JsonSchemaCompiler(async (_url: string) => ({}));

describe("compatibility validation", () => {
  it("allows inheritance that do not re-write keys", async () => {
    const schema = {
      type: "object",
      allOf: [
        {
          type: "object",
          properties: {
            name: { type: "string" },
            age: { type: "number" },
          },
        },
      ],
      properties: {
        id: { type: "string" },
        updatedAt: { type: "string", format: "date-time" },
        createdAt: { type: "string", format: "date-time" },
      },
    };
    await jsonSchemaCompiler.resolveAllOf(schema);
    // no error should be thrown
  });

  it("disallows overwriting incompatible, inheriting fields from props", async () => {
    const schema = {
      type: "object",
      allOf: [
        {
          type: "object",
          properties: {
            name: { type: "string" },
            age: { type: "string" },
          },
        },
      ],
      properties: {
        id: { type: "string" },
        age: { type: "number" },
        updatedAt: { type: "string", format: "date-time" },
        createdAt: { type: "string", format: "date-time" },
      },
    };
    await expect(jsonSchemaCompiler.resolveAllOf(schema)).rejects.toThrowError(
      /Type mismatch on "age". Got "string" expected "number"/i,
    );
  });

  it("allows overwriting compatible, inheriting fields from props", async () => {
    const schema = {
      type: "object",
      allOf: [
        {
          type: "object",
          properties: {
            name: { type: "string" },
            age: { type: "string" },
          },
        },
      ],
      properties: {
        id: { type: "string" },
        age: { type: "string" },
        updatedAt: { type: "string", format: "date-time" },
        createdAt: { type: "string", format: "date-time" },
      },
    };
    await expect(
      jsonSchemaCompiler.resolveAllOf(schema),
    ).resolves.toBeUndefined();
  });

  it("disallows overwriting incompatible, inheriting fields from other parent types", async () => {
    const schema = {
      type: "object",
      allOf: [
        {
          type: "object",
          properties: {
            name: { type: "string" },
            age: { type: "string" },
          },
        },
        {
          type: "object",
          properties: {
            age: { type: "number" },
          },
        },
      ],
      properties: {
        id: { type: "string" },
        updatedAt: { type: "string", format: "date-time" },
        createdAt: { type: "string", format: "date-time" },
      },
    };
    await expect(jsonSchemaCompiler.resolveAllOf(schema)).rejects.toThrowError(
      /Type mismatch on "age". Got "number" expected "string"/i,
    );
  });

  it("allows overwriting compatible, inheriting fields from other parent types", async () => {
    const schema = {
      type: "object",
      allOf: [
        {
          type: "object",
          properties: {
            name: { type: "string" },
            age: { type: "string" },
          },
        },
        {
          type: "object",
          properties: {
            age: { type: "string" },
          },
        },
      ],
      properties: {
        id: { type: "string" },
        updatedAt: { type: "string", format: "date-time" },
        createdAt: { type: "string", format: "date-time" },
      },
    };
    await expect(
      jsonSchemaCompiler.resolveAllOf(schema),
    ).resolves.toBeUndefined();
  });

  /**
   * @todo: The current allOf merger does not support this type of object property merging.
   */
  it.skip("disallows overwriting incompatible, inheriting fields from nested parent types", async () => {
    const schema = {
      type: "object",
      allOf: [
        {
          type: "object",
          allOf: [
            {
              type: "object",
              properties: {
                name: { type: "string" },
                height: { type: "string" },
              },
            },
          ],
          properties: {
            age: { type: "number" },
          },
        },
      ],
      properties: {
        id: { type: "string" },
        height: { type: "number" },
        updatedAt: { type: "string", format: "date-time" },
        createdAt: { type: "string", format: "date-time" },
      },
    };
    await expect(jsonSchemaCompiler.resolveAllOf(schema)).rejects.toThrowError(
      /Type mismatch on "height". Got "string" expected "number"/i,
    );
  });

  it("allows overwriting compatible, inheriting fields from nested parent types", async () => {
    const schema = {
      type: "object",
      allOf: [
        {
          type: "object",
          allOf: [
            {
              type: "object",
              properties: {
                name: { type: "string" },
                height: { type: "string" },
              },
            },
          ],
          properties: {
            age: { type: "number" },
          },
        },
      ],
      properties: {
        id: { type: "string" },
        lefthanded: { type: "boolean" },
        updatedAt: { type: "string", format: "date-time" },
        createdAt: { type: "string", format: "date-time" },
      },
    };
    await expect(
      jsonSchemaCompiler.resolveAllOf(schema),
    ).resolves.toBeUndefined();
  });

  it("disallows overwriting clashing constraints", async () => {
    const schema = {
      type: "object",
      allOf: [
        {
          properties: {
            age: {
              description:
                "Age in years which must be equal to or greater than zero.",
              type: "integer",
              minimum: 0,
              maximum: 100,
            },
          },
        },
      ],
      properties: {
        age: { type: "integer", minimum: -100, maximum: -1 },
      },
    };
    await expect(jsonSchemaCompiler.resolveAllOf(schema)).rejects.toThrow(
      "Constraint 'minimum' (0) to 'maximum' (-1) defines a negative interval.",
    );
  });

  it("allows narrowing constraints", async () => {
    const schema = {
      type: "object",
      allOf: [
        {
          properties: {
            age: {
              description:
                "Age in years which must be equal to or greater than zero.",
              type: "integer",
              minimum: 0,
              maximum: 100,
            },
          },
        },
      ],
      properties: {
        age: {
          type: "integer",
          description:
            "Age in years which must be equal to or greater than 10, less than or equal to 90",
          minimum: 10,
          maximum: 90,
        },
      },
    };
    await expect(
      jsonSchemaCompiler.resolveAllOf(schema),
    ).resolves.toBeUndefined();
  });
});

describe("allOfResolve", () => {
  it("can resolve a simple schema", async () => {
    const schema = {
      $id: "https://example.com/person.schema.json",
      $schema: "https://json-schema.org/draft/2020-12/schema",
      title: "Person",
      type: "object",

      properties: {
        firstName: {
          type: "string",
          description: "The person's first name.",
        },
        lastName: {
          type: "string",
          description: "The person's last name.",
        },
      },
    };

    const res = await allOfResolve(schema, jest.fn());

    expect(res.parents).toEqual([]);
    expect(res.$id).toEqual(schema.$id);
    expect(res.properties).toEqual([
      {
        name: "firstName",
        type: "string",
        format: undefined,
        description: "The person's first name.",
        otherFields: {},
      },
      {
        name: "lastName",
        type: "string",
        format: undefined,
        description: "The person's last name.",
        otherFields: {},
      },
    ]);
  });

  it("can flatten allOf properties on leaf schema", async () => {
    const schema = {
      $id: "https://example.com/person.schema.json",
      $schema: "https://json-schema.org/draft/2020-12/schema",
      title: "Person",
      type: "object",
      allOf: [
        {
          properties: {
            age: {
              description:
                "Age in years which must be equal to or greater than zero.",
              type: "integer",
              minimum: 0,
            },
          },
        },
      ],
      properties: {
        firstName: {
          type: "string",
          description: "The person's first name.",
        },
        lastName: {
          type: "string",
          description: "The person's last name.",
        },
      },
    };

    const res = await allOfResolve(schema, jest.fn());

    expect(res.parents).toEqual([]);
    expect(res.$id).toEqual(schema.$id);
    expect(res.properties).toEqual([
      {
        name: "firstName",
        type: "string",
        format: undefined,
        description: "The person's first name.",
        otherFields: {},
      },
      {
        name: "lastName",
        type: "string",
        format: undefined,
        description: "The person's last name.",
        otherFields: {},
      },
      {
        name: "age",
        type: "integer",
        format: undefined,
        description:
          "Age in years which must be equal to or greater than zero.",
        otherFields: {
          minimum: 0,
        },
      },
    ]);
  });

  it("can resolve a nested schema", async () => {
    const resolveSchema = {
      $id: "https://example.com/geographical-location.schema.json",
      $schema: "https://json-schema.org/draft/2020-12/schema",
      title: "Longitude and Latitude Values",
      description: "A geographical coordinate.",
      required: ["latitude", "longitude"],
      type: "object",
      properties: {
        latitude: {
          type: "number",
          minimum: -90,
          maximum: 90,
        },
        longitude: {
          type: "number",
          minimum: -180,
          maximum: 180,
        },
      },
    };

    const schema = {
      $id: "https://example.com/person.schema.json",
      $schema: "https://json-schema.org/draft/2020-12/schema",
      title: "Person",
      type: "object",
      allOf: [
        { $ref: 1 },
        {
          properties: {
            age: {
              description:
                "Age in years which must be equal to or greater than zero.",
              type: "integer",
              minimum: 0,
            },
          },
        },
      ],
      properties: {
        firstName: {
          type: "string",
          description: "The person's first name.",
        },
        lastName: {
          type: "string",
          description: "The person's last name.",
        },
      },
    };

    const mockReturn = jest.fn().mockResolvedValueOnce(resolveSchema);

    const res = await allOfResolve(schema, mockReturn);

    expect(res.$id).toEqual(schema.$id);
    expect(res.parents).toHaveLength(1);
    const onlyParent = res.parents[0];

    expect(onlyParent.$id).toEqual(resolveSchema.$id);
    expect(onlyParent.parents).toEqual([]);

    expect(onlyParent.properties).toEqual([
      {
        name: "latitude",
        type: "number",
        format: undefined,
        description: undefined,
        otherFields: {
          maximum: 90,
          minimum: -90,
        },
      },
      {
        name: "longitude",
        type: "number",
        format: undefined,
        description: undefined,
        otherFields: {
          maximum: 180,
          minimum: -180,
        },
      },
    ]);

    expect(res.properties).toEqual([
      {
        name: "firstName",
        type: "string",
        format: undefined,
        description: "The person's first name.",
        otherFields: {},
      },
      {
        name: "lastName",
        type: "string",
        format: undefined,
        description: "The person's last name.",
        otherFields: {},
      },
      {
        name: "age",
        type: "integer",
        format: undefined,
        description:
          "Age in years which must be equal to or greater than zero.",
        otherFields: {
          minimum: 0,
        },
      },
    ]);
  });
});
