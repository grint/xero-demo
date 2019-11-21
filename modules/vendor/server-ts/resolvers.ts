import { PubSub, withFilter } from 'graphql-subscriptions';
import { Vendor, Identifier } from './sql';

interface Edges {
  cursor: number;
  node: Vendor & Identifier;
}

interface VendorsParams {
  limit: number;
  after: number;
}

const VENDORS_SUBSCRIPTION = 'vendors_subscription';

export default (pubsub: PubSub) => ({
  Query: {
    async vendors(obj: any, { limit, after }: VendorsParams, context: any) {
      const edgesArray: Edges[] = [];
      const vendors = await context.Vendor.vendorsPagination(limit, after);
      const total = (await context.Vendor.getTotal()).count;
      const hasNextPage = total > after + limit;

      vendors.map((vendor: Vendor & Identifier, index: number) => {
        edgesArray.push({
          cursor: after + index,
          node: vendor
        });
      });
      const endCursor = edgesArray.length > 0 ? edgesArray[edgesArray.length - 1].cursor : 0;

      return {
        totalCount: total,
        edges: edgesArray,
        pageInfo: {
          endCursor,
          hasNextPage
        }
      };
    },
    vendor(obj: any, { id }: Identifier, context: any) {
      return context.Vendor.vendor(id);
    }
  },
  Vendor: {},
  Mutation: {
    async addVendors(obj: any, args: any, context: any) {
      const total = await context.Vendor.getTotal();
      console.log('total', total.count);

      let date = args.date;
      if (total.count === 0) {
        date = new Date(-8640000000000000).toISOString();
      }
      console.log('DATE', date);
      const vendors = await context.dataSources.vendorsAPI.getVendors(date).then((res: any) => {
        return res;
      });

      if (vendors && vendors.length) {
        await context.Vendor.addVendors(vendors);
      }

      pubsub.publish(VENDORS_SUBSCRIPTION, {
        vendorsUpdated: {
          mutation: 'CREATED',
          vendors
        }
      });

      return vendors;
    }
  },
  Subscription: {
    vendorsUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(VENDORS_SUBSCRIPTION),
        (payload, variables) => {
          return variables.endCursor <= payload.vendorsUpdated.id;
        }
      )
    }
  }
});
