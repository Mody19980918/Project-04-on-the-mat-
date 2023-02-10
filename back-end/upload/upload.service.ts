import { Request } from 'express'
import { Fields } from 'formidable'

export interface UploadResult {
  fields: Fields
  files: Record<string, string[]>
}

export interface UploadService {
  uploadDir?: string
  upload(req: Request): Promise<UploadResult>
}
