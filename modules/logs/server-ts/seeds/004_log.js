import { returnId, truncateTables } from '@gqlapp/database-server-ts';

const LOGS = [
  { operation: 'SyncFromErp', state: 'Start', item: 'Vendor', records: 0, success: true, error: '' },
  { operation: 'SyncFromErp', state: 'End', item: 'Vendor', records: 0, success: false, error: 'Invoices could not be imported to ERP for this this reason' },
  { operation: 'SyncFromErp', state: 'Start', item: 'Vendor', records: 0, success: true, error: '' },
  { operation: 'SyncFromErp', state: 'End', item: 'Vendor', records: 5, success: true, error: '' }
];

export async function seed(knex, Promise) {
  await truncateTables(knex, Promise, ['log']);
  for (let i of LOGS) {
    await returnId(knex('log')).insert({
      operation: i.operation,
      state: i.state,
      item: i.item,
      records: i.records,
      success: i.success,
      error: i.error
    });
  }
}