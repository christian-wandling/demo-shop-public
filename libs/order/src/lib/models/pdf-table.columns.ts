/**
 * Represents a single column in a PDF table
 *

 * @property {number} x - The x-coordinate position of the column (in points)
 * @property {number} width - The width of the column (in points)
 * @property {string} label - The display label for the column header
 */
export type PdfColumn = { x: number; width: number; label: string };

/**
 * Defines the structure of table columns for invoice PDF generation
 * Contains configuration for all required columns in an invoice table
 *
 * @property {PdfColumn} article - Configuration for the article/item description column
 * @property {PdfColumn} qty - Configuration for the quantity column
 * @property {PdfColumn} price - Configuration for the unit price column
 * @property {PdfColumn} amount - Configuration for the total amount column
 */
export type PdfTableColumns = {
  article: PdfColumn;
  qty: PdfColumn;
  price: PdfColumn;
  amount: PdfColumn;
};
