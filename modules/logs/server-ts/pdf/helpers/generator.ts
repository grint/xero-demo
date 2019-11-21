import { TranslationFunction } from 'i18next';
import PDFBuilder from './PDFBuilder';
import { Log } from '../../models/log';

function createPDF(logs: Log[], t: TranslationFunction) {
  const pdf = new PDFBuilder();

  pdf.addStyle('header', {
    fontSize: 16,
    bold: true,
    margin: [0, 0, 0, 10]
  });

  pdf.addStyle('subheader', {
    fontSize: 13,
    bold: true,
    margin: [0, 10, 0, 5]
  });

  pdf.addText(t('PdfLog:title'), 'header');
  pdf.addText(t('PdfLog:date') + new Date().toLocaleDateString(), 'subheader');
  pdf.addTable(logs, Object.keys(logs[0]).map((_, i) => (i === 0 ? 'auto' : 'auto')));

  return pdf.getDocument();
}

export default function generator(logs: Log[], t: TranslationFunction) {
  const doc = createPDF(logs, t);
  const chunks: Uint8Array[] = [];

  doc.on('data', (chunk: Uint8Array) => {
    chunks.push(chunk);
  });

  const buffer = new Promise(res => {
    doc.on('end', () => {
      res(Buffer.concat(chunks));
    });
  });

  doc.end();

  return buffer;
}
