import { validate } from 'class-validator';
import { AddressDTO, toAddressDTO } from './address-dto';
import { Address } from '@prisma/client';

describe('AddressDTO', () => {
  it('should fail validation if any field is empty', async () => {
    const addressDto = new AddressDTO();
    addressDto.street = '';
    addressDto.apartment = '';
    addressDto.city = '';
    addressDto.region = '';
    addressDto.zip = '';
    addressDto.country = '';

    const errors = await validate(addressDto);
    expect(errors.length).toBe(6); // Each field should produce a validation error
  });

  it('should fail validation if any field is missing', async () => {
    const addressDto = new AddressDTO();
    addressDto.street = '123 Main St';
    addressDto.city = 'City';

    const errors = await validate(addressDto);
    expect(errors.length).toBeGreaterThan(0); // Validation errors expected for missing fields
  });
});

describe('toAddressDTO', () => {
  it('should correctly map Address to AddressDTO', () => {
    const address: Address = {
      id: 1,
      street: '123 Main St',
      apartment: '4B',
      city: 'City',
      region: 'Region',
      zip: '12345',
      country: 'Country',
      userId: 1,
    };

    const addressDto = toAddressDTO(address);

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
