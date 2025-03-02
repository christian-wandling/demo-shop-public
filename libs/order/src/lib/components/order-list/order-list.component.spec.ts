import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderListComponent } from './order-list.component';
import { UserFacade } from '@demo-shop/user';
import { signal } from '@angular/core';
import { OrderResponse, OrderStatus } from '@demo-shop/api';
import { OrderFacade } from '../../order.facade';
import { provideRouter } from '@angular/router';
import { UTCDate } from '@date-fns/utc';

describe('OrderListComponent', () => {
  let component: OrderListComponent;
  let fixture: ComponentFixture<OrderListComponent>;

  const user = {
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
    id: 1,
    lastname: 'lastname',
    phone: 'phone',
  };

  const orders: OrderResponse[] = [
    {
      id: 1,
      userId: 1,
      items: [],
      amount: 0,
      status: OrderStatus.Created,
      created: new UTCDate(2020, 0, 1).toString(),
    },
    {
      id: 2,
      userId: 1,
      items: [],
      amount: 0,
      status: OrderStatus.Created,
      created: new UTCDate(2020, 0, 1).toString(),
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderListComponent],
      providers: [
        { provide: UserFacade, useValue: { getCurrentUser: jest.fn().mockReturnValue(signal(user)) } },
        { provide: OrderFacade, useValue: { getSortedByStatusAndDate: jest.fn().mockReturnValue(signal(orders)) } },
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should match the snapshot', () => {
    expect(fixture).toMatchSnapshot();
  });
});
