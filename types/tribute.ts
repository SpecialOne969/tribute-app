export interface TributeDocument {
  data: string;  // base64 data URL
  type: string;  // MIME type
  name: string;  // original filename
}

export interface Tribute {
  id: string;
  name: string;
  role: string;
  message: string;
  createdAt: string;
  document?: TributeDocument;
}
