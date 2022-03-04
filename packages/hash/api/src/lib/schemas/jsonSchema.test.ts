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
    await jsonSchemaCompiler.prevalidateProperties(schema);
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
    await expect(
      jsonSchemaCompiler.prevalidateProperties(schema),
    ).rejects.toThrowError(
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
      jsonSchemaCompiler.prevalidateProperties(schema),
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
    await expect(
      jsonSchemaCompiler.prevalidateProperties(schema),
    ).rejects.toThrowError(
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
      jsonSchemaCompiler.prevalidateProperties(schema),
    ).resolves.toBeUndefined();
  });

  it("disallows overwriting incompatible, inheriting fields from nested parent types", async () => {
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
    await expect(
      jsonSchemaCompiler.prevalidateProperties(schema),
    ).rejects.toThrowError(
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
      jsonSchemaCompiler.prevalidateProperties(schema),
    ).resolves.toBeUndefined();
  });
});

const resolveSchema1 = {
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

const resolveSchema2 = {
  $id: "https://example.com/link.json",
  type: "object",
  properties: {
    rel: { type: "array", items: [{ type: "string", pattern: "self" }] },
    href: { type: "string" },
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
    { $ref: 1 },
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

describe.only("yes", () => {
  it("allOfResolve", async () => {
    const mockReturn = jest
      .fn()
      .mockResolvedValueOnce(resolveSchema1)
      .mockResolvedValueOnce(resolveSchema2);
    const res = await allOfResolve(schema, mockReturn);
    expect(res).toBeUndefined();
  });
});
