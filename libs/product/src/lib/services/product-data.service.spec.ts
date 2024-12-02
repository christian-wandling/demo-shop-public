import { TestBed } from '@angular/core/testing';
import { ProductDataService } from './product-data.service';
import { ProductDTO, ProductsApi } from '@demo-shop/api';
import { of } from 'rxjs';

describe('ProductDataService', () => {
  let service: ProductDataService;
  let productsApi: ProductsApi;

  const mockProducts: ProductDTO[] = [
    {
      id: '1',
      name: 'Product 1',
      description: '',
      categories: [],
      images: [],
      price: 0,
    },
    {
      id: '2',
      name: 'Product 2',
      description: '',
      categories: [],
      images: [],
      price: 0,
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductDataService,
        {
          provide: ProductsApi,
          useValue: {
            getAllProducts: jest.fn().mockReturnValue(of(mockProducts)),
            getProduct: jest.fn().mockReturnValue(of(mockProducts[0])),
          },
        },
      ],
    });

    service = TestBed.inject(ProductDataService);
    productsApi = TestBed.inject(ProductsApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all products', async () => {
    const products = await service.load({});

    expect(products).toEqual(mockProducts);
    expect(productsApi.getAllProducts).toHaveBeenCalled();
  });

  it('should get a product by id', async () => {
    const product = await service.loadById('1');

    expect(product).toEqual(mockProducts[0]);
    expect(productsApi.getProduct).toHaveBeenCalledWith('1');
  });

  it('should throw an error when calling not implemented functions', async () => {
    await expect(() => service.create(mockProducts[0])).rejects.toEqual(new Error('Not implemented'));
    await expect(() => service.delete(mockProducts[0])).rejects.toEqual(new Error('Not implemented'));
    await expect(() => service.update(mockProducts[0])).rejects.toEqual(new Error('Not implemented'));
    await expect(() => service.updateAll(mockProducts)).rejects.toEqual(new Error('Not implemented'));
  });
});
