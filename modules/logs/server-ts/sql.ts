import { knex } from '@gqlapp/database-server-ts';

export interface Log {
  operation: string;
  state: string;
  item: string;
  records: number;
  success: boolean;
  error: string;
}

export default class LogsDAO {
  public getLogs() {
    return knex
      .select(
        'id',
        'operation',
        'state',
        'item',
        'records',
        'success',
        'error',
        'created_at'
      )
      .from('log')
      .orderBy('id', 'desc');
  }

  public getLastVendorLog() {
    return knex
      .where('item', '=', 'Vendor')
      .from('log')
      .orderBy('id', 'desc');
  }

  public addLog(params: Log) {
    return knex('log').insert(params);
  }
}
