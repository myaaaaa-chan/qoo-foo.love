import * as AWS from 'aws-sdk';

export class AwsS3Util {
  public getBucketFileList = (callback: (fileNameList: string[]) => void): void => {
    const fileNameList = new Array<string>();

    const accessKeyId = process.env.REACT_APP_ACCESS_KEY_ID || "";
    const secretAccessKey = process.env.REACT_APP_SECRET_ACCESS_KEY || "";

    AWS.config.update({
      region: 'ap-northeast-1',
      credentials: new AWS.Credentials(accessKeyId, secretAccessKey)
    });

    const s3 = new AWS.S3({params: {Bucket: 'qoo-foo.love',}});
    s3.listObjects(((err, data) => {
      if (err != null) {
        console.log(err);
      } else {
        if (data.Contents == null) {
          return;
        }

        data.Contents.forEach((value, index, array) => {
          if (value.Key! === "prod/") {
            return;
          }
          fileNameList.push(value.Key!.toString());
        });

        callback(fileNameList);
      }
    }));
  }
}