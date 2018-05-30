import * as React from 'react';
import * as _ from 'underscore';

import {GalleryItem} from "./GalleryItem";
import {ListItem} from './ListItem'
import loadingSpinner from './LoadingSpinner';

import LazyLoad from 'react-lazyload';

interface ICategory {
  name: string;
  key: string;
}

interface IState {
  Categories: ICategory[];
  currentFilter: string | null;
  currentOffset: number;
  isLoading: boolean;
  List: GalleryItem[];
  take: number;
}

const PAGE_LIMIT = 20;

export class Gallery extends React.Component<{ items: GalleryItem[] }, IState> {

  public state: IState = {
    Categories: new Array<ICategory>(),
    currentFilter: null,
    currentOffset: 0,
    isLoading: true,
    List: new Array<GalleryItem>(),
    take: PAGE_LIMIT,
  };

  public componentDidMount() {
    const state = this.state;
    state.isLoading = false;
    state.List = this.props.items.filter((i, index) => {
      return index < this.state.take
    });
    state.Categories = _.sortBy(_.uniq(this.props.items.map(item => item.category)), 'key');

    this.setState(state);
  }

  public showAll = () => this.setfilter();
  public pageNext = () => this.page(false);
  public pagePrev = () => this.page(true);

  public setfilter = (key?: string | null) => {
    const currentState = this.state;
    currentState.currentFilter = key ? key : null;

    currentState.List = [];
    currentState.isLoading = true;
    this.setState(currentState);

    setTimeout(() => {
      currentState.currentOffset = 0;
      currentState.List = this.props.items
        .filter(item => {
          return key ? item.category.key === key : true;
        }).filter((items, index) => {
          return index < currentState.take
        })
      currentState.isLoading = false;
      this.setState(currentState);
    }, 150);
  }

  public render() {
    return <div className="ProjectList">
      {this.state.isLoading ? loadingSpinner :
        <div className="padding center-block">
          <button className="btn btn-outline-info btn-lg mr-3" onClick={this.pagePrev}>
            <i className="fa fa-angle-left"></i>
          </button>
          <button className="btn btn-outline-info btn-lg" onClick={this.pageNext}>
            <i className="fa fa-angle-right"></i>
          </button>
        </div>
      }
      <div className="row">
        {this.state.List.map((item, key) => {
          return <LazyLoad key={key}><ListItem key={key} imgUrl={item.imgUrl} Item={item} url={item.url}/></LazyLoad>
        })}
      </div>
      {this.state.isLoading ? loadingSpinner :
        <div className="padding center-block">
          <button className="btn btn-outline-info btn-lg mr-3" onClick={this.pagePrev}>
            <i className="fa fa-angle-left"></i>
          </button>
          <button className="btn btn-outline-info btn-lg" onClick={this.pageNext}>
            <i className="fa fa-angle-right"></i>
          </button>
        </div>
      }
    </div>
  }

  private page = (back: boolean) => {
    const currentState = this.state;
    currentState.List = new Array<GalleryItem>();
    currentState.isLoading = true;
    this.setState(currentState);

    setTimeout(() => {
      const catItems = this.props.items.filter(item => (currentState.currentFilter ? item.category.key === currentState.currentFilter : true))
      currentState.List = new Array<GalleryItem>();

      const offset = currentState.currentOffset + (back ? (PAGE_LIMIT * -1) : PAGE_LIMIT);
      currentState.currentOffset = offset > 0 && offset < catItems.length ? offset : currentState.currentOffset;

      catItems.forEach((item, index, list) => {
        if (currentState.List.length < currentState.take && index > currentState.currentOffset) {
          currentState.List.push(item)
        }
      })
      currentState.isLoading = false;
      this.setState(currentState);
    }, 150)
  }
}