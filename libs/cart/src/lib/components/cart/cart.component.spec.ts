import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartComponent } from './cart.component';
import { CartFacade } from '../../cart.facade';
import { Component, Input, signal } from '@angular/core';
import { CartItemDTO } from '@demo-shop/api';
import { provideRouter } from '@angular/router';
import { CartItemsComponent } from '../shared/cart-items/cart-items.component';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

describe('CartComponent', () => {
  const showCart = signal(false);

  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let cartFacade: CartFacade;

  @Component({ standalone: true, selector: 'lib-cart-items', template: '' })
  class CartItemsStubComponent {
    @Input() items: CartItemDTO[] = [];
  }

  const mockCartItems: CartItemDTO[] = [
    {
      id: 'id',
      productId: 'productId',
      productName: 'productName',
      productThumbnail: 'productThumbnail',
      quantity: 1,
      unitPrice: 1,
      totalPrice: 1,
    },
    {
      id: 'id2',
      productId: 'productId2',
      productName: 'productName2',
      productThumbnail: 'productThumbnail2',
      quantity: 2,
      unitPrice: 1,
      totalPrice: 2,
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartComponent],
      providers: [
        provideRouter([]),
        provideNoopAnimations(),
        {
          provide: CartFacade,
          useValue: {
            getAll: jest.fn().mockReturnValue(signal([mockCartItems])),
            getTotalPrice: jest.fn().mockReturnValue(signal(3)),
            getShowCart: jest.fn().mockReturnValue(showCart),
            removeItem: jest.fn(),
            setShowCart: jest.fn(),
          },
        },
      ],
    })
      .overrideComponent(CartComponent, {
        remove: { imports: [CartItemsComponent] },
        add: { imports: [CartItemsStubComponent] },
      })
      .compileComponents();

    cartFacade = TestBed.inject(CartFacade);
    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('showCart', () => {
    it('should not display the component if showCart is set to false', () => {
      expect(component.showCart()).toBe(false);
      expect(fixture.debugElement.query(By.css('lib-cart-items'))).toBeNull();
      expect(fixture).toMatchSnapshot();
    });

    it('should should display the component if showCart is set to true', () => {
      showCart.set(true);
      fixture.detectChanges();

      expect(component.showCart()).toBe(true);
      expect(fixture.debugElement.query(By.css('lib-cart-items'))).toBeTruthy();
      expect(fixture).toMatchSnapshot();
    });
  });

  it('should remove an item', () => {
    const id = '1';

    component.removeItem(id);

    expect(cartFacade.removeItem).toHaveBeenCalledWith(id);
  });

  it('should close the cart', () => {
    component.closeCart();

    expect(cartFacade.setShowCart).toHaveBeenCalledWith(false);
  });
});
