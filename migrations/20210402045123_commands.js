exports.up = function (knex) {
  return knex.schema.createTable("commands", function (table) {
    table.string("name").unique().primary();
    table.text("command");
    table.integer("system").notNullable();
    table.integer("status").notNullable();
    table.string("created_by");
    table.string("updated_by");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("commands");
};
