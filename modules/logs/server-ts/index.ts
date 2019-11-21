import ServerModule from '@gqlapp/module-server-ts';

import LogsDAO from './sql';
import schema from './schema.graphql';
import createResolvers from './resolvers';
import resources from './locales';
import pdf from './pdf';
import excel from './excel';

export default new ServerModule(pdf, excel, {
  schema: [schema],
  createResolversFunc: [createResolvers],
  createContextFunc: [() => ({ Logs: new LogsDAO() })],
  localization: [{ ns: 'logs', resources }]
});
