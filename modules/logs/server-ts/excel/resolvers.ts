import generateExcel from './helpers/generateExcel';
import LogsDAO from '../sql';

export default () => ({
  Query: {
    async excel(obj: any, arg: any, { Logs }: { Logs: LogsDAO }) {
      const logs = await Logs.getLogs();
      return generateExcel(logs);
    }
  }
});
