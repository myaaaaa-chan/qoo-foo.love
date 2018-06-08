import * as request from "request";

export class AwsS3Util {
  public getBucketFileList = (callback: any): void => {
    const url = "https://6itu4ykt3m.execute-api.ap-northeast-1.amazonaws.com/prod/images";

    const headers = {
      "Content-Type": "application/json"
    };

    // request options
    const options = {
      url,
      method: 'GET',
      headers,
      withCredentials: false
    };

    request.get(options, ((err, res, body: string) => {
      if (err) {
        console.log('Error: ' + err.message);
        return;
      }

      const json = body;
      const tmp = JSON.parse(JSON.parse(json));
      const imgList = tmp.items.slice(1);
      callback(imgList);
    }));
  }
}