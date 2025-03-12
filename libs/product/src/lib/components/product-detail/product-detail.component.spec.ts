import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductDetailComponent } from './product-detail.component';
import { ActivatedRoute } from '@angular/router';
import { ProductFacade } from '../../product.facade';
import { CartFacade } from '@demo-shop/cart';
import { signal } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('ProductDetailComponent', () => {
  const hasShoppingSession = signal(false);

  let component: ProductDetailComponent;
  let fixture: ComponentFixture<ProductDetailComponent>;
  let cartFacade: CartFacade;

  const mockProduct = signal({
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
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: {
                id: 1,
              },
            },
          },
        },
        {
          provide: ProductFacade,
          useValue: {
            getById: jest.fn().mockReturnValue(mockProduct),
            fetchById: jest.fn(),
          },
        },
        {
          provide: CartFacade,
          useValue: {
            getHasShoppingSession: jest.fn().mockReturnValue(hasShoppingSession),
            addItem: jest.fn(),
          },
        },
      ],
    }).compileComponents();

    cartFacade = TestBed.inject(CartFacade);
    fixture = TestBed.createComponent(ProductDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should match the snapshot', () => {
    expect(fixture).toMatchSnapshot();
  });

  it('should render the product details', () => {
    expect(fixture.debugElement.query(By.css('.product-detail'))).toMatchSnapshot();
  });

  describe('addButton', () => {
    it('should be enabled if a shoppingSession exists', () => {
      hasShoppingSession.set(true);
      fixture.detectChanges();

      const btn = fixture.debugElement.query(By.css('.btn-add'));

      expect(btn.nativeElement.disabled).toBe(false);
    });

    it('should be disabled if no shoppingSession exists', () => {
      hasShoppingSession.set(false);
      fixture.detectChanges();

      const btn = fixture.debugElement.query(By.css('.btn-add'));

      expect(btn.nativeElement.disabled).toBe(true);
    });
  });

  it('should add the item to the cart', () => {
    component.addToCart(1);

    expect(cartFacade.addItem).toHaveBeenCalledWith(1);
  });
});
