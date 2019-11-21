exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('log', table => {
      table.increments();
      table.string('operation');
      table.string('state');
      table.string('item');
      table.integer('records');
      table.integer('success');
      table.string('error');
      table.timestamps(false, true);
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([knex.schema.dropTable('log')]);
};