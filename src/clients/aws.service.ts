import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class AwsService {
  private s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION,
      endpoint: process.env.AWS_ENDPOINT,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
      },
    });
  }

  get client() {
    return this.s3Client;
  }

  getSignedUrlForUpload(key: string) {
    const cmd = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET,
      Key: key,
      ACL: 'private',
    });
    return getSignedUrl(this.s3Client, cmd, { expiresIn: 3600 });
  }
}
