import { Injectable } from "@nestjs/common";
import { S3Client } from "@aws-sdk/client-s3";

@Injectable()
export class AwsService {
  getS3Client(): S3Client {
    return new S3Client({
      region: process.env.AWS_REGION,
      endpoint: process.env.AWS_ENDPOINT,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
      },
    });
  }
}
