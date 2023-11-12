export type PDFPage = {
  pageContent: string;
  metadata: {
    loc: { pageNumber: number };
  };
};
