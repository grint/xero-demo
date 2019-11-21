import LogsDAO from './sql';
import { PubSub, withFilter } from 'graphql-subscriptions';

// export interface Vendor {
//   vendorId: string;
//   name: string;
// }

// interface Vendors {
//   vendors: Vendor
// }

export default (pubsub: PubSub) => ({
  Query: {
    async log(obj: any, arg: any, { Logs }: { Logs: LogsDAO }) {
      const logs = Logs.getLogs();
      return logs;
    },
    async vendorLog(obj: any, arg: any, { Logs }: { Logs: LogsDAO }) {
      const logs = Logs.getLastVendorLog();
      return logs;
    }
  },
  Mutation: {
    async addLog(obj: any, args: any, context: any) {
      await context.Log.addLog(args.log);

      pubsub.publish('logs_subscription', {
        logsUpdated: {
          mutation: 'CREATED',
          logs: args.logs
        }
      });

      return args.log;
    }
  },
  Subscription: {
    vendorsUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator('logs_subscription'),
        (payload, variables) => {
          return variables.endCursor <= payload.vendorsUpdated.id;
        }
      )
    }
  }
});
