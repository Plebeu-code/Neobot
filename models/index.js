import { Model } from "objection";

class Configs extends Model {
  // Table name is the only required property.

  static get tableName() {
    return "configs";
  }
  static get jsonSchema() {
    return {
      type: "object",
      required: ["name"],
      properties: {
        name: { type: "string" },
        value: { type: "string" },
      },
    };
  }
  static get relationMappings() {
    return {};
  }
}

class Commands extends Model {
  // Table name is the only required property.

  static get tableName() {
    return "commands";
  }
  static get jsonSchema() {
    return {
      type: "object",
      required: ["name", "command", "system", "status"],
      properties: {
        name: { type: "string" },
        command: { type: "string" },
        system: { type: "integer" },
        status: { type: "integer" },
        updated_by: { type: "string" },
        created_by: { type: "string" },
        updated_at: { type: "timestamp" },
        created_at: { type: "timestamp" },
      },
    };
  }
  static get relationMappings() {
    return {};
  }
}

class Calientes extends Model {
  static get tableName() {
    return "calientes";
  }
  static get jsonSchema() {
    return {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "string" },
      },
    };
  }
  static get relationMappings() {
    return {};
  }
}

class Cemiterios extends Model {
  static get tableName() {
    return "cemiterios";
  }
  static get jsonSchema() {
    return {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "string" },
      },
    };
  }
  static get relationMappings() {
    return {};
  }
}

class Jokes extends Model {
  // Table name is the only required property.

  static get tableName() {
    return "permissionjoke";
  }
  static get jsonSchema() {
    return {
      type: "object",
      required: ["id", "text"],
      properties: {
        id: { type: "integer" },
        text: { type: "string" },
      },
    };
  }
  static get relationMappings() {
    return {};
  }
}

export default {
  Configs,
  Commands,
  Calientes,
  Cemiterios,
  Jokes,
};
