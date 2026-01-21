
export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  dataUrl: string;
  timestamp: number;
}

export enum UploadStatus {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
