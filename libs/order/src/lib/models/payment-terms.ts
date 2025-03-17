/**
 * Represents payment terms and banking information for invoice generation
 * Contains all necessary details for instructing customers on how to make payments
 *
 * @property {string} terms - The payment terms text (e.g., "payment due within 30 days")
 * @property {string} bankName - The name of the bank where the account is held
 * @property {string} accountName - The name associated with the bank account
 * @property {string} accountNumber - The account number for payment transfers
 * @property {string} routingNumber - The bank routing number for payment transfers
 */
export type PaymentTerms = {
  terms: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  routingNumber: string;
};
