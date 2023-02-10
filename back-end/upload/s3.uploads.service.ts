import { Request } from 'express'
import { UploadResult, UploadService } from './upload.service'
import aws from 'aws-sdk'
import { env } from '../env'
import formidable from 'formidable'
import stream from 'stream'

export class S3UploadService implements UploadService {
    fileCounter = 0
    s3: aws.S3
    constructor() {
        let credentials = new aws.Credentials({
            accessKeyId: env.AWS_ACCESS_KEY_ID,
            secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
        })
        this.s3 = new aws.S3({
            credentials,
            region: env.S3_REGION,
        })
    }
    async upload(req: Request): Promise<UploadResult> {
        return new Promise((resolve, reject) => {
            let filename = ''
            let uploads: aws.S3.ManagedUpload[] = []
            let form = new formidable.Formidable({
                fileWriteStreamHandler: () => {
                    let passThroughStream = new stream.PassThrough()
                    let upload = this.s3.upload(
                        {
                            Body: passThroughStream,
                            Bucket: env.S3_BUCKET_NAME,
                            Key: filename,
                        },
                        {},
                    )
                    upload.send()
                    uploads.push(upload)
                    return passThroughStream
                },
                filename: (name, ext, part, form) => {
                    let field = part.name
                    let timestamp = Date.now()
                    this.fileCounter++
                    filename = `${field}-${timestamp}-${this.fileCounter}`
                    return filename
                },
            })
            form.parse(req, (err, fields, files) => {
                if (err) {
                    uploads.forEach(upload => upload.abort())
                    reject(err)
                    return
                }
                Promise.all(uploads.map(upload => upload.promise())).then(s3Files => {
                    // console.log('s3Files:', s3Files)
                    // console.log('formidable files:', files)

                    let resultFiles: Record<string, string[]> = {}

                    for (let field in files) {
                        let value = files[field]
                        if (Array.isArray(value)) {
                            resultFiles[field] = value.map(file => file.newFilename)
                        } else {
                            resultFiles[field] = [value.newFilename]
                        }
                    }

                    resolve({
                        fields,
                        files: resultFiles,
                    })
                })
            })
        })
    }
}