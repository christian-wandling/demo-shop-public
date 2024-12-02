import { TestBed } from '@angular/core/testing';
import { UserDTO, UsersApi } from '@demo-shop/api';
import { UserStore } from './user.store';
import { of } from 'rxjs';
import { MonitoringFacade } from '@demo-shop/monitoring';

describe('UserStore', () => {
  let store: any;
  let usersApi: UsersApi;
  let monitoringFacade: MonitoringFacade;

  const user: UserDTO = {
    id: 'id',
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
          provide: UsersApi,
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
    usersApi = TestBed.inject(UsersApi);
    monitoringFacade = TestBed.inject(MonitoringFacade);
    store = TestBed.inject(UserStore);
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  it('should fetch the current user from the api', async () => {
    await store.fetchCurrentUser();

    expect(usersApi.getCurrentUser).toHaveBeenCalled();
    expect(store.user()).toEqual(user);
  });

  describe('onInit', () => {
    it('should set up effect to track user in Sentry when store initializes', () => {
      expect(monitoringFacade.setUser).toHaveBeenCalledWith({ id: undefined });
    });

    it('should update Sentry user when store user changes', async () => {
      await store.fetchCurrentUser();

      expect(monitoringFacade.setUser).toHaveBeenCalledWith({ id: 'id' });
    });
  });
});
