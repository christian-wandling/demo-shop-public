import { TestBed } from '@angular/core/testing';
import { UserDTO, UsersApi } from '@demo-shop/api';
import { UserStore } from './user.store';
import { of } from 'rxjs';

describe('UserStore', () => {
  let store: any;
  let usersApi: UsersApi;

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
      providers: [{ provide: UsersApi, useValue: { getCurrentUser: jest.fn().mockReturnValue(of(user)) } }],
    });
    usersApi = TestBed.inject(UsersApi);
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
});
