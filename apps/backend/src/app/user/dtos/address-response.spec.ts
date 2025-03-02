import { toAddressResponse } from './address-response';
import { Address } from '@prisma/client';

describe('toAddressResponse', () => {
  it('should correctly map Address to AddressResponse', () => {
    const address: Address = {
      id: 1,
      street: '123 Main St',
      apartment: '4B',
      city: 'City',
      region: 'Region',
      zip: '12345',
      country: 'Country',
      user_id: 1,
      created_at: null,
      updated_at: null,
    };

    const addressDto = toAddressResponse(address);

    expect(addressDto).toEqual({
      street: '123 Main St',
      apartment: '4B',
      city: 'City',
      region: 'Region',
      zip: '12345',
      country: 'Country',
    });
  });
});
