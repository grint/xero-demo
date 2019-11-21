import pdfServer from './pdf/server';
import pdfClient from './pdf/client';
import excel from './excel';

import LogModule from './LogModule';

export default new LogModule(pdfClient, pdfServer, excel);
