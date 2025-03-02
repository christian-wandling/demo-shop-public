import { TestBed } from '@angular/core/testing';
import { ProductDataService } from './product-data.service';
import { ProductResponse, ProductApi, ProductListResponse } from '@demo-shop/api';
import { of } from 'rxjs';

describe('ProductDataService', () => {
  let service: ProductDataService;
  let productApi: ProductApi;

  const mockProducts: ProductListResponse = {
    items: [
      {
        id: 1,
        name: 'Product 1',
        description: '',
        categories: [],
        images: [],
        price: 0,
        thumbnail: {
          name: 'name',
          uri: 'uri',
        },
      },
      {
        id: 2,
        name: 'Product 2',
        description: '',
        categories: [],
        images: [],
        price: 0,
        thumbnail: {
          name: 'name',
          uri: 'uri',
        },
      },
    ],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductDataService,
        {
          provide: ProductApi,
          useValue: {
            getAllProducts: jest.fn().mockReturnValue(of(mockProducts)),
            getProductById: jest.fn().mockReturnValue(of(mockProducts.items[0])),
          },
        },
      ],
    });

    service = TestBed.inject(ProductDataService);
    productApi = TestBed.inject(ProductApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all products', async () => {
    const products = await service.load({});

    expect(products).toEqual(mockProducts.items);
    expect(productApi.getAllProducts).toHaveBeenCalled();
  });

  it('should get a product by id', async () => {
    const product = await service.loadById(1);

    expect(product).toEqual(mockProducts.items[0]);
    expect(productApi.getProductById).toHaveBeenCalledWith(1);
  });

  it('should throw an error when calling not implemented functions', async () => {
    await expect(() => service.create(mockProducts.items[0])).rejects.toEqual(new Error('Not implemented'));
    await expect(() => service.delete(mockProducts.items[0])).rejects.toEqual(new Error('Not implemented'));
    await expect(() => service.update(mockProducts.items[0])).rejects.toEqual(new Error('Not implemented'));
    await expect(() => service.updateAll(mockProducts.items)).rejects.toEqual(new Error('Not implemented'));
  });
});
