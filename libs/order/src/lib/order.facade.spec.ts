import { TestBed } from '@angular/core/testing';
import { OrderFacade } from './order.facade';
import { OrderStore } from './+state/order.store';
import { signal } from '@angular/core';
import { OrderDTO, OrderStatus } from '@demo-shop/api';

describe('OrderFacade', () => {
  let orderFacade: OrderFacade;
  let orderStore: any;

  const mockOrders: OrderDTO[] = [
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

  it('should create an order successfully', async () => {
    await orderFacade.createOrder();

    expect(orderStore.create).toHaveBeenCalled();
  });

  it('should throw an error when creating an order fails', async () => {
    jest.spyOn(console, 'error').mockImplementationOnce(() => undefined);
    jest.spyOn(orderStore, 'create').mockRejectedValue(new Error('API error'));

    await expect(orderFacade.createOrder()).rejects.toThrow('API error');
  });

  it('should return the order entity from the store', () => {
    const order = orderFacade.find(123);

    expect(order()).toEqual(mockOrders[0]);
  });

  it('should return all orders from the store', () => {
    const orders = orderFacade.getAll();

    expect(orders()).toEqual(mockOrders);
  });

  it('should return all orders from the store sorted by status and date', () => {
    const orders = orderFacade.getSortedByStatusAndDate();

    expect(orders()).toEqual(mockOrders);
  });
});
