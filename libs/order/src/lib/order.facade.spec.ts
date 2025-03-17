import { TestBed } from '@angular/core/testing';
import { OrderFacade } from './order.facade';
import { OrderStore } from './+state/order.store';
import { signal } from '@angular/core';
import { OrderResponse, OrderStatus } from '@demo-shop/api';

describe('OrderFacade', () => {
  let orderFacade: OrderFacade;
  let orderStore: any;

  const mockOrders: OrderResponse[] = [
    {
      id: 1,
      userId: 1,
      items: [],
      amount: 0,
      status: OrderStatus.Created,
      created: new Date().toString(),
    },
    {
      id: 2,
      userId: 1,
      items: [],
      amount: 0,
      status: OrderStatus.Created,
      created: new Date().toString(),
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OrderFacade,
        {
          provide: OrderStore,
          useValue: {
            load: jest.fn(),
            getById: jest.fn().mockReturnValue(signal(mockOrders[0])),
            getSortedByStatusAndDate: jest.fn().mockReturnValue(signal(mockOrders)),
            create: jest.fn(),
            entities: signal(mockOrders),
          },
        },
      ],
    });

    orderFacade = TestBed.inject(OrderFacade);
    orderStore = TestBed.inject(OrderStore);
  });

  it('should return the order entity from the store', () => {
    const order = orderFacade.getById(123);

    expect(order()).toEqual(mockOrders[0]);
  });

  it('should return all orders from the store sorted by status and date', () => {
    const orders = orderFacade.getSortedByStatusAndDate();

    expect(orders()).toEqual(mockOrders);
  });
});
