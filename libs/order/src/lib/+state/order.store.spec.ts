import { TestBed } from '@angular/core/testing';
import { OrderStore } from './order.store';
import { OrderDataService } from '../services/order-data.service';
import { OrderDTO, OrderStatus } from '@demo-shop/api';

describe('OrderStore', () => {
  let store: any;
  let mockDataService: OrderDataService;

  const mockOrders: OrderDTO[] = [
    {
      id: '1',
      status: OrderStatus.Created,
      created: '2024-01-01T10:00:00Z',
      userId: 'userId',
      items: [],
      amount: 0,
    },
    {
      id: '2',
      status: OrderStatus.Created,
      created: '2024-01-02T10:00:00Z',
      userId: 'userId',
      items: [],
      amount: 0,
    },
    {
      id: '3',
      status: OrderStatus.Completed,
      created: '2024-01-03T10:00:00Z',
      userId: 'userId',
      items: [],
      amount: 0,
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OrderStore,
        {
          provide: OrderDataService,
          useValue: {
            load: jest.fn().mockResolvedValue(mockOrders),
          },
        },
      ],
    });

    mockDataService = TestBed.inject(OrderDataService);
    store = TestBed.inject(OrderStore);
  });

  describe('initialization', () => {
    it('should load orders on init', () => {
      expect(mockDataService.load).toHaveBeenCalled();
    });

    it('should populate store with loaded orders', () => {
      expect(store.entities()).toEqual(mockOrders);
    });
  });

  describe('getById', () => {
    it('should return the correct order by id', () => {
      const order = store.getById('1');
      expect(order()).toEqual(mockOrders[0]);
    });

    it('should return undefined for non-existent id', () => {
      const order = store.getById('non-existent');
      expect(order()).toBeUndefined();
    });
  });

  describe('getSortedByStatusAndDate', () => {
    it('should sort Created orders first, then by date descending', () => {
      const sortedOrders = store.getSortedByStatusAndDate();

      expect(sortedOrders()).toEqual([
        mockOrders[1], // Created, newer date
        mockOrders[0], // Created, older date
        mockOrders[2], // Completed
      ]);
    });
  });
});
