import React from 'react';

import resources from './locales';
import PrintLog from './containers/PrintLog';
import LogModule from '../../LogModule';

export default new LogModule({
  localization: [{ ns: 'PrintLog', resources }],
  logComponent: [<PrintLog />]
});
