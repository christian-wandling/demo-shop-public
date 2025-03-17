/**
 * Represents company contact information used for document headers, footers, and contact details
 */
export type CompanyData = {
  /** The company name */
  name: string;
  /** Street address of the company */
  address: string;
  /** City where the company is located */
  city: string;
  /** Postal code or ZIP code */
  zipCode: string;
  /** Company phone number */
  phone: string;
  /** Company email address */
  email: string;
};
