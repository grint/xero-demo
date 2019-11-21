import { knex, returnId } from '@gqlapp/database-server-ts';

export interface Vendor {
  name: string;
  vendorId: string;
}

export interface Vendors {
  vendors: [Vendor];
}

export interface Identifier {
  id: number;
}

export default class VendorDAO {
  public vendorsPagination(limit: number, after: number) {
    return knex
      .select('id', 'name', 'vendorId')
      .from('vendor')
      .orderBy('id', 'desc')
      .limit(limit)
      .offset(after);
  }

  public getTotal() {
    return knex('vendor')
      .countDistinct('id as count')
      .first();
  }

  public vendor(id: number) {
    return knex
      .select('id', 'name', 'vendorId')
      .from('vendor')
      .where('id', '=', id)
      .first();
  }

  public addVendors(params: Vendors) {
    return knex('vendor').insert(params);
  }
}
