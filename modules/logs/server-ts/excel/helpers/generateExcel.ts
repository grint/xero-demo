import * as xl from 'excel4node';
import { Log } from '../../models/log';

const wb = new xl.Workbook();
const options = {
  sheetFormat: {
    defaultColWidth: 25
  }
};
const style = wb.createStyle({
  font: {
    color: '#000000',
    size: 12
  }
});

export default function generateBufferExcel(logs: Log[]) {
  const ws = wb.addWorksheet('Log', options);
  const titles = Object.keys(logs[0]);

  titles.forEach((title, i) => {
    const capitalized = title[0].toUpperCase() + title.slice(1);
    ws.cell(1, i + 1)
      .string(capitalized)
      .style(style);
  });

  logs.forEach((item, i) => {
    const values = Object.values(item);
    values.forEach((value, j) => {
      ws.cell(i + 2, j + 1)
        .string(String(value))
        .style(style);
    });
  });

  return wb.writeToBuffer();
}
