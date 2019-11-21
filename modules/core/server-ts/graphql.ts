import { ApolloServer, AuthenticationError, ApolloError } from 'apollo-server-express';
import { formatResponse } from 'apollo-logger';
import { GraphQLSchema } from 'graphql';
import 'isomorphic-fetch';

import { log } from '@gqlapp/core-common';
import ServerModule from '@gqlapp/module-server-ts';
import settings from '@gqlapp/config';

const { RESTDataSource } = require('apollo-datasource-rest');
import { isApiExternal, serverPort } from '@gqlapp/core-common';


export default (schema: GraphQLSchema, modules: ServerModule) => {
  // const VendorsAPI = require('./vendorsAPI.ts');

  class VendorsAPI extends RESTDataSource {
    constructor() {
      super();
      // this.baseURL = '/callback/';
    }

    async getVendors(date: string) {
      try {
        const data = await this.get(`http://localhost:${serverPort}/callback/vendors?date=${date}`, null, {});
        return data.Contacts.filter((c: any) => c.IsSupplier && c.ContactStatus === 'ACTIVE').map((c: any) => {
          return {
            vendorId: c.ContactID,
            name: c.Name
          };
        });
      } catch (error) {
        console.error(error);
      }
    }
  }

  return new ApolloServer({
    schema,
    context: async ({ req, res }: { req: Request; res: Response }) => ({
      ...(await modules.createContext(req, res)),
      req,
      res
    }),
    formatError: (error: ApolloError) =>
      error.message === 'Not Authenticated!' ? new AuthenticationError(error.message) : error,
    formatResponse: (response: any, options: { [key: string]: any }) =>
      settings.app.logging.apolloLogging
        ? formatResponse({ logger: log.debug.bind(log) }, response, options)
        : response,
    tracing: !!settings.engine.apiKey,
    cacheControl: !!settings.engine.apiKey,
    engine: settings.engine.apiKey ? { apiKey: settings.engine.apiKey } : false,
    playground: false,
    dataSources: () => ({
      'vendorsAPI': new VendorsAPI()
    })
  });
};
