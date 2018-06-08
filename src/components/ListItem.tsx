import * as Q from 'q';
import * as React from 'react';
import * as ReactModal from 'react-modal';

import {GalleryItem} from './GalleryItem';
import loadingSpinner from './LoadingSpinner';

const modalStyles = {
  content: {
    maxWidth: '90%',
    maxHeight: '90%',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
};

const imageStyles = {
  maxWidth: '100%',
  maxHeight: '100%'
};

interface IState {
  isVisible: boolean;
  modalIsOpen: boolean;
}

export class ListItem extends React.Component<{ imgUrl: string, url: string, Item: GalleryItem, key: number }, IState> {

  public state: IState = {
    isVisible: false,
    modalIsOpen: false
  }

  constructor(props: any) {
    super(props);

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

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
          <img src={this.props.imgUrl} className="img-responsive img-funky fadeIn" onClick={this.openModal}/>
        }
        <ReactModal
          isOpen={this.state.modalIsOpen}
          style={modalStyles}
        >
          <a href="https://twitter.com/share?ref_src=twsrc%5Etfw" className="twitter-share-button"
             data-show-count="false">Tweet</a>
          <img src={this.props.url} style={imageStyles} onClick={this.closeModal}/>
        </ReactModal>
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

  private openModal() {
    this.setState({modalIsOpen: true});
  }

  private closeModal() {
    this.setState({modalIsOpen: false});
  }
}