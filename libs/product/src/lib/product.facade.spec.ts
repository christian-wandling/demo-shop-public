import { TestBed } from '@angular/core/testing';
import { ProductFacade } from './product.facade';
import { ProductStore } from './+state/product.store';
import { ProductResponse } from '@demo-shop/api';
import { signal } from '@angular/core';

describe('ProductFacade', () => {
  let facade: ProductFacade;
  let store: any;

  const mockProducts: ProductResponse[] = [
    {
      id: 1,
      name: 'Product 1',
      price: 10,
      description: '',
      categories: [],
      images: [],
      thumbnail: {
        name: 'name',
        uri: 'uri',
      },
    },
    {
      id: 2,
      name: 'Product 2',
      price: 20,
      description: '',
      categories: [],
      images: [],
      thumbnail: {
        name: 'name',
        uri: 'uri',
      },
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductFacade,
        {
          provide: ProductStore,
          useValue: {
            load: jest.fn(),
            filteredEntities: signal(mockProducts),
            filter: signal({ name: 'filter' }),
            getById: jest.fn().mockReturnValue(signal(mockProducts[0])),
            updateFilter: jest.fn(),
          },
        },
      ],
    });

    facade = TestBed.inject(ProductFacade);
    store = TestBed.inject(ProductStore);
  });

  it('should load products', () => {
    facade.load();

    expect(store.load).toHaveBeenCalled();
  });

  it('should get filtered products', () => {
    const filtered = facade.getFiltered();

    expect(filtered()).toEqual(mockProducts);
  });

  it('should get the filter', () => {
    const filter = facade.getFilter();

    expect(filter()).toEqual({ name: 'filter' });
  });

  it('should get a product by id', () => {
    const product = facade.getById(mockProducts[0].id);

    expect(product()).toEqual(mockProducts[0]);
  });

  it('should set the filter', () => {
    facade.setFilter({ name: 'filter' });

    expect(store.updateFilter).toHaveBeenCalled();
  });
});
