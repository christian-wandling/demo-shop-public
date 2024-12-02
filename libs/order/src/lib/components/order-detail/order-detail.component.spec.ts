import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderDetailComponent } from './order-detail.component';
import { UserFacade } from '@demo-shop/user';
import { OrderDTO, OrderStatus } from '@demo-shop/api';
import { signal } from '@angular/core';
import { OrderFacade } from '../../order.facade';
import { ActivatedRoute } from '@angular/router';
import { PrintInvoiceService } from '../../services/print-invoice.service';
import { UTCDate } from '@date-fns/utc';

describe('OrderDetailComponent', () => {
  let component: OrderDetailComponent;
  let fixture: ComponentFixture<OrderDetailComponent>;
  let printInvoiceService: PrintInvoiceService;

  const mockUser = {
    address: {
      street: 'street',
      apartment: 'apartment',
      city: 'city',
      region: 'region',
      zip: 'zip',
      country: 'country',
    },
    email: 'email',
    firstname: 'firstname',
    id: 'id',
    lastname: 'lastname',
    phone: 'phone',
  };

  const mockOrder: OrderDTO = {
    id: '1',
    userId: '1',
    items: [],
    amount: 0,
    status: OrderStatus.Created,
    created: new UTCDate(2020, 0, 1).toString(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderDetailComponent],
      providers: [
        { provide: UserFacade, useValue: { getCurrentUser: jest.fn().mockReturnValue(signal(mockUser)) } },
        { provide: OrderFacade, useValue: { find: jest.fn().mockReturnValue(signal(mockOrder)) } },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: {
                id: 'id',
              },
            },
          },
        },
        { provide: PrintInvoiceService, useValue: { generatePdf: jest.fn() } },
      ],
    }).compileComponents();

    printInvoiceService = TestBed.inject(PrintInvoiceService);
    fixture = TestBed.createComponent(OrderDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should match the snapshot', () => {
    expect(fixture).toMatchSnapshot();
  });

  describe('printPdf', () => {
    it('should call generatePDF when user is defined', () => {
      component.printPdf(mockOrder, mockUser);

      expect(printInvoiceService.generatePdf).toHaveBeenCalledWith(mockOrder, mockUser);
    });

    it('should not call generatePDF when user is undefined', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementationOnce(() => undefined);

      component.printPdf(mockOrder, undefined);

      expect(printInvoiceService.generatePdf).not.toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith('Could not find user');

      consoleSpy.mockRestore();
    });
  });
});
