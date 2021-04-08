exports.up = function (knex) {
  return knex.schema.createTable("users", (table) => {
    table.string("id").unique().primary();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("users");
};
