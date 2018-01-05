import React, { PropTypes } from 'react';
import ReactList from 'react-list';
import "./styles.css"
import {eng, fre} from "../../lang";
import config from "../../config";
import {reactLocalStorage} from "reactjs-localstorage";

import { FacebookLogin } from 'react-facebook-login-component';
import { Modal, Button } from 'react-bootstrap';
import { Redirect } from 'react-router';

import Promise from 'promise';
import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';
let superagent = superagentPromise(_superagent, Promise);

const base_url_public = config.baseUrl;


export default class Dashboard extends React.Component {
  
  constructor() {
    super();
    this.state = {
      pageState: 0,
      personal_datas: {},
    };
    this.requests = {
      fetchDatas: () =>
        superagent.post(base_url_public + '/frontend/user/fetchpersonalinfos', {token: reactLocalStorage.get('loggedToken')}).then(res => {
          if (!res.body.result) {
            // this.setState({showAlert: true, alertText: res.body.text})
          } else {
            reactLocalStorage.set('username', res.body.personal_datas.username);
            this.props.updateHeader(13);
          }
        }),
    };
  }
  
  componentDidMount() {
    let dashboard_loaded = reactLocalStorage.get('dahsboard_loaded');
    if (dashboard_loaded === "false") {
      reactLocalStorage.set('dahsboard_loaded', 'true');
      location.reload();
    } else {
      reactLocalStorage.set('dahsboard_loaded', 'false');
      window.applozic.init({
        appId: '2fde83d9c3e0d87d15b2373bbf99e6172',
        userId: reactLocalStorage.get('loggedEmail'),
        userName: reactLocalStorage.get('loggedUsername'),
        imageLink : '',
        email : '',
        contactNumber: '',
        accessToken: '',
        desktopNotification: true,
        notificationIconLink: '',
        onInit : function(response) {
          if (response === "success") {
            debugger;
          } else {
            // error in user login/register (you can hide chat button or refresh page)
            debugger;
          }
        },
      });
  
      setTimeout(() => {
        reactLocalStorage.set('message_loaded', "false");
        this.props.updateHeader(13);
      }, 100);
      this.requests.fetchDatas();
    }
  }
  
  componentWillUnmount() {
    reactLocalStorage.set('dahsboard_loaded', 'false');
  }
  
  renderItem = (index, key) => {
    return (
      <div key={"react_list_key" + index} className="tasklist_item1">
        <div className="tasklist_item_real1">
          <div>
            <div className="boldtext">
              Very Helpful!
            </div>
            <div className="graytext">
              Description1 Description1 Description1 Description1 Description1 Description1 Description1 Description1 Description1 Description1 Description1 Description1 Description1 Description1.
            </div>
            <div className="starcontainer">
              <div className="star"/>
              <div className="star"/>
              <div className="star"/>
              <div className="star"/>
              <div className="star"/>
            </div>
            <div className="fromusercontainer"></div>
          </div>
        </div>
        <div className="tasklist_item_real_bar1"/>
      </div>
    );
  };
  
  render() {
    const { pageState } = this.state;
    return (
      <div>
        <div className="col-sm-12 centerContent">
          <div className="mytasks_top_selector">
            <div className={pageState === 0 ? "mytasks_top_selector1 borderbottom" : "mytasks_top_selector1"} onClick={() => { this.setState({ pageState: 0 }) }}>Tasker Profile</div>
            <div className={pageState === 1 ? "mytasks_top_selector1 borderbottom" : "mytasks_top_selector1"} onClick={() => { this.setState({ pageState: 1 }) }}>Poster Profile</div>
          </div>
          <div className="view1">
            <div className="view2">
              <div className="avatarContainer">
                <div className="avatar"/>
              </div>
              <div className="nameContainer">
                <div className="name">Alexander Ignacz</div>
              </div>
              <div className="restContainer1">
                <div className="restSub3">
                  <div className="weakright">OFFERS</div>
                  <div className="weakright1">MADE</div>
                </div>
                <div className="restSub4">
                  <div className="boldright">01</div>
                </div>
              </div>
              <div className="restContainer1">
                <div className="restSub1">
                  <div className="weakright">TASKS</div>
                  <div className="weakright1">ASSIGNED</div>
                </div>
                <div className="restSub2">
                  <div className="boldright">01</div>
                </div>
              </div>
              <div className="restContainer1">
                <div className="restSub1">
                  <div className="weakright">PENDING</div>
                  <div className="weakright1">PAYMENTS</div>
                </div>
                <div className="restSub2">
                  <div className="boldright">01</div>
                </div>
              </div>
            </div>
          </div>
          <div className="view1">
            <div className="view2">
              <div className="avatarContainer"/>
              <div className="nameContainer"/>
              <div className="restContainer1">
                <div className="restSub3">
                  <div className="weakright2">RATING</div>
                </div>
                <div className="restSub4">
                  <div className="boldright">4.5/5</div>
                </div>
              </div>
              <div className="restContainer1">
                <div className="restSub1">
                  <div className="weakright">CANCELLATION</div>
                  <div className="weakright1">RATE</div>
                </div>
                <div className="restSub2">
                  <div className="boldright">5%</div>
                </div>
              </div>
              <div className="restContainer1">
                <div className="restSub1">
                  <div className="weakright">TASKS</div>
                  <div className="weakright1">COMPLETED</div>
                </div>
                <div className="restSub2">
                  <div className="boldright">01</div>
                </div>
              </div>
            </div>
          </div>
          
          
          <div className="view3">
            <div className="view4">
              <div className="view5">
                <div className="reviewtext">
                  Reviews
                </div>
                <div className="reviewcontainer">
                  <ReactList
                    itemRenderer={this.renderItem}
                    length={10}
                  />
                </div>
              </div>
              <div className="view6">
                
                <div className="view6_top1">
                  <div className="view6_top1_txt1">EARNED THIS WEEK</div>
                  <div className="view6_top1_txt2">$156.54</div>
                </div>
                
                <div className="view6_top1 margintop15">
                  <div className="view6_top1_txt1">PROFILE INCOMPLETE</div>
                  <div className="view6_top1_profileincomplete_container">
                    <div className="view6_top1_profileincomplete">Complete Profile</div>
                  </div>
                </div>
  
                <div className="view6_top2">
  
                </div>
                <div className="view6_top3">
  
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Dashboard.propTypes = {
  updateHeader: PropTypes.func.isRequired
};
