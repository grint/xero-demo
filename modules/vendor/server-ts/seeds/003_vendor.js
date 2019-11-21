import { returnId, truncateTables } from '@gqlapp/database-server-ts';

export async function seed(knex, Promise) {
  await truncateTables(knex, Promise, ['vendor']);

  await Promise.all([
    await returnId(knex('vendor')).insert({
      vendorId: 'aacecb74-ef1e-44e0-ba52-0bc521639697',
      name: `PC Complete`,
    }),
    await returnId(knex('vendor')).insert({
      vendorId: 'c01292e3-1a1a-4a70-b120-1218f8f71096',
      name: `Bayside Wholesale`,
    }),
    await returnId(knex('vendor')).insert({
      vendorId: '3f58af86-b4d9-4ac9-950c-2e4cdd94d5be',
      name: `SMART Agency`,
    }),
    await returnId(knex('vendor')).insert({
      vendorId: 'cade9142-f5fe-4970-b39e-2f388b8740c0',
      name: `Central Copiers`,
    }),
    await returnId(knex('vendor')).insert({
      vendorId: '3b30a108-9156-4a42-a893-3bbbe7af1ef8',
      name: `Xero`,
    })
  ]);
}
