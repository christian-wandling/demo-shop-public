import { TestBed } from '@angular/core/testing';
import { OrderDataService } from './order-data.service';
import { OrderDTO, OrdersApi, OrderStatus } from '@demo-shop/api';
import { of } from 'rxjs';
import spyOn = jest.spyOn;

describe('OrderDataService', () => {
  let service: OrderDataService;
  let ordersApi: OrdersApi;

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
        OrderDataService,
        {
          provide: OrdersApi,
          useValue: {
            getOrdersOfCurrentUser: jest.fn().mockReturnValue(of(mockOrders)),
            getOrder: jest.fn().mockReturnValue(of(mockOrders[0])),
            createOrder: jest.fn().mockReturnValue(of(mockOrders[0])),
          },
        },
      ],
    });

    service = TestBed.inject(OrderDataService);
    ordersApi = TestBed.inject(OrdersApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all orders of current user', async () => {
    const orders = await service.load({});

    expect(orders).toEqual(mockOrders);
    expect(ordersApi.getOrdersOfCurrentUser).toHaveBeenCalled();
  });

  it('should get an order by id', async () => {
    const order = await service.loadById(1);

    expect(order).toEqual(mockOrders[0]);
    expect(ordersApi.getOrder).toHaveBeenCalledWith(1);
  });

  it('should create an order', async () => {
    const load = spyOn(service, 'load');
    const order = await service.create({} as OrderDTO);

    expect(order).toEqual(mockOrders[0]);
    expect(ordersApi.createOrder).toHaveBeenCalled();
    expect(load).toHaveBeenCalledWith({});
  });

  it('should throw an error when calling not implemented functions', async () => {
    await expect(() => service.delete(mockOrders[0])).rejects.toEqual(new Error('Not implemented'));
    await expect(() => service.update(mockOrders[0])).rejects.toEqual(new Error('Not implemented'));
    await expect(() => service.updateAll(mockOrders)).rejects.toEqual(new Error('Not implemented'));
  });
});
