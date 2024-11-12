import { TestBed } from '@angular/core/testing';
import { AppStore } from './app.store';
import { AuthFacade } from '@demo-shop/auth';
import { CartFacade } from '@demo-shop/cart';
import { UserFacade } from '@demo-shop/user';

describe('AppStore', () => {
  let store: any;
  let authFacade: AuthFacade;
  let userFacade: UserFacade;
  let cartFacade: CartFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthFacade, useValue: { authorize: jest.fn() } },
        { provide: UserFacade, useValue: { fetchCurrentUser: jest.fn() } },
        { provide: CartFacade, useValue: { loadShoppingSession: jest.fn() } },
      ],
    });
    authFacade = TestBed.inject(AuthFacade);
    userFacade = TestBed.inject(UserFacade);
    cartFacade = TestBed.inject(CartFacade);
    store = TestBed.inject(AppStore);
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  it('should set initialized to true after executing side effects', async () => {
    expect.assertions(4);

    const authorize = jest.spyOn(authFacade, 'authorize').mockResolvedValue(true);
    const loadCurrentUser = jest.spyOn(userFacade, 'fetchCurrentUser');
    const loadShoppingSession = jest.spyOn(cartFacade, 'loadShoppingSession');

    await store.init();

    expect(authorize).toHaveBeenCalled();
    expect(loadCurrentUser).toHaveBeenCalled();
    expect(loadShoppingSession).toHaveBeenCalled();
    expect(store.initialized()).toBe(true);
  });
});
