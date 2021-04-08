
exports.up = function(knex) {
  return knex.schema.createTable('cemiterios',function(table){
      table.string('id').primary();
      table.timestamp('date').defaultTo(knex.fn.now());
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('cemiterios');
};
