import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import { OrderDTO, UserDTO } from '@demo-shop/api';
import { format } from 'date-fns/format';
import { CompanyData } from '../models/company-data';
import { PaymentTerms } from '../models/payment-terms';
import { DrawOptions } from '../models/draw-options';
import { PdfTableColumns } from '../models/pdf-table.columns';
import { columns, companyData, createDrawOptions, paymentTerms } from '../config/print-invoice.config';

@Injectable({
  providedIn: 'root',
})
export class PrintInvoiceService {
  generatePdf(order: OrderDTO, user: UserDTO) {
    const doc = new jsPDF('p', 'mm', 'A4', true);
    const drawOptions = createDrawOptions(doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight());

    this.addFooter(doc, drawOptions, paymentTerms);
    this.addLogo(doc, drawOptions);
    this.addCompanyInformation(doc, drawOptions, companyData);
    this.addInvoiceDetails(doc, drawOptions, order);
    this.addCustomerInformation(doc, drawOptions, user);
    this.addTableHeader(doc, drawOptions, columns);
    this.addTableItems(doc, drawOptions, columns, order, paymentTerms);
    this.addTableFooter(doc, drawOptions, columns, order);

    doc.save(`invoice-${order.id}.pdf`);
  }

  addLogo(doc: jsPDF, options: DrawOptions): void {
    options.pointer.x = options.border.left;
    options.pointer.y = options.border.top;

    const width = 25;
    const height = 25;

    doc.addImage('icons/demo-shop.png', 'PNG', options.pointer.x, options.pointer.y, width, height);
  }

  addCompanyInformation(doc: jsPDF, options: DrawOptions, companyData: CompanyData): void {
    options.pointer.x = options.border.right;
    options.pointer.y += 6;
    doc.setFont(options.text.font.default, 'bold');
    doc.setFontSize(options.text.size.small);
    doc.setTextColor(options.text.color.light);
    doc.text(companyData.name, options.pointer.x, options.pointer.y, { align: 'right' });

    options.pointer.y += 4;
    doc.setFont(options.text.font.default);
    doc.setFontSize(options.text.size.smaller);
    doc.text(companyData.address, options.pointer.x, options.pointer.y, { align: 'right' });

    options.pointer.y += 4;
    doc.text(companyData.city + ', ' + companyData.zipCode, options.pointer.x, options.pointer.y, { align: 'right' });

    options.pointer.y += 4;
    doc.text(companyData.phone, options.pointer.x, options.pointer.y, { align: 'right' });

    options.pointer.y += 4;
    doc.text(companyData.email, options.pointer.x, options.pointer.y, { align: 'right' });
  }

  addInvoiceDetails(doc: jsPDF, options: DrawOptions, order: OrderDTO): void {
    options.pointer.y += 22;
    doc.setFontSize(options.text.size.smaller);
    doc.setFont(options.text.font.default, 'bold');
    doc.text(`INVOICE #${order.id}`, options.pointer.x, options.pointer.y, { align: 'right' });

    options.pointer.y += 4;
    const date = format(order.created, 'yyyy-MM-dd');
    doc.setFont(options.text.font.default);
    doc.text(date, options.pointer.x, options.pointer.y, { align: 'right' });
  }

  addCustomerInformation(doc: jsPDF, options: DrawOptions, user: UserDTO): void {
    options.pointer.x = options.border.left;
    options.pointer.y += 15;
    doc.setFontSize(options.text.size.smaller);
    doc.setFont('Helvetica', 'bold');
    doc.text('YOUR DATA:', options.pointer.x, options.pointer.y);
    doc.setFont('Helvetica');

    options.pointer.y += 6;
    doc.text(`${user.firstname} ${user.lastname}`, options.pointer.x, options.pointer.y);

    options.pointer.y += 4;
    doc.text(`${user.address.street} ${user.address.apartment}`, options.pointer.x, options.pointer.y);

    options.pointer.y += 4;
    doc.text(`${user.address.city}, ${user.address.zip}`, options.pointer.x, options.pointer.y);

    options.pointer.y += 4;
    doc.text(user.address.country, options.pointer.x, options.pointer.y);

    options.pointer.y += 4;
    doc.text(user.email, options.pointer.x, options.pointer.y);
  }

