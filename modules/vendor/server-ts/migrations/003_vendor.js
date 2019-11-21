exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema
      .createTable('vendor', table => {
        table.increments();
        table.string('vendorId');
        table.string('name');
        table.timestamps(false, true);
      })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([knex.schema.dropTable('vendor')]);
};
