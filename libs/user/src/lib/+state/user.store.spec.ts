import { TestBed } from '@angular/core/testing';
import { UserResponse, UserApi } from '@demo-shop/api';
import { UserStore } from './user.store';
import { of } from 'rxjs';
import { MonitoringFacade } from '@demo-shop/monitoring';

describe('UserStore', () => {
  let store: any;
  let userApi: UserApi;
  let monitoringFacade: MonitoringFacade;

  const user: UserResponse = {
    id: 1,
    email: 'email',
    firstname: 'firstname',
    lastname: 'lastname',
    phone: 'phone',
    address: {
      street: 'street',
      apartment: 'apartment',
      city: 'city',
      region: 'region',
      zip: 'zip',
      country: 'country',
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: UserApi,
          useValue: {
            getCurrentUser: jest.fn().mockReturnValue(of(user)),
          },
        },
        {
          provide: MonitoringFacade,
          useValue: {
            setUser: jest.fn(),
          },
        },
      ],
    });
    userApi = TestBed.inject(UserApi);
    monitoringFacade = TestBed.inject(MonitoringFacade);
    store = TestBed.inject(UserStore);
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  it('should fetch the current user from the api', async () => {
    await store.fetchCurrentUser();

    expect(userApi.getCurrentUser).toHaveBeenCalled();
    expect(store.user()).toEqual(user);
  });

  describe('onInit', () => {
    it('should set up effect to track user in Sentry when store initializes', () => {
      expect(monitoringFacade.setUser).toHaveBeenCalledWith({ id: undefined });
    });

    it('should update Sentry user when store user changes', async () => {
      await store.fetchCurrentUser();

      expect(monitoringFacade.setUser).toHaveBeenCalledWith({ id: 1 });
    });
  });
});
