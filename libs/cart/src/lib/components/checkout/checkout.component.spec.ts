import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckoutComponent } from './checkout.component';
import { CartFacade } from '../../cart.facade';
import { signal } from '@angular/core';
import { OrderFacade } from '@demo-shop/order';
import { UserFacade } from '@demo-shop/user';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { provideRouter, Router } from '@angular/router';

describe('CheckoutComponent', () => {
  const user = signal({
    id: '1',
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

  let component: CheckoutComponent;
  let fixture: ComponentFixture<CheckoutComponent>;
  let orderFacade: OrderFacade;
  let cartFacade: CartFacade;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutComponent, ReactiveFormsModule],
      providers: [
        Router,
        {
          provide: CartFacade,
          useValue: {
            getAll: jest.fn().mockReturnValue(signal([])),
            getTotalPrice: jest.fn().mockReturnValue(signal(0)),
            removeItem: jest.fn().mockResolvedValue(undefined),
            loadShoppingSession: jest.fn().mockResolvedValue(undefined),
          },
        },
        { provide: OrderFacade, useValue: { createOrder: jest.fn() } },
        {
          provide: UserFacade,
          useValue: {
            getCurrentUser: jest.fn().mockReturnValue(user),
          },
        },
        provideRouter([]),
      ],
    }).compileComponents();

    orderFacade = TestBed.inject(OrderFacade);
    cartFacade = TestBed.inject(CartFacade);
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

  it('should fill the form with user data and display it', () => {
    expect(component.checkoutForm().value).toEqual({ ...component.user(), id: undefined });
    expect(fixture.debugElement.query(By.css('form'))).toBeTruthy();
  });

  it('should display the order ', () => {
    expect(fixture.debugElement.query(By.css('lib-cart-items'))).toBeTruthy();
  });

  it('should enable the checkout button if the form is valid ', () => {
    const btn = fixture.debugElement.query(By.css('.btn-checkout'));

    expect(btn.nativeElement.disabled).toBe(false);
  });

  it('should disable the checkout button if the form is valid ', () => {
    user.update(user => ({ ...user, email: 'email' }));
    fixture.detectChanges();

    const btn = fixture.debugElement.query(By.css('.btn-checkout'));

    expect(component.checkoutForm().invalid).toBe(true);
    expect(btn?.nativeElement.disabled).toBe(true);
  });

  it('should remove an item', () => {
    const id = '1';

    component.removeItem(id);

    expect(cartFacade.removeItem).toHaveBeenCalledWith(id);
  });

  it('should create an order, then reload the shoppingSession and navigate to the products page', async () => {
    jest.spyOn(router, 'navigateByUrl');

    await component.createOrder();

    expect(orderFacade.createOrder).toHaveBeenCalled();
    expect(cartFacade.loadShoppingSession).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/products');
  });
});
