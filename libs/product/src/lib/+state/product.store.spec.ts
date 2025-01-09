import { TestBed } from '@angular/core/testing';
import { ProductStore } from './product.store';
import { ProductDataService } from '../services/product-data.service';
import { ProductDTO } from '@demo-shop/api';

describe('ProductStore', () => {
  let productStore: any;
  let productDataService: ProductDataService;

  const mockEntities: ProductDTO[] = [
    {
      id: 1,
      name: 'Product 1',
      categories: ['Electronics'],
      description: '',
      images: [],
      price: 0,
    },
    {
      id: 2,
      name: 'Product 2',
      categories: ['Furniture'],
      description: '',
      images: [],
      price: 0,
    },
    {
      id: 3,
      name: 'Product 3',
      categories: ['Electronics'],
      description: '',
      images: [],
      price: 0,
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ProductDataService,
          useValue: {
            load: jest.fn().mockResolvedValue(mockEntities),
          },
        },
      ],
    });
    productDataService = TestBed.inject(ProductDataService);
    productStore = TestBed.inject(ProductStore);
  });

  it('should initialize and call load on init', () => {
    productStore.load();

    expect(productDataService.load).toHaveBeenCalled();
  });

  it('should filter entities based on category', () => {
    productStore.updateFilter({ categories: 'Electronics' });

    const filteredEntities = productStore.filteredEntities();

    expect(filteredEntities.length).toBe(2);
  });

  it('should filter entities based on name', () => {
    productStore.updateFilter({ name: 'Product 1' });

    const filteredEntities = productStore.filteredEntities();

    expect(filteredEntities.length).toBe(1);
  });

  it('should return all entities when no filter is applied', () => {
    productStore.updateFilter({});

    const filteredEntities = productStore.filteredEntities();

    expect(filteredEntities.length).toBe(3);
    expect(filteredEntities).toEqual(mockEntities);
  });

  it('should get an entity by ID and update selection', () => {
    const entity = productStore.getById(1);

    expect(entity()).toEqual(mockEntities[0]);
  });

  it('should return undefined for non-existent entity ID', () => {
    const entity = productStore.getById('non-existant');

    expect(entity()).toBeUndefined();
  });
});
