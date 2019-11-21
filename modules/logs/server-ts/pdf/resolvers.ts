import { TranslationFunction } from 'i18next';
import generator from './helpers/generator';
import LogsDAO from '../sql';

interface LogsContext {
  Logs: LogsDAO;
  req?: Request & { t: TranslationFunction };
}

export default () => ({
  Query: {
    async pdf(obj: any, arg: any, { Logs, req }: LogsContext) {
      const logs = await Logs.getLogs();
      const { t } = req;
      return generator(logs, t);
    }
  }
});
