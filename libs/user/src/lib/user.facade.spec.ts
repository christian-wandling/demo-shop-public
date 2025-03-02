import { TestBed } from '@angular/core/testing';

import { UserFacade } from './user.facade';
import { UserStore } from './+state/user.store';
import { UserResponse } from '@demo-shop/api';

describe('UserFacade', () => {
  let service: UserFacade;
  let userStore: any;

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
          provide: UserStore,
          useValue: {
            user,
            fetchCurrentUser: jest.fn(),
          },
        },
      ],
    });

    userStore = TestBed.inject(UserStore);
    service = TestBed.inject(UserFacade);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch the current user', () => {
    service.fetchCurrentUser();

    expect(userStore.fetchCurrentUser).toHaveBeenCalled();
  });

  it('should get the current user from the store', () => {
    expect(service.getCurrentUser()).toEqual(user);
  });
});
