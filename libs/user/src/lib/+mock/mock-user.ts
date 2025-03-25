import { AddressResponse, UserResponse } from '@demo-shop/api';

export const mockAddress: AddressResponse = {
  street: '111 Torp Ferry',
  apartment: '7',
  city: 'East Zolaboro',
  zip: '42307',
  region: 'Utah',
  country: 'United States',
};

export const mockUser: UserResponse = {
  id: 1,
  email: 'Pearlie.Jenkins58@hotmail.com',
  firstname: 'Alaina',
  lastname: 'Kling',
  phone: '+581066191',
};

export const mockUserWithAddress: UserResponse = {
  id: 1,
  email: 'Pearlie.Jenkins58@hotmail.com',
  firstname: 'Alaina',
  lastname: 'Kling',
  phone: '+581066191',
  address: mockAddress,
};