  addTableHeader(doc: jsPDF, options: DrawOptions, columns: PdfTableColumns): void {
    options.pointer.y += 20;
    this.addLine(doc, options);

    options.pointer.y += 4;
    doc.setFontSize(options.text.size.smaller);
    doc.setTextColor(options.text.color.darker);
    doc.setFont('Helvetica', 'bold');

    doc.text(columns.article.label, columns.article.x, options.pointer.y, { baseline: 'middle' });
    doc.text(columns.qty.label, columns.qty.x, options.pointer.y, { baseline: 'middle', align: 'center' });
    doc.text(columns.price.label, columns.price.x, options.pointer.y, { baseline: 'middle', align: 'right' });
    doc.text(columns.amount.label, columns.amount.x, options.pointer.y, { baseline: 'middle', align: 'right' });

    options.pointer.y += 4;
    this.addLine(doc, options);
  }

  addTableItems(
    doc: jsPDF,
    options: DrawOptions,
    columns: PdfTableColumns,
    order: OrderDTO,
    paymentTerms: PaymentTerms
  ): void {
    const limitForNewContent = options.border.bottom - 40;

    options.pointer.y += 4;
    doc.setFont('Helvetica', 'normal');

    order.items.forEach(item => {
      options.pointer.y += 6;

      if (options.pointer.y > limitForNewContent) {
        this.addPage(doc, options, paymentTerms);
      }

      doc.setTextColor(options.text.color.dark);
      doc.setFontSize(options.text.size.smaller);
      doc.text(item.productName, columns.article.x, options.pointer.y);
      doc.text(item.quantity.toString(), columns.qty.x, options.pointer.y, { align: 'center' });
      doc.text(`$${item.unitPrice.toFixed(2)}`, columns.price.x, options.pointer.y, { align: 'right' });
      doc.text(`$${item.totalPrice.toFixed(2)}`, columns.amount.x, options.pointer.y, { align: 'right' });
    });
  }

  addTableFooter(doc: jsPDF, options: DrawOptions, columns: PdfTableColumns, order: OrderDTO) {
    options.pointer.y += 6;
    this.addLine(doc, options);

    options.pointer.y += 6;
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(options.text.size.smaller);
    doc.text('Total', columns.price.x, options.pointer.y, { align: 'right' });
    doc.text(`$${order.amount.toFixed(2)}`, columns.amount.x, options.pointer.y, { align: 'right' });
  }

  addPage(doc: jsPDF, options: DrawOptions, paymentTerms: PaymentTerms) {
    doc.addPage();
    options.pointer.y = options.border.top;
    this.addFooter(doc, options, paymentTerms);
  }

  addFooter(doc: jsPDF, options: DrawOptions, paymentTerms: PaymentTerms) {
    const xCenter = doc.internal.pageSize.getWidth() / 2;
    let y = options.border.bottom;

    this.addLine(doc, options);

    y += 6;
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(options.text.size.tiny);
    doc.setTextColor(options.text.color.lighter);
    doc.setFont('Helvetica', 'normal');
    doc.text(paymentTerms.terms, xCenter, y, { align: 'center' });

    y += 3;
    const bankingText = `BANK: ${paymentTerms.bankName} - ACCOUNT NAME: ${paymentTerms.accountName} - ACCOUNT NO.: ${paymentTerms.accountNumber} - ROUTING NUMBER: ${paymentTerms.routingNumber}`;
    doc.text(bankingText, xCenter, y, { align: 'center' });
  }

  addLine(doc: jsPDF, options: DrawOptions): void {
    doc.setDrawColor(options.line.color.light);
    doc.line(options.border.left, options.pointer.y, options.border.right, options.pointer.y);
  }
}
