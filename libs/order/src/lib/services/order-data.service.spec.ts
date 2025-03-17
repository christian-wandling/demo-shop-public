import { TestBed } from '@angular/core/testing';
import { OrderDataService } from './order-data.service';
import { OrderApi, OrderStatus, OrderListResponse } from '@demo-shop/api';
import { of } from 'rxjs';

describe('OrderDataService', () => {
  let service: OrderDataService;
  let orderApi: OrderApi;

  const mockOrders: OrderListResponse = {
    items: [
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
    ],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OrderDataService,
        {
          provide: OrderApi,
          useValue: {
            getAllOrdersOfCurrentUser: jest.fn().mockReturnValue(of(mockOrders)),
            getOrderById: jest.fn().mockReturnValue(of(mockOrders.items[0])),
          },
        },
      ],
    });

    service = TestBed.inject(OrderDataService);
    orderApi = TestBed.inject(OrderApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all orders of current user', async () => {
    const orders = await service.load({});

    expect(orders).toEqual(mockOrders.items);
    expect(orderApi.getAllOrdersOfCurrentUser).toHaveBeenCalled();
  });

  it('should get an order by id', async () => {
    const order = await service.loadById(1);

    expect(order).toEqual(mockOrders.items[0]);
    expect(orderApi.getOrderById).toHaveBeenCalledWith(1);
  });

  it('should throw an error when calling not implemented functions', async () => {
    await expect(() => service.delete(mockOrders.items[0])).rejects.toEqual(new Error('Not implemented'));
    await expect(() => service.update(mockOrders.items[0])).rejects.toEqual(new Error('Not implemented'));
    await expect(() => service.updateAll(mockOrders.items)).rejects.toEqual(new Error('Not implemented'));
  });
});
