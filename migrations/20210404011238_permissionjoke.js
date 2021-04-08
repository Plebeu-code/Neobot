exports.up = function (knex) {
  return knex.schema.createTable("permissionjoke", function (table) {
    table.increments("id").primary();
    table.string("text").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("permissionjoke");
};
