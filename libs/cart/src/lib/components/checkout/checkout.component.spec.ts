import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckoutComponent } from './checkout.component';
import { CartFacade } from '../../cart.facade';
import { signal, WritableSignal } from '@angular/core';
import { UserFacade } from '@demo-shop/user';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { provideRouter, Router } from '@angular/router';
import { CartItemResponse, UserResponse } from '@demo-shop/api';
import { provideMockImageLoader } from '@demo-shop/shared';

describe('CheckoutComponent', () => {
  const mockUser: WritableSignal<UserResponse> = signal({
    id: 1,
    email: 'john@doe.com',
    firstname: 'John',
    lastname: 'Doe',
    phone: '123-456789',
    address: {
      street: 'street',
      apartment: 'apartment',
      city: 'city',
      region: 'region',
      zip: 'zip',
      country: 'country',
    },
  });

  const cartItems: WritableSignal<CartItemResponse[]> = signal([
    {
      id: 0,
      productId: 0,
      productName: 'productName',
      productThumbnail: 'productThumbnail',
      quantity: 0,
      unitPrice: 0,
      totalPrice: 0,
    },
  ]);

  let component: CheckoutComponent;
  let fixture: ComponentFixture<CheckoutComponent>;
  let cartFacade: CartFacade;
  let userFacade: UserFacade;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutComponent, ReactiveFormsModule],
      providers: [
        provideMockImageLoader(),
        Router,
        {
          provide: CartFacade,
          useValue: {
            getAll: jest.fn().mockReturnValue(cartItems),
            getTotalPrice: jest.fn().mockReturnValue(signal(0)),
            removeItem: jest.fn().mockResolvedValue(undefined),
            loadShoppingSession: jest.fn().mockResolvedValue(undefined),
            checkout: jest.fn(),
          },
        },
        {
          provide: UserFacade,
          useValue: {
            getCurrentUser: jest.fn().mockReturnValue(mockUser),
            updateUserAddress: jest.fn(),
            updateUserPhone: jest.fn(),
          },
        },
        provideRouter([]),
      ],
    }).compileComponents();

    cartFacade = TestBed.inject(CartFacade);
    userFacade = TestBed.inject(UserFacade);
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(CheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should match the snapshot', () => {
    expect(fixture).toMatchSnapshot();
  });

  describe('checkout form', () => {
    it('should fill the form with user data and display it', () => {
      expect(component.checkoutForm().value).toEqual({
        phone: mockUser().phone,
        address: mockUser().address,
      });
      expect(fixture.debugElement.query(By.css('form'))).toBeTruthy();
    });
  });

  describe('update', () => {
    it('should enable update if form is dirty and valid', () => {
      component.checkoutForm().markAsDirty();
      fixture.detectChanges();

      const res = component.getUpdateEnabled();

      expect(res()).toEqual(true);
    });

    it('should disable update if form is not dirty', () => {
      component.checkoutForm().markAsPristine();
      fixture.detectChanges();

      const res = component.getUpdateEnabled();

      expect(res()).toEqual(false);
    });
  });

  describe('checkout', () => {
    it('should enable checkout if all conditions are filled', () => {
      const res = component.getCheckoutEnabled();

      expect(res()).toEqual(true);
    });

    it('should disable checkout if cart is empty', () => {
      cartItems.set([]);
      fixture.detectChanges();

      const res = component.getCheckoutEnabled();

      expect(res()).toEqual(false);
    });

    it('should disable checkout if user address is empty', () => {
      mockUser.set({ ...mockUser(), address: undefined });

      fixture.detectChanges();

      const res = component.getCheckoutEnabled();

      expect(res()).toEqual(false);
    });

    it('should disable checkout if form is dirty', () => {
      component.checkoutForm().markAsDirty();
      fixture.detectChanges();

      const res = component.getCheckoutEnabled();

      expect(res()).toEqual(false);
    });

    it('should start the checkout process', async () => {
      jest.spyOn(router, 'navigateByUrl');

      await component.checkout();

      expect(cartFacade.checkout).toHaveBeenCalled();
      expect(router.navigateByUrl).toHaveBeenCalledWith('/products');
    });
  });

  describe('cart-items', () => {
    it('should display the cart items', () => {
      expect(fixture.debugElement.query(By.css('lib-cart-items'))).toBeTruthy();
    });

    it('should remove an item', () => {
      const id = 1;

      component.removeItem(id);

      expect(cartFacade.removeItem).toHaveBeenCalledWith(id);
    });
  });

  describe('update user', () => {
    it('should update the phone if changed', async () => {
      mockUser.set({ ...mockUser(), phone: '123' });
      const ctrl = component.checkoutForm().controls.phone;
      ctrl?.markAsDirty();

      await component.updateUser();

      expect(userFacade.updateUserPhone).toHaveBeenCalledWith({ phone: ctrl?.value });
    });

    it('should update the address if changed', async () => {
      mockUser.set({
        ...mockUser(),
        address: {
          street: 'street',
          apartment: 'apartment',
          city: 'city',
          region: 'region',
          zip: 'zip',
          country: 'country',
        },
      });
      const ctrl = component.checkoutForm().controls.address;
      ctrl?.markAsDirty();

      await component.updateUser();

      expect(userFacade.updateUserAddress).toHaveBeenCalledWith(ctrl?.value);
    });
  });
});
