import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductListComponent } from './product-list.component';
import { ProductFacade } from '../../product.facade';
import { ProductResponse } from '@demo-shop/api';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;

  const mockProducts: ProductResponse[] = [
    {
      id: 1,
      name: 'Product 1',
      price: 10,
      description: '',
      categories: [],
      images: [
        {
          name: 'name',
          uri: 'uri',
        },
      ],
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
      images: [
        {
          name: 'name',
          uri: 'uri',
        },
      ],
      thumbnail: {
        name: 'name',
        uri: 'uri',
      },
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductListComponent],
      providers: [
        {
          provide: ProductFacade,
          useValue: {
            getFiltered: jest.fn().mockReturnValue(signal(mockProducts)),
            fetchAll: jest.fn(),
          },
        },
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the products', () => {
    const productItems = fixture.debugElement.queryAll(By.css('.product-item'));

    expect(productItems.length).toBe(mockProducts.length);
  });

  it('should match the snapshot', () => {
    expect(fixture).toMatchSnapshot();
  });
});
