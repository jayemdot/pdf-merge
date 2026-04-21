export type PdfEntry = {
  id: string;
  file: File;
  pageCount: number;
};

export type AddFilesError = {
  id: string;
  fileName: string;
  reason: string;
};
