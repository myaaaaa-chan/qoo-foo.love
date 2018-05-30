import * as React from 'react';
import "./App.css";

import {Gallery} from "./components/Gallery";
import {GalleryItem} from "./components/GalleryItem";
import {AwsS3Util} from "./lib/AwsS3Util";

const THUMBNAIL_SIZE = 260;

interface IState {
  key: number;
  listOfProject: GalleryItem[];
}

class App extends React.Component<{}, IState> {
  public state: IState = {
    key: 0,
    listOfProject: new Array<GalleryItem>()
  };

  private s3BucketBaseUrl: string;
  private genThumbnailImgBaseUrl: string;

  constructor(props: any) {
    super(props);
    this.getBucketFileListSuccess = this.getBucketFileListSuccess.bind(this);
    this.s3BucketBaseUrl = process.env.REACT_APP_S3_BUCKET_URL || "";
    this.genThumbnailImgBaseUrl = process.env.REACT_APP_GENERATE_THUMBNAIL_IMG_URL || "";
  }

  public componentDidMount() {
    const s3Util = new AwsS3Util();
    s3Util.getBucketFileList(this.getBucketFileListSuccess);
  }

  public render(): JSX.Element {
    return (
      <div className="App">
        <div>
          <Gallery key={this.state.key} items={this.state.listOfProject}/>
        </div>
      </div>
    );
  }

  private getBucketFileListSuccess(imageNameList: string[]): void {
    const category = {name: "Qoo & Foo", key: "qoo-foo"};

    const listOfProject = new Array<GalleryItem>();
    imageNameList.forEach((value, index, array) => {
      const orgImageUrl = this.s3BucketBaseUrl + value;
      const imageName = value.split("/")[1];
      const thumbnailImageUrl = this.genThumbnailImgBaseUrl + "/" + imageName + "?w=" + THUMBNAIL_SIZE;
      listOfProject.push(
        new GalleryItem("Qoo-Foo " + index, thumbnailImageUrl, orgImageUrl, category)
      )
    });
    const state = this.state
    state.key = 1;
    state.listOfProject = listOfProject;
    this.setState(state);
  }
}

export default App;
