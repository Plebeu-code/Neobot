exports.up = function (knex) {
  return knex.schema.createTable("configs", function (table) {
    table.string("name").primary();
    table.string("value").notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("configs");
};
