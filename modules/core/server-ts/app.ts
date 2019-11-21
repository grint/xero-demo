import express from 'express';
import compression from 'compression';
import path from 'path';
import { GraphQLSchema } from 'graphql';

import { isApiExternal, serverPort } from '@gqlapp/core-common';
import ServerModule from '@gqlapp/module-server-ts';

import graphiqlMiddleware from './middleware/graphiql';
import websiteMiddleware from './middleware/website';
import createApolloServer from './graphql';
import errorMiddleware from './middleware/error';

export const createServerApp = (schema: GraphQLSchema, modules: ServerModule) => {
  const XeroClient = require('xero-node').AccountingAPIClient;
  const xero = new XeroClient({
    appType: 'private',
    consumerKey: 'X71YYFYKDD6VIGFKYXXL6PMRBRHMIR',
    consumerSecret: 'JVB0FFOQJ58UHBCHR3YJA4GBYMU1SV',
    callbackUrl: null,
    privateKeyPath: 'privatekey.pem'
  });

  const app = express();
  app.enable('trust proxy');

  if (!__DEV__) {
    app.use(compression());
  }

  (modules.beforeware || []).forEach(applyBeforeware => applyBeforeware(app, modules.appContext));
  (modules.middleware || []).forEach(applyMiddleware => applyMiddleware(app, modules.appContext));

  if (__DEV__) {
    app.get('/servdir', (req, res) => res.send(process.cwd() + path.sep));
  }

  if (!isApiExternal) {
    const graphqlServer = createApolloServer(schema, modules);
    graphqlServer.applyMiddleware({ app, path: __API_URL__, cors: { credentials: true, origin: true } });
  }

  app.get('/callback/:endpoint', async (req: any, res: any) => {
    const endpoint = req.params.endpoint;
    const date = req.query.date || new Date();
    const args = {
      'If-Modified-Since': new Date(date).toISOString().split('.')[0]
    };

    let response;

    if (endpoint === 'invoices') {
      response = await xero.invoices.get(args);
    } else if (endpoint === 'vendors') {
      response = await xero.contacts.get(args);
    } else if (endpoint === 'accounts') {
      response = await xero.accounts.get(args);
    } else {
      console.error('Unsupported endpoint');
    }
    res.send(response);
  });

  app.get('/graphiql', (req, res, next) => graphiqlMiddleware(req, res, next));
  app.use(websiteMiddleware(schema, modules));
  app.use('/', express.static(__FRONTEND_BUILD_DIR__, { maxAge: '180 days' }));

  if (__DEV__) {
    app.use(errorMiddleware);
  }
  return app;
};
