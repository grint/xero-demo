import React from 'react';

import resources from './locales';
import DownloadLog from './containers/DownloadLog';
import LogModule from '../LogModule';

export default new LogModule({
  localization: [{ ns: 'ExcelLog', resources }],
  logComponent: [<DownloadLog />]
});
