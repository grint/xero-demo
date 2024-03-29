import PdfPrinter from 'pdfmake';
import { Content, Style } from 'pdfmake/build/pdfmake';
import fonts from './fonts/Roboto/';
import { Log } from '../../models/log';

export default class PDFBuilder {
  private printer = new PdfPrinter(fonts);
  private content: Content = [];
  private styles: { [name: string]: Style } = {};

  public addText(text: string, style?: string, alignment?: string) {
    this.content.push({
      text,
      style,
      alignment
    });
  }

  public addStyle(name: string, style: Style) {
    this.styles[name] = style;
  }

  public addTable(data: Log[], columnsWidth: string[]) {
    this.content.push({
      table: {
        widths: columnsWidth,
        body: [Object.keys(data[0]), ...data.map(item => Object.values(item))]
      }
    });
  }

  public addList(data: Array<string | number>, type = 'ul') {
    this.content.push({
      [type]: data
    });
  }

  public addImage(image: string, width: number, height: number) {
    this.content.push({
      image,
      width,
      height
    });
  }

  public getDocument() {
    return this.printer.createPdfKitDocument({
      pageOrientation: 'landscape',
      content: this.content,
      styles: this.styles
    });
  }
}
