export type PdfColumn = { x: number; width: number; label: string };

export type PdfTableColumns = {
  article: PdfColumn;
  qty: PdfColumn;
  price: PdfColumn;
  amount: PdfColumn;
};
