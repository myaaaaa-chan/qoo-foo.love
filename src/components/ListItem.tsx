import * as Q from 'q';
import * as React from 'react';

import {GalleryItem} from './GalleryItem';
import loadingSpinner from './LoadingSpinner';


export class ListItem extends React.Component<{ imgUrl: string, url: string, Item: GalleryItem, key: number }, { isVisible: boolean }> {

  public state = {isVisible: false}

  public componentDidMount() {
    const state = this.state;
    state.isVisible = false;
    this.setState(state);

    this.loadImage(this.props.imgUrl)
      .then(d => {
        state.isVisible = true;
        this.setState(state);
      });
  }

  public render() {
    return <div className="col-lg-3 col-md-4 col-sm6 col-xs-12">
      <div className="ProjectListItem fadeIn">
        {!this.state.isVisible ? loadingSpinner :
          <img src={this.props.imgUrl} className="img-responsive img-funky fadeIn"/>
        }
        <a className="name" href={this.props.url} target="_blank">
          <i className="fa fa-search"></i>
        </a>
      </div>
    </div>
  }

  private loadImage(imgUrl: string) {
    const d = Q.defer();

    const preLoad = new Image();
    preLoad.src = imgUrl;
    preLoad.onprogress = (e) => {
      d.notify(e.loaded / e.total);
    }
    preLoad.onload = (e) => {
      d.resolve(e);
    }
    return d.promise;
  }
}