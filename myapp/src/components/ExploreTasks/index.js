import React, { PropTypes } from 'react';
import ReactList from 'react-list';
import "./styles.css"
import {
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps";


const MapWithAMarker = withGoogleMap(props =>
  <GoogleMap
    defaultZoom={8}
    defaultCenter={{ lat: props.lat, lng: props.lng }}
  >
    <Marker
      position={{ lat: props.lat, lng: props.lng }}
    />
  </GoogleMap>
);


export default class ExploreTasks extends React.Component {
  
  constructor() {
    super();
    this.state = {
      pageState: 0,
      marginLeft: 0,
      leftIcon: false,
      rightIcon: true,
      onAllCategory: false,
      category1: false,
      category2: false,
      category3: false,
      category4: false,
      category5: false,
      category6: false,
      category7: false,
      category8: false,
      category9: false,
      category10: false,
      category11: false,
    };
  }
  
  componentDidMount() {
    setTimeout(() => {
      this.props.updateHeader(10);
    }, 100);
  }
  
  renderItem = (index, key) => {
    return (
      <div key={"react_list_key" + index} className="tasklist_item">
        <div className="tasklist_item_real">
          <div className="tasklist_item_avatarcontainer">
            <div className="tasklist_item_avatar"/>
          </div>
          <div className="tasklist_item_desccontainer">
            <div className="task_title1">
              Task {index}
            </div>
            <div className="task_title2">
              This is Photoshop's version  of Lorem Ipsum. Proin gravida nibh vel velit auctor aliquet. Aenean sollicitudin, lorem quis bibendum auctor, nisi elit consequat ipsum..........
            </div>
            <div className="task_title3">
              POSTED:
            </div>
            <div className="task_title4">
              2 hours ago
            </div>
            <div className="task_title5">
              DEADLINE:
            </div>
            <div className="task_title6">
              Monday 21st Jan
            </div>
          </div>
          <div className="tasklist_item_budgetcontainer">
            <div className="offercount1">
              $142
            </div>
            <div className="offercount2">
              Budget Amount
            </div>
          </div>
          <div className="tasklist_item_offerscontainer">
            <div className="offercount1">
              01
            </div>
            <div className="offercount2">
              All Offers
            </div>
          </div>
          <div className="tasklist_item_buttoncontainer">
            {
              index % 5 === 0 &&
                <div className="buttoncontainer">
                  Make Offer
                </div>
            }
            {
              index % 5 === 1 &&
                <div className="buttoncontainer1">
                  Assigned
                </div>
            }
            {
              index % 5 === 2 &&
              <div className="buttoncontainer2">
                Completed
              </div>
            }
            {
              index % 5 === 3 &&
              <div className="buttoncontainer">
                Modify Offer
              </div>
            }
            {
              index % 5 === 4 &&
              <div className="buttoncontainer1">
                Posted
              </div>
            }
          </div>
        </div>
        <div className="tasklist_item_real_bar"/>
      </div>
    );
  };
  
  renderItem_mapview = (index, key) => {
    return (
      <div key={"react_list_key1" + index} className="tasklist_item_map">
        <div className="tasklist_item_real_map">
          <div className="tasklist_item_avatarcontainer">
            <div className="tasklist_item_avatar"/>
            <div className="maplist_budget">$142</div>
          </div>
          <div className="tasklist_item_avatarcontainer_rest">
            <div className="task_title1 marginTop_15px">
              Task {index}
            </div>
            <div className="task_title2_map">
              This is Photoshop's version  of Lorem Ipsum. Proin gravida nibh vel velit auctor aliquet. Aenean sollicitudin, lorem quis bibendum auctor, nisi elit consequat ipsum..........
            </div>
            <div className="task_title3_map">
              POSTED:
            </div>
            <div className="task_title4">
              2 hours ago
            </div>
            <div className="task_title_btn_container">
              {
                index % 5 === 0 &&
                  <div className="task_title_btn">
                    Make offer
                  </div>
              }
              {
                index % 5 === 1 &&
                  <div className="task_title_btn1">
                    Assigned
                  </div>
              }
              {
                index % 5 === 2 &&
                <div className="task_title_btn2">
                  Completed
                </div>
              }
              {
                index % 5 === 3 &&
                <div className="task_title_btn">
                  Modify Offer
                </div>
              }
              {
                index % 5 === 4 &&
                <div className="task_title_btn1">
                  Posted
                </div>
              }
              
            </div>
          </div>
        </div>
        <div className="tasklist_item_real_bar"/>
      </div>
    );
  };
  
  onLeft = () => {
    this.setState({ marginLeft: 0, leftIcon: false, rightIcon: true });
  };
  
  onRight = () => {
    this.setState({ marginLeft: -(11 * 160 - (window.innerWidth - 30) * 0.9) - 30, leftIcon: true, rightIcon: false });
  };
  
  onAllCategory = () => {
    this.onLeft();
    this.setState({ onAllCategory: !this.state.onAllCategory })
  };
  
  onShowFilter = () => {
    alert('on show filter');
  };
  
  setAllCategory = (i) => {
    const {
      category1,
      category2,
      category3,
      category4,
      category5,
      category6,
      category7,
      category8,
      category9,
      category10,
      category11
    } = this.state;
    if (i === 1) {
      if (category1) {
        this.setState({
          category1: false,
          category2: false,
          category3: false,
          category4: false,
          category5: false,
          category6: false,
          category7: false,
          category8: false,
          category9: false,
          category10: false,
          category11: false
        })
      } else {
        this.setState({
          category1: true,
          category2: true,
          category3: true,
          category4: true,
          category5: true,
          category6: true,
          category7: true,
          category8: true,
          category9: true,
          category10: true,
          category11: true
        })
      }
    } else if (i === 2) {
      if (!category2 && category3 && category4 && category5 && category6 && category7 && category8 && category9 && category10 && category11) {
        this.setState({ category1: true });
      }
      if (category2 || !category3 || !category4 || !category5 || !category6 || !category7 || !category8 || !category9 || !category10 || !category11) {
        this.setState({ category1: false });
      }
      this.setState({ category2: !category2 });
    } else if (i === 3) {
      if (category2 && !category3 && category4 && category5 && category6 && category7 && category8 && category9 && category10 && category11) {
        this.setState({ category1: true });
      }
      if (!category2 || category3 || !category4 || !category5 || !category6 || !category7 || !category8 || !category9 || !category10 || !category11) {
        this.setState({ category1: false });
      }
      this.setState({ category3: !category3 });
    } else if (i === 4) {
      if (category2 && category3 && !category4 && category5 && category6 && category7 && category8 && category9 && category10 && category11) {
        this.setState({ category1: true });
      }
      if (!category2 || !category3 || category4 || !category5 || !category6 || !category7 || !category8 || !category9 || !category10 || !category11) {
        this.setState({ category1: false });
      }
      this.setState({ category4: !category4 });
    } else if (i === 5) {
      if (category2 && category3 && category4 && !category5 && category6 && category7 && category8 && category9 && category10 && category11) {
        this.setState({ category1: true });
      }
      if (!category2 || !category3 || !category4 || category5 || !category6 || !category7 || !category8 || !category9 || !category10 || !category11) {
        this.setState({ category1: false });
      }
      this.setState({ category5: !category5 });
    } else if (i === 6) {
      if (category2 && category3 && category4 && category5 && !category6 && category7 && category8 && category9 && category10 && category11) {
        this.setState({ category1: true });
      }
      if (!category2 || !category3 || !category4 || !category5 || category6 || !category7 || !category8 || !category9 || !category10 || !category11) {
        this.setState({ category1: false });
      }
      this.setState({ category6: !category6 });
    } else if (i === 7) {
      if (category2 && category3 && category4 && category5 && category6 && !category7 && category8 && category9 && category10 && category11) {
        this.setState({ category1: true });
      }
      if (!category2 || !category3 || !category4 || !category5 || !category6 || category7 || !category8 || !category9 || !category10 || !category11) {
        this.setState({ category1: false });
      }
      this.setState({ category7: !category7 });
    } else if (i === 8) {
      if (category2 && category3 && category4 && category5 && category6 && category7 && !category8 && category9 && category10 && category11) {
        this.setState({ category1: true });
      }
      if (!category2 || !category3 || !category4 || !category5 || !category6 || !category7 || category8 || !category9 || !category10 || !category11) {
        this.setState({ category1: false });
      }
      this.setState({ category8: !category8 });
    } else if (i === 9) {
      if (category2 && category3 && category4 && category5 && category6 && category7 && category8 && !category9 && category10 && category11) {
        this.setState({ category1: true });
      }
      if (!category2 || !category3 || !category4 || !category5 || !category6 || !category7 || !category8 || category9 || !category10 || !category11) {
        this.setState({ category1: false });
      }
      this.setState({ category9: !category9 });
    } else if (i === 10) {
      if (category2 && category3 && category4 && category5 && category6 && category7 && category8 && category9 && !category10 && category11) {
        this.setState({ category1: true });
      }
      if (!category2 || !category3 || !category4 || !category5 || !category6 || !category7 || !category8 || !category9 || category10 || !category11) {
        this.setState({ category1: false });
      }
      this.setState({ category10: !category10 });
    } else {
      if (category2 && category3 && category4 && category5 && category6 && category7 && category8 && category9 && category10 && !category11) {
        this.setState({ category1: true });
      }
      if (!category2 || !category3 || !category4 || !category5 || !category6 || !category7 || !category8 || !category9 || !category10 || category11) {
        this.setState({ category1: false });
      }
      this.setState({ category11: !category11 });
    }
  };
  
  render() {
    const {
      pageState,
      marginLeft,
      leftIcon,
      rightIcon,
      onAllCategory,
      category1,
      category2,
      category3,
      category4,
      category5,
      category6,
      category7,
      category8,
      category9,
      category10,
      category11,
    } = this.state;
    return (
      <div>
        <div className="col-sm-12 centerContent">
          <div className="exploretasks_top_selector">
            
            <div className={pageState === 0 ? "exploretasks_top_selector1 borderbottom" : "exploretasks_top_selector1"} onClick={() => { this.setState({ pageState: 0, onAllCategory: false }) }}>
              <div className="listview_txt">
                <div className={pageState === 0 ? "listview_img_on" : "listview_img_off"}/>
              </div>
              <div className={ pageState === 0 ? "listview_txt texton" : "listview_txt textoff"}>
                ListView
              </div>
            </div>
            
            <div className={pageState === 1 ? "exploretasks_top_selector1 borderbottom" : "exploretasks_top_selector1"} onClick={() => { this.setState({ pageState: 1, onAllCategory: false, reloadGPS: true }) }}>
              <div className="listview_txt">
                <div className={pageState === 1 ? "mapview_img_on" : "mapview_img_off"}/>
              </div>
              <div className={ pageState === 1 ? "listview_txt texton" : "listview_txt textoff"}>
                MapView
              </div>
            </div>
            
            <div className="exploretasks_top_allcategories" onClick={this.onAllCategory}>
              <div className={onAllCategory ? "exploretasks_top_allcategories1_on" : "exploretasks_top_allcategories1"}>
                <div className="listview_txt textall">
                  All Categories
                </div>
                <div className="listview_txt">
                  <div className={onAllCategory ? "uparrow_img" : "downarrow_img"}/>
                </div>
              </div>
            </div>
  
            <div className="exploretasks_top_allcategories" onClick={this.onShowFilter}>
              <div className="exploretasks_top_allcategories1">
                <div className="listview_txt textall">
                  Show Filters
                </div>
                <div className="listview_txt">
                  <div className="downarrow_img"/>
                </div>
              </div>
            </div>
  
            <div className="exploretasks_top_searchcontainer">
              <div className="exploretasks_top_allcategories1">
                <div className="listview_txt">
                  <div className="search_img"/>
                </div>
                <div className="listview_txt">
                  <div className="line_img"/>
                </div>
                <div className="listview_txt textall marginLeft_10px">
                  Search
                </div>
              </div>
            </div>
            
          </div>
  
          {
            onAllCategory &&
              <div className="exploretasks_top_selector_hscroll">
                {
                  leftIcon &&
                  <div className="scroll_left_btn" onClick={this.onLeft}>
                    <div className="scroll_left_btn_img"/>
                  </div>
                }
                {
                  rightIcon &&
                  <div className="scroll_right_btn" onClick={this.onRight}>
                    <div className="scroll_right_btn_img"/>
                  </div>
                }
                <div style={{ marginLeft: marginLeft + 'px', WebkitTransition: 'all 300ms ease' }}>
                  <div className="scrollitem_container">
                    <div className={category1 ? "scrollitem_selected" : "scrollitem"} onClick={() => { this.setAllCategory(1); }}>
                      <div className={category1 ? "categoryimage_1_selected" : "categoryimage_1"}/>
                    </div>
                    <div className="scrollitem_desc">All Categories</div>
                  </div>
                  <div className="scrollitem_container">
                    <div className={category2 ? "scrollitem_selected" : "scrollitem"} onClick={() => { this.setAllCategory(2); }}>
                      <div className={category2 ? "categoryimage_2_selected" : "categoryimage_2"}/>
                    </div>
                    <div className="scrollitem_desc">House Cleaning</div>
                  </div>
                  <div className="scrollitem_container">
                    <div className={category3 ? "scrollitem_selected" : "scrollitem"} onClick={() => { this.setAllCategory(3); }}>
                      <div className={category3 ? "categoryimage_3_selected" : "categoryimage_3"}/>
                    </div>
                    <div className="scrollitem_desc">Assembly Services</div>
                  </div>
                  <div className="scrollitem_container">
                    <div className={category4 ? "scrollitem_selected" : "scrollitem"} onClick={() => { this.setAllCategory(4); }}>
                      <div className={category4 ? "categoryimage_4_selected" : "categoryimage_4"}/>
                    </div>
                    <div className="scrollitem_desc">Handyman</div>
                  </div>
                  <div className="scrollitem_container">
                    <div className={category5 ? "scrollitem_selected" : "scrollitem"} onClick={() => { this.setAllCategory(5); }}>
                      <div className={category5 ? "categoryimage_5_selected" : "categoryimage_5"}/>
                    </div>
                    <div className="scrollitem_desc">Delivery</div>
                  </div>
                  <div className="scrollitem_container">
                    <div className={category6 ? "scrollitem_selected" : "scrollitem"} onClick={() => { this.setAllCategory(6); }}>
                      <div className={category6 ? "categoryimage_6_selected" : "categoryimage_6"}/>
                    </div>
                    <div className="scrollitem_desc">Gardening</div>
                  </div>
                  <div className="scrollitem_container">
                    <div className={category7 ? "scrollitem_selected" : "scrollitem"} onClick={() => { this.setAllCategory(7); }}>
                      <div className={category7 ? "categoryimage_7_selected" : "categoryimage_7"}/>
                    </div>
                    <div className="scrollitem_desc">IT & Admin Services</div>
                  </div>
                  <div className="scrollitem_container">
                    <div className={category8 ? "scrollitem_selected" : "scrollitem"} onClick={() => { this.setAllCategory(8); }}>
                      <div className={category8 ? "categoryimage_8_selected" : "categoryimage_8"}/>
                    </div>
                    <div className="scrollitem_desc">Beauty & Care</div>
                  </div>
                  <div className="scrollitem_container">
                    <div className={category9 ? "scrollitem_selected" : "scrollitem"} onClick={() => { this.setAllCategory(9); }}>
                      <div className={category9 ? "categoryimage_9_selected" : "categoryimage_9"}/>
                    </div>
                    <div className="scrollitem_desc">Photography</div>
                  </div>
                  <div className="scrollitem_container">
                    <div className={category10 ? "scrollitem_selected" : "scrollitem"} onClick={() => { this.setAllCategory(10); }}>
                      <div className={category10 ? "categoryimage_10_selected" : "categoryimage_10"}/>
                    </div>
                    <div className="scrollitem_desc">Decoration</div>
                  </div>
                  <div className="scrollitem_container">
                    <div className={category11 ? "scrollitem_selected" : "scrollitem"} onClick={() => { this.setAllCategory(11); }}>
                      <div className={category11 ? "categoryimage_11_selected" : "categoryimage_11"}/>
                    </div>
                    <div className="scrollitem_desc">Other Services</div>
                  </div>
                </div>
              </div>
          }
          
          {
            pageState === 0 &&
              <div>
                <div className="exploretasks_top_selector_without">
                  Showing 1452 tasks
                </div>
  
                <div className={ onAllCategory ? "react_list_container1_state2" : "react_list_container1_state1" }>
                  <ReactList
                    itemRenderer={this.renderItem}
                    length={10000}
                  />
                </div>
              </div>
          }
          
          {
            pageState === 1 &&
              <div>
                <div className={ onAllCategory ? "exploretasks_mapview_supercontainer1" : "exploretasks_mapview_supercontainer2"}>
                  <div className={ onAllCategory ? "listcontainer1" : "listcontainer2"}>
                      <ReactList
                        itemRenderer={this.renderItem_mapview}
                        length={100}
                      />
                    </div>
                  <div className={ onAllCategory ? "mapcontainer1" : "mapcontainer2"}>
                    {
                      <MapWithAMarker
                        containerElement={<div className="map" />}
                        mapElement={<div style={{ height: `100%` }} />}
                        lat={45.325118}
                        lng={-73.29425459999999}
                      />
                    }
                  </div>
                </div>
              </div>
          }
          
        </div>
  


      </div>
    )
  }
}

ExploreTasks.propTypes = {
  updateHeader: PropTypes.func.isRequired
};
