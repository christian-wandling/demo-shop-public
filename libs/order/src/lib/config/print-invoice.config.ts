import { DrawOptions } from '../models/draw-options';
import { PdfTableColumns } from '../models/pdf-table.columns';
import { CompanyData } from '../models/company-data';
import { PaymentTerms } from '../models/payment-terms';

export const createDrawOptions = (width: number, height: number, margin = 15): DrawOptions => ({
  pointer: {
    x: 0,
    y: 0,
  },
  border: {
    left: margin,
    right: width - margin,
    top: margin,
    bottom: height - margin,
  },
  line: {
    color: {
      light: 200,
    },
  },
  text: {
    color: {
      darker: 25,
      dark: 50,
      light: 125,
      lighter: 150,
    },
    size: {
      tiny: 6,
      smaller: 8,
      small: 9,
      default: 10,
    },
    font: {
      default: 'Helvetica',
    },
  },
});

export const columns: PdfTableColumns = {
  article: { label: 'Article', x: 15, width: 105 },
  qty: { label: 'Qty', x: 125, width: 20 },
  price: { label: 'Price', x: 165, width: 30 },
  amount: { label: 'Amount', x: 195, width: 30 },
};

export const companyData: CompanyData = {
  name: 'Demo Shop',
  address: '123 Business Street',
  city: 'Business City',
  zipCode: '12345',
  phone: '(555) 123-4567',
  email: 'company@example.com',
};

export const paymentTerms: PaymentTerms = {
  terms: 'payment due within 30 days of invoice date',
  bankName: 'First National Bank',
  accountName: 'Demo Shop',
  accountNumber: '1234567890',
  routingNumber: '987654321',
};
