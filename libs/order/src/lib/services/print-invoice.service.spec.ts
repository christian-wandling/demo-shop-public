import { TestBed } from '@angular/core/testing';
import { PrintInvoiceService } from './print-invoice.service';
import { jsPDF } from 'jspdf';
import { OrderDTO, OrderStatus, UserDTO } from '@demo-shop/api';
import { columns, companyData, createDrawOptions, paymentTerms } from '../config/print-invoice.config';

jest.mock('jspdf', () => {
  return {
    jsPDF: jest.fn().mockImplementation(() => ({
      internal: {
        pageSize: {
          getWidth: jest.fn().mockReturnValue(210),
          getHeight: jest.fn().mockReturnValue(297),
        },
      },
      addImage: jest.fn(),
      setFont: jest.fn(),
      setFontSize: jest.fn(),
      setTextColor: jest.fn(),
      setDrawColor: jest.fn(),
      text: jest.fn(),
      line: jest.fn(),
      addPage: jest.fn(),
      save: jest.fn(),
    })),
  };
});

describe('PrintInvoiceService', () => {
  let service: PrintInvoiceService;
  const mockDoc = new jsPDF('p', 'mm', 'A4', true);

  const mockOrder: OrderDTO = {
    id: '12345',
    created: new Date('2024-01-01').toString(),
    items: [
      {
        productName: 'Test Product',
        quantity: 2,
        unitPrice: 10.99,
        totalPrice: 21.98,
        productId: '',
        productThumbnail: '',
      },
    ],
    amount: 21.98,
    userId: '12345',
    status: OrderStatus.Created,
  };

  const mockUser: UserDTO = {
    id: '12345',
    firstname: 'John',
    lastname: 'Doe',
    email: 'john@example.com',
    phone: '123-456789',
    address: {
      street: '123 Test St',
      apartment: 'Apt 4B',
      city: 'Test City',
      zip: '12345',
      country: 'Test Country',
      region: '',
    },
  };

  const drawOptions = createDrawOptions(210, 297);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PrintInvoiceService],
    });
    service = TestBed.inject(PrintInvoiceService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generatePdf', () => {
    it('should create a PDF document and call all required methods', () => {
      const addFooterSpy = jest.spyOn(service, 'addFooter');
      const addLogoSpy = jest.spyOn(service, 'addLogo');
      const addCompanyInformationSpy = jest.spyOn(service, 'addCompanyInformation');
      const addInvoiceDetailsSpy = jest.spyOn(service, 'addInvoiceDetails');
      const addCustomerInformationSpy = jest.spyOn(service, 'addCustomerInformation');
      const addTableHeaderSpy = jest.spyOn(service, 'addTableHeader');
      const addTableItemsSpy = jest.spyOn(service, 'addTableItems');
      const addTableFooterSpy = jest.spyOn(service, 'addTableFooter');

      service.generatePdf(mockOrder, mockUser);

      expect(jsPDF).toHaveBeenCalledWith('p', 'mm', 'A4', true);
      expect(addFooterSpy).toHaveBeenCalled();
      expect(addLogoSpy).toHaveBeenCalled();
      expect(addCompanyInformationSpy).toHaveBeenCalled();
      expect(addInvoiceDetailsSpy).toHaveBeenCalled();
      expect(addCustomerInformationSpy).toHaveBeenCalled();
      expect(addTableHeaderSpy).toHaveBeenCalled();
      expect(addTableItemsSpy).toHaveBeenCalled();
      expect(addTableFooterSpy).toHaveBeenCalled();
    });
  });

  describe('addLogo', () => {
    it('should add logo image to the document', () => {
      service.addLogo(mockDoc, drawOptions);

      expect(mockDoc.addImage).toHaveBeenCalledWith('icons/demo-shop.png', 'PNG', 15, 15, 25, 25);
    });
  });

  describe('addCompanyInformation', () => {
    it('should add company information to the document', () => {
      service.addCompanyInformation(mockDoc, drawOptions, companyData);

      expect(mockDoc.setFont).toHaveBeenCalledWith('Helvetica', 'bold');
      expect(mockDoc.setFontSize).toHaveBeenCalledWith(9);
      expect(mockDoc.text).toHaveBeenCalledWith('Demo Shop', 195, 21, { align: 'right' });
    });
  });

  describe('addTableItems', () => {
    it('should add new page when content exceeds page limit', () => {
      const longOrder = {
        ...mockOrder,
        items: Array(50).fill(mockOrder.items[0]),
      };

      const addPageSpy = jest.spyOn(service, 'addPage');

      service.addTableItems(mockDoc, drawOptions, columns, longOrder, paymentTerms);

      expect(addPageSpy).toHaveBeenCalled();
    });
  });

  describe('addLine', () => {
    it('should draw a line with correct coordinates', () => {
      service.addLine(mockDoc, drawOptions);

      expect(mockDoc.setDrawColor).toHaveBeenCalledWith(200);
      expect(mockDoc.line).toHaveBeenCalled();
    });
  });

  describe('addInvoiceDetails', () => {
    it('should add invoice number and date', () => {
      service.addInvoiceDetails(mockDoc, drawOptions, mockOrder);

      expect(mockDoc.setFont).toHaveBeenCalledWith('Helvetica', 'bold');
      expect(mockDoc.text).toHaveBeenCalled();
    });
  });
});
