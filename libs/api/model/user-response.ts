/**
 * Demo Shop API
 *
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { AddressResponse } from './address-response';

export interface UserResponse {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  phone: string | null;
  address?: AddressResponse;
}
