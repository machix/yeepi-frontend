import React, { PropTypes } from 'react';
import ReactList from 'react-list';
import "./styles.css"
import { compose, withProps, withStateHandlers } from "recompose";
import {
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow,
  withScriptjs
} from "react-google-maps";
import { Modal, Button } from 'react-bootstrap';
const { InfoBox } = require("react-google-maps/lib/components/addons/InfoBox");
const { MarkerClusterer } = require("react-google-maps/lib/components/addons/MarkerClusterer");
import config from "../../config";
import {eng, fre} from "../../lang";
import {reactLocalStorage} from "reactjs-localstorage";
import moment from 'moment';
import demoFancyMapStyles from './demoFancyMapStyles';
import { Redirect } from 'react-router';

import Promise from 'promise';
import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';
let superagent = superagentPromise(_superagent, Promise);

const base_url_public = config.baseUrl;

export default class ExploreTasks extends React.Component {
  
  constructor() {
    super();
    this.state = {
      pageState: 0,
      marginLeft: 0,
      leftIcon: false,
      rightIcon: true,
      onAllCategory: false,
      onFilter: false,
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
      tasks_datas: [],
      isOpenIndex: -1,
      isOpenStatus: false,
  
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {},
  
      offerModalShow: false,
      tax_array: [],
      commissionrate: 100,
      amounttext: 0,
      taxamount: 0,
      totalamount: 0,
      commissionamount: 0,
      taskerearning: 0,
  
      task_index: 0,
      categoryClassName: '',
      modal_duration: '',
      offer_modal_type: 0,
      prev_offer_amount: 0,
  
      filter_status: 0,
      filter_sort: 0,
      filter_distance: 0,
      
      redirect: 0,
    };
    this.categoryLists = [
      "House Cleaning",
      "Assembly Services",
      "Handyman",
      "Delivery",
      "Gardening",
      "Admin & IT Support",
      "Beauty & Care",
      "Photography",
      "Decoration",
      "Other Services"
    ];
    this.requests = {
      fetchDatas: () =>
        superagent.post(base_url_public + '/tasks/fetchtasks', { token: reactLocalStorage.get('loggedToken') }).then(res => {
          if (!res.body.result) {
            this.setState({ showAlert: true, alertText: res.body.text })
          } else {
            this.setState({ tasks_datas: res.body.tasks_datas })
          }
        }),
      fetchTaxInfosAndOpenOfferModal: (index, dur, offer_state, prev_offer) =>
        superagent.get(base_url_public + '/settings/list', {}).then(res => {
          if (!res.body.result) {
            this.setState({ showAlert: true, alertText: res.body.text })
          } else {
            this.setState({ tax_array: res.body.settings[0].tax_array, commissionrate: parseInt(res.body.settings[0].commission) });
            this.showOfferModal(index, dur, offer_state, prev_offer);
          }
        }),
      makeOffer: (id) =>
        superagent.post(base_url_public + '/frontend/tasks/offer/make', {id: id, user_token: reactLocalStorage.get('loggedToken'), offer_amount: this.state.amounttext, offer_desc: this._input_desc.value, offer_update_time: moment() }).then(res => {
          if (!res.body.result) {
            this.setState({ showAlert: true, alertText: res.body.text })
          } else {
            this.hideOfferModal();
          }
        }),
      updateOffer: (id) =>
        superagent.post(base_url_public + '/frontend/tasks/offer/update', {id: id, user_token: reactLocalStorage.get('loggedToken'), offer_amount: this.state.amounttext, offer_desc: this._input_desc.value, offer_update_time: moment() }).then(res => {
          if (!res.body.result) {
            this.setState({ showAlert: true, alertText: res.body.text })
          } else {
            this.hideOfferModal();
          }
        })
    };
    this.makeOfferSelected = 0;
  }
  
  componentDidMount() {
    this.props.updateHeader(10);
    this.requests.fetchDatas()
  }
  
  goToTaskSummary = (id, isPoster) => {
    if (isPoster > 0) {
      reactLocalStorage.set('task_summary_type', 1);
    } else {
      reactLocalStorage.set('task_summary_type', 0);
    }
    
    if (this.makeOfferSelected === 1) {
      this.makeOfferSelected = 0;
      return;
    }
    
    reactLocalStorage.set('task_summary_id', id);
    this.setState({ redirect: 1 });
  };
  
  renderItem = (index, key) => {
    const { tasks_datas } = this.state;
    let today = moment();
    let deadline = moment(tasks_datas[index].task_postline);
    let duration1 = moment.duration(today.diff(deadline));
    
    let dead = moment(tasks_datas[index].task_deadline).format("MM-DD-YYYY");
    
    let duration = duration1.asMinutes().toFixed(0); // as minute
    let duration_subfix = duration === '1' ? " Minute Ago" : " Minutes Ago";
    if (duration === '0' || duration === 0) {
      duration = "Just Before";
      duration_subfix = "";
    } else {
      if (duration > 59) { // as hour
        duration = duration1.asHours().toFixed(0);
        duration_subfix = duration === '1' ? " Hour Ago" : " Hours Ago";
        if (duration > 23) { // as Day
          duration = duration1.asDays().toFixed(0);
          duration_subfix = duration === '1' ? " Day Ago" : " Days Ago";
        }
      }
    }
    
    let offer_state = 0;
    let prev_offer = 0;
    for (let i = 0; i < tasks_datas[index].offerarray.length; i++) {
      if (tasks_datas[index].offerarray[i].user_token === reactLocalStorage.get('loggedToken')) {
        prev_offer = tasks_datas[index].offerarray[i].offer_amount;
        offer_state = 1;
        break;
      }
    }
    // 1: Posted, 2: Assigned, 3: Completed, 4: Cancelled
    if (tasks_datas[index].task_state === 2) {
      offer_state = 2;
    }
    if (tasks_datas[index].task_state === 3) {
      offer_state = 3;
    }
  
    let isPoster = 0;
    if (tasks_datas[index].user_token === reactLocalStorage.get('loggedToken')) {
      if (tasks_datas[index].task_state === 1) {
        isPoster = 1;
      } else {
        isPoster = 2;
      }
  
    }
    
    return (
      <div key={"react_list_key" + index} className="tasklist_item">
        <div className="tasklist_item_real" onClick={() => { this.goToTaskSummary(tasks_datas[index]._id, isPoster); }}>
          <div className="tasklist_item_avatarcontainer">
            {
              tasks_datas[index].user_avatar === '' ?
                <div className="tasklist_item_avatar"/>
                :
                <img className="tasklist_item_avatar1" src={tasks_datas[index].user_avatar}/>
            }
          </div>
          <div className="tasklist_item_desccontainer">
            <div className="task_title1">
              { tasks_datas[index].task_title }
            </div>
            <div className="task_title2">
              { tasks_datas[index].task_description }
            </div>
            <div className="task_title3">
              POSTED:
            </div>
            <div className="task_title4">
              { duration }{ duration_subfix }
            </div>
            <div className="task_title5">
              DEADLINE:
            </div>
            <div className="task_title6">
              { dead }
            </div>
          </div>
          <div className="tasklist_item_budgetcontainer">
            <div className="offercount1">
              ${tasks_datas[index].task_budget}
            </div>
            <div className="offercount2">
              Budget Amount
            </div>
          </div>
          <div className="tasklist_item_offerscontainer">
            <div className="offercount1">
              {tasks_datas[index].offerarray.length}
            </div>
            <div className="offercount2">
              All Offers
            </div>
          </div>
          <div className="tasklist_item_buttoncontainer">
            {
              (isPoster > 0) ?
                <div className="buttoncontainer1">
                  {isPoster === 1 ? "Posted" : "Assigned"}
                </div>
                :
                offer_state === 0 ?
                  <div className="buttoncontainer" onClick={() => { this.onMakeOffer(index, duration + " " + duration_subfix, offer_state, prev_offer); }}>
                    Make Offer
                  </div>
                  :
                  offer_state === 1 ?
                    <div className="buttoncontainer" onClick={() => { this.onMakeOffer(index, duration + " " + duration_subfix, offer_state, prev_offer); }}>
                      Update Offer
                    </div>
                    :
                    offer_state === 2 ?
                      <div className="buttoncontainer grayback1">
                        Assigned
                      </div>
                      :
                      <div className="buttoncontainer" onClick={() => { this.onMakeOffer(index, duration + " " + duration_subfix, offer_state, prev_offer); }}>
                        Completed
                      </div>
            }
            
            {/*{*/}
              {/*index % 5 === 0 &&*/}
                {/*<div className="buttoncontainer">*/}
                  {/*Make Offer*/}
                {/*</div>*/}
            {/*}*/}
            {/*{*/}
              {/*index % 5 === 1 &&*/}
                {/*<div className="buttoncontainer1">*/}
                  {/*Assigned*/}
                {/*</div>*/}
            {/*}*/}
            {/*{*/}
              {/*index % 5 === 2 &&*/}
              {/*<div className="buttoncontainer2">*/}
                {/*Completed*/}
              {/*</div>*/}
            {/*}*/}
            {/*{*/}
              {/*index % 5 === 3 &&*/}
              {/*<div className="buttoncontainer">*/}
                {/*Modify Offer*/}
              {/*</div>*/}
            {/*}*/}
          </div>
        </div>
        <div className="tasklist_item_real_bar"/>
      </div>
    );
  };
  
  renderItem_mapview = (index, key) => {
    const { tasks_datas } = this.state;
    let today = moment();
    let deadline = moment(tasks_datas[index].task_postline);
    let duration1 = moment.duration(today.diff(deadline));
  
    let dead = moment(tasks_datas[index].task_deadline).format("MM-DD-YYYY");
  
    let duration = duration1.asMinutes().toFixed(0); // as minute
    let duration_subfix = duration === '1' ? " Minute Ago" : " Minutes Ago";
    if (duration === '0' || duration === 0) {
      duration = "Just Before";
      duration_subfix = "";
    } else {
      if (duration > 59) { // as hour
        duration = duration1.asHours().toFixed(0);
        duration_subfix = duration === '1' ? " Hour Ago" : " Hours Ago";
        if (duration > 23) { // as Day
          duration = duration1.asDays().toFixed(0);
          duration_subfix = duration === '1' ? " Day Ago" : " Days Ago";
        }
      }
    }
  
    let offer_state = 0;
    let prev_offer = 0;
    for (let i = 0; i < tasks_datas[index].offerarray.length; i++) {
      if (tasks_datas[index].offerarray[i].user_token === reactLocalStorage.get('loggedToken')) {
        offer_state = 1;
        prev_offer = tasks_datas[index].offerarray[i].offer_amount;
        break;
      }
    }
    // 1: Posted, 2: Assigned, 3: Completed, 4: Cancelled
    if (tasks_datas[index].task_state === 2) {
      offer_state = 2;
    }
    if (tasks_datas[index].task_state === 3) {
      offer_state = 3;
    }
  
    let isPoster = 0;
    if (tasks_datas[index].user_token === reactLocalStorage.get('loggedToken')) {
      if (tasks_datas[index].task_state === 1) {
        isPoster = 1;
      } else {
        isPoster = 2;
      }
    }
    return (
      <div key={"react_list_key1" + index} className="tasklist_item_map">
        <div className="tasklist_item_real_map" onClick={() => { this.goToTaskSummary(tasks_datas[index]._id, isPoster); }}>
          <div className="tasklist_item_avatarcontainer">
            {
              tasks_datas[index].user_avatar === '' ?
                <div className="tasklist_item_avatar"/>
                :
                <img className="tasklist_item_avatar1" src={tasks_datas[index].user_avatar}/>
            }
            <div className="maplist_budget">${ tasks_datas[index].task_budget }</div>
          </div>
          <div className="tasklist_item_avatarcontainer_rest">
            <div className="task_title1 marginTop_15px">
              { tasks_datas[index].task_title }
            </div>
            <div className="task_title2_map">
              { tasks_datas[index].task_description }
            </div>
            <div className="task_title3_map">
              POSTED:
            </div>
            <div className="task_title4">
              { duration }{ duration_subfix }
            </div>
            <div className="task_title_btn_container">
              {
                (isPoster > 0) ?
                  <div className="task_title_btn1">
                    {isPoster === 1 ? "Posted" : "Assigned"}
                  </div>
                  :
                  offer_state === 0 ?
                    <div className="task_title_btn" onClick={() => { this.onMakeOffer(index, duration + " " + duration_subfix, offer_state, prev_offer); }}>
                      Make Offer
                    </div>
                    :
                    offer_state === 1 ?
                      <div className="task_title_btn" onClick={() => { this.onMakeOffer(index, duration + " " + duration_subfix, offer_state, prev_offer); }}>
                        Update Offer
                      </div>
                      :
                      offer_state === 2 ?
                        <div className="task_title_btn grayback1">
                          Assigned
                        </div>
                        :
                        <div className="task_title_btn" onClick={() => { this.onMakeOffer(index, duration + " " + duration_subfix, offer_state, prev_offer); }}>
                          Completed
                        </div>
              }
              
              
              
              {/*{*/}
                {/*index % 5 === 0 &&*/}
                  {/*<div className="task_title_btn">*/}
                    {/*Make offer*/}
                  {/*</div>*/}
              {/*}*/}
              {/*{*/}
                {/*index % 5 === 1 &&*/}
                  {/*<div className="task_title_btn1">*/}
                    {/*Assigned*/}
                  {/*</div>*/}
              {/*}*/}
              {/*{*/}
                {/*index % 5 === 2 &&*/}
                {/*<div className="task_title_btn2">*/}
                  {/*Completed*/}
                {/*</div>*/}
              {/*}*/}
              {/*{*/}
                {/*index % 5 === 3 &&*/}
                {/*<div className="task_title_btn">*/}
                  {/*Modify Offer*/}
                {/*</div>*/}
              {/*}*/}
              {/*{*/}
                {/*index % 5 === 4 &&*/}
                {/*<div className="task_title_btn1">*/}
                  {/*Posted*/}
                {/*</div>*/}
              {/*}*/}
              
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
    this.setState({ onAllCategory: !this.state.onAllCategory, onFilter: false })
  };
  
  onShowFilter = () => {
    this.setState({ onFilter: !this.state.onFilter, onAllCategory: false })
  };
  
  onMakeOffer = (index, dur, offer_state, prev_offer) => {
    this.makeOfferSelected = 1;
    this.setState({ amounttext: 0 });
    this.calculate(0);
    this.requests.fetchTaxInfosAndOpenOfferModal(index, dur, offer_state, prev_offer);
  };
  
  onMakeOffer1 = (index) => {
    let today = moment();
    let deadline = moment(this.state.tasks_datas[index].task_postline);
    let duration1 = moment.duration(today.diff(deadline));
  
    let dead = moment(this.state.tasks_datas[index].task_deadline).format("MM-DD-YYYY");
  
    let duration = duration1.asMinutes().toFixed(0); // as minute
    let duration_subfix = duration === '1' ? " Minute Ago" : " Minutes Ago";
    if (duration === '0' || duration === 0) {
      duration = "Just Before";
      duration_subfix = "";
    } else {
      if (duration > 59) { // as hour
        duration = duration1.asHours().toFixed(0);
        duration_subfix = duration === '1' ? " Hour Ago" : " Hours Ago";
        if (duration > 23) { // as Day
          duration = duration1.asDays().toFixed(0);
          duration_subfix = duration === '1' ? " Day Ago" : " Days Ago";
        }
      }
    }
  
    let offer_state = 0;
    let prev_offer = 0;
    for (let i = 0; i < this.state.tasks_datas[index].offerarray.length; i++) {
      if (this.state.tasks_datas[index].offerarray[i].user_token === reactLocalStorage.get('loggedToken')) {
        prev_offer = this.state.tasks_datas[index].offerarray[i].offer_amount;
        offer_state = 1;
        break;
      }
    }
  
    this.setState({ amounttext: 0 });
    this.calculate(0);
    this.requests.fetchTaxInfosAndOpenOfferModal(index, duration + " " + duration_subfix, offer_state, prev_offer);
  };
  
  getOfferTxtByIndex = index => {
    let offer_state = 0;
    for (let i = 0; i < this.state.tasks_datas[index].offerarray.length; i++) {
      if (this.state.tasks_datas[index].offerarray[i].user_token === reactLocalStorage.get('loggedToken')) {
        offer_state = 1;
        break;
      }
    }
    
    if (offer_state === 0) {
      return "Make Offer"
    } else {
      return "Update Offer"
    }
  };
  
  showOfferModal = (index, dur, offer_state, prev_offer) => {
    let categoryClassName = "exp_categoryicon" + this.state.tasks_datas[index].task_category;
    this.setState({ offerModalShow: true, task_index: index, categoryClassName, modal_duration: dur, offer_modal_type: offer_state, prev_offer_amount: prev_offer });
  };
  
  hideOfferModal = () => {
    this.setState({ offerModalShow: false });
    this.requests.fetchDatas()
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
  
  onMarkerClick = (props, marker, e) => {
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });
  };
  
  onMapClicked = (props) => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      })
    }
  };
  
  onChangeAmount = (text) => {
    if (text.nativeEvent.inputType === "deleteContentBackward") {
      this.setState({ amounttext: this._input_amount.value })
      this.calculate(this._input_amount.value)
    } else {
      
      if (this.state.amounttext === 0 || this.state.amounttext === '0') {
        if (this.checkDigits(text.nativeEvent.data, 1)) {
          this.setState({ amounttext: text.nativeEvent.data });
          this.calculate(text.nativeEvent.data)
        }
      } else {
        if (this._input_amount.value.length < 6) {
          if (this.checkDigits(text.nativeEvent.data, 1)) {
            this.setState({ amounttext: this._input_amount.value });
            this.calculate(this._input_amount.value)
          }
        }
      }
      
    }
  
    if (this._input_amount.value === '') {
      this.setState({ amounttext: 0 });
      this.calculate(0);
    }
  };
  
  calculate = (val) => {
    
    let amounttext = parseInt(val);
    let taxamount = 0;
    for (let i = 0; i < this.state.tax_array.length; i++) {
      let taxpercent = parseInt(this.state.tax_array[i].percentage);
      taxamount += amounttext / 100 * taxpercent;
    }
    let totalamount = amounttext + taxamount;
    let commissionamount = amounttext / 100 * this.state.commissionrate;
    let taskerearning = totalamount - commissionamount - taxamount;
    this.setState({ taxamount: taxamount.toFixed(2), totalamount: totalamount.toFixed(2), commissionamount: commissionamount.toFixed(2), taskerearning: taskerearning.toFixed(2) })
  };
  
  checkDigits = (str, len) => {
    return /^\d+$/.test(str) && str.length === len;
  };
  
  submitMakeOffer = (id, offer_modal_type) => {
    if (offer_modal_type === 0) {
      this.requests.makeOffer(id)
    } else {
      this.requests.updateOffer(id)
    }
  };
  
  onFilterApply = () => {
    this.setState({ onFilter: false });
  };
  
  setFilterStatus = i => {
    this.setState({ filter_status: i });
  };
  setFilterSort = i => {
    this.setState({ filter_sort: i });
  };
  setFilterDistance = i => {
    this.setState({ filter_distance: i });
  };
  
  render() {
    const {
      pageState,
      marginLeft,
      leftIcon,
      rightIcon,
      onAllCategory,
      onFilter,
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
      tasks_datas,
      isOpenIndex,
      isOpenStatus,
      offerModalShow,
      tax_array,
      amounttext,
      taxamount,
      totalamount,
      commissionamount,
      taskerearning,
      task_index,
      categoryClassName,
      modal_duration,
      offer_modal_type,
      prev_offer_amount,
      filter_status,
      filter_sort,
      filter_distance,
      
      redirect,
    } = this.state;
  
    if (redirect === 1) {
      return <Redirect push to="/tasksummary"/>;
    }
  
  
    //TODO
    
    const StyledMapWithAnInfoBox = compose(
      withProps({
        googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyD6waqCrk7bWzUg8Y0BYDJUpZ-J1-1Zt7s&v=3.exp&libraries=geometry,drawing,places",
        loadingElement: <div style={{ height: `100%` }} />,
        containerElement: <div style={{ height: `100%` }} />,
        mapElement: <div style={{ height: `100%` }} />,
        // center: { lat: 25.03, lng: 121.6 },
      }),
      withStateHandlers(() => ({
      }), {
      }),
      withScriptjs,
      withGoogleMap,
    )
    (
      props => {
        return(
          <GoogleMap
            defaultZoom={3}
            defaultCenter={ isOpenIndex !== -1 ? { lat: props.tasks_datas[isOpenIndex].task_location_lat, lng: props.tasks_datas[isOpenIndex].task_location_lng } : { lat: props.tasks_datas[0].task_location_lat, lng: props.tasks_datas[0].task_location_lng }}
            defaultOptions={{ styles: demoFancyMapStyles }}
          >
            
            {
              tasks_datas.map((task_data, index) =>
                <Marker
                  key={task_data.token}
                  position={{ lat: task_data.task_location_lat, lng: task_data.task_location_lng }}
                  onClick={() => {
                    if (isOpenIndex === index && isOpenStatus) {
                      this.setState({ isOpenStatus: false })
                    } else if (isOpenIndex === index && !isOpenStatus) {
                      this.setState({ isOpenStatus: true })
                    } else if (isOpenIndex !== index && isOpenStatus) {
                      this.setState({ isOpenIndex: index })
                    } else {
                      this.setState({ isOpenIndex: index, isOpenStatus: true })
                    }
                  }}
                >
                  {
                    (isOpenIndex === index && isOpenStatus) &&
                      <InfoWindow
                        onCloseClick={() => {
                          this.setState({ isOpenStatus: !isOpenStatus }) }
                        }
                      >
                        <div>
                          <div>
                            { task_data.task_title }
                          </div>
                          <div>
                            { task_data.task_location }
                          </div>
                          <div className="offercount2">
                            ${ task_data.task_budget }
                          </div>
                          <div>
                            {
                              tasks_datas[index].user_token === reactLocalStorage.get('loggedToken') ?
                                <div className="buttoncontainer1_inmap">
                                  Posted
                                </div>
                                :
                                <div className="buttoncontainer_inmap" onClick={() => { this.onMakeOffer1(index); }}>
                                  { this.getOfferTxtByIndex(index) }
                                </div>
                            }
                            
                          </div>
                        </div>
                      </InfoWindow>
                  }
                </Marker>
              )
            }
          </GoogleMap>
        )
      }
    );
    
    return (
      <div>
        <div className="col-sm-12 centerContent">
          <div className="exploretasks_top_selector">
            
            <div className={pageState === 0 ? "exploretasks_top_selector1 borderbottom" : "exploretasks_top_selector1"} onClick={() => { this.setState({ pageState: 0, onAllCategory: false, onFilter: false, }) }}>
              <div className="listview_txt">
                <div className={pageState === 0 ? "listview_img_on" : "listview_img_off"}/>
              </div>
              <div className={ pageState === 0 ? "listview_txt texton" : "listview_txt textoff"}>
                ListView
              </div>
            </div>
            
            <div className={pageState === 1 ? "exploretasks_top_selector1 borderbottom" : "exploretasks_top_selector1"} onClick={() => { this.setState({ pageState: 1, onAllCategory: false, onFilter: false, reloadGPS: true }) }}>
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
              <div className={onFilter ? "exploretasks_top_allcategories1_on" : "exploretasks_top_allcategories1"}>
                <div className="listview_txt textall">
                  Show Filters
                </div>
                <div className="listview_txt">
                  <div className={onFilter ? "uparrow_img" : "downarrow_img"}/>
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
            onFilter &&
              <div className="exploretasks_top_selector_filter">
                <div className="exploretasks_top_selector_filter1">
                  
                  <div className="exp_filter_leftside">
                    <div className="filter_txt1">Task Status</div>
                    <div className="filter_con1">
                      <div className={filter_status === 0 ? "filter_check_on" : "filter_check_off"} onClick={() => { this.setFilterStatus(0); }}/>
                      <div className="filter_txt2">All</div>
                    </div>
                    <div className="filter_con1">
                      <div className={filter_status === 1 ? "filter_check_on" : "filter_check_off"} onClick={() => { this.setFilterStatus(1); }}/>
                      <div className="filter_txt2">Tasks Receiving Offers</div>
                    </div>
                    <div className="filter_con1">
                      <div className={filter_status === 2 ? "filter_check_on" : "filter_check_off"} onClick={() => { this.setFilterStatus(2); }}/>
                      <div className="filter_txt2">Tasks Assigned</div>
                    </div>
                    <div className="filter_con1">
                      <div className={filter_status === 3 ? "filter_check_on" : "filter_check_off"} onClick={() => { this.setFilterStatus(3); }}/>
                      <div className="filter_txt2">Tasks Completed</div>
                    </div>
                  </div>
                  
                  <div className="exp_filter_verticalbar"/>
                  
                  <div className="exp_filter_mediumside">
                    <div className="filter_txt1">Sort By</div>
                    <div className="filter_con2">
                      <div className="filter_con2_1">
                        <div className="filter_con1">
                          <div className={filter_sort === 0 ? "filter_radio_on" : "filter_radio_off"} onClick={() => {this.setFilterSort(0);}}/>
                          <div className="filter_txt2">Most Recent</div>
                        </div>
                        <div className="filter_con1">
                          <div className={filter_sort === 1 ? "filter_radio_on" : "filter_radio_off"} onClick={() => {this.setFilterSort(1);}}/>
                          <div className="filter_txt2">Oldest</div>
                        </div>
                        <div className="filter_con1">
                          <div className={filter_sort === 2 ? "filter_radio_on" : "filter_radio_off"} onClick={() => {this.setFilterSort(2);}}/>
                          <div className="filter_txt2">Highest Amount</div>
                        </div>
                      </div>
                      <div className="filter_con2_1">
                        <div className="filter_con1">
                          <div className={filter_sort === 3 ? "filter_radio_on" : "filter_radio_off"} onClick={() => {this.setFilterSort(3);}}/>
                          <div className="filter_txt2">Less Offers</div>
                        </div>
                        <div className="filter_con1">
                          <div className={filter_sort === 4 ? "filter_radio_on" : "filter_radio_off"} onClick={() => {this.setFilterSort(4);}}/>
                          <div className="filter_txt2">More Offers</div>
                        </div>
                        <div className="filter_con1">
                          <div className={filter_sort === 5 ? "filter_radio_on" : "filter_radio_off"} onClick={() => {this.setFilterSort(5);}}/>
                          <div className="filter_txt2">Lowest Amount</div>
                        </div>
                      </div>
                    </div>
                    <div className="filter_apply_btn" onClick={this.onFilterApply}>Apply</div>
                  </div>
                  
                  <div className="exp_filter_verticalbar"/>
                  
                  <div className="exp_filter_rightside">
                    <div className="filter_txt1">Task Location</div>
                    <div className="filter_con1">
                      <div className={filter_distance === 0 ? "filter_radio_on" : "filter_radio_off"} onClick={() => { this.setFilterDistance(0); }}/>
                      <div className="filter_txt2">All</div>
                    </div>
                    <div className="filter_con1">
                      <div className={filter_distance === 1 ? "filter_radio_on" : "filter_radio_off"} onClick={() => { this.setFilterDistance(1); }}/>
                      <div className="filter_txt2">Less than 10KM</div>
                    </div>
                    <div className="filter_con1">
                      <div className={filter_distance === 2 ? "filter_radio_on" : "filter_radio_off"} onClick={() => { this.setFilterDistance(2); }}/>
                      <div className="filter_txt2">Less than 20KM</div>
                    </div>
                    <div className="filter_con1">
                      <div className={filter_distance === 3 ? "filter_radio_on" : "filter_radio_off"} onClick={() => { this.setFilterDistance(3); }}/>
                      <div className="filter_txt2">Less than 50KM</div>
                    </div>
                  </div>
                </div>
              </div>
          }
          
          {
            pageState === 0 &&
              <div>
                <div className="exploretasks_top_selector_without">
                  Showing { tasks_datas.length } tasks
                </div>
  
                <div className={ onAllCategory ? "react_list_container1_state2" : onFilter ? "react_list_container1_state3" : "react_list_container1_state1" }>
                  <ReactList
                    itemRenderer={this.renderItem}
                    length={tasks_datas.length}
                  />
                </div>
              </div>
          }
          
          {
            pageState === 1 &&
              <div>
                
                <div className={ onAllCategory ? "exploretasks_mapview_supercontainer1" : onFilter ? "exploretasks_mapview_supercontainer3" : "exploretasks_mapview_supercontainer2"}>
                  <div className={ onAllCategory ? "listcontainer1" : onFilter ? "listcontainer3" : "listcontainer2"}>
                    <ReactList
                      itemRenderer={this.renderItem_mapview}
                      length={tasks_datas.length}
                    />
                  </div>
                  <div className={ onAllCategory ? "mapcontainer1" : onFilter ? "mapcontainer3" : "mapcontainer2"}>
                    {
                      <StyledMapWithAnInfoBox tasks_datas={tasks_datas}/>
                    }
                  </div>
                </div>
              </div>
          }
          
        </div>
  
  
        <Modal
          show={offerModalShow}
          onHide={this.hideOfferModal}
          bsSize="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <div>Make Your Offer!</div>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {
              tasks_datas.length > 0 &&
                <div className="makeoffer-dlg-container">
                  <div className="makeoffer-dlg-top1">
      
                    <div className="makeoffer-dlg-top1-avatarcontainer">
                      {/*<div className="makeoffer-dlg-top1-avatar"/>*/}
                      <div className="exp_categoryiconcontainer1">
                        <div className="exp_categoryicon">
                          <div className={categoryClassName}/>
                        </div>
                      </div>
                    </div>
      
                    <div className="makeoffer-dlg-top1-descontainer">
                      <div>{ this.categoryLists[tasks_datas[task_index].task_category - 1] } - { tasks_datas[task_index].task_title }</div>
                      <div className="makeoffer-dlg-top1-desc1">
                        <div className="clockimage"/>
                        <div className="postedtext">POSTED : </div>
                        <div className="difftext">{ modal_duration }</div>
                      </div>
                      <div className="makeoffer-dlg-top1-desc2">
                        {
                          tasks_datas[task_index].user_avatar === '' ? <div className="avatarimage1"/> : <img src={tasks_datas[task_index].user_avatar} className="avatarimage2"/>
                        }
                        <div className="postername">{tasks_datas[task_index].user_postername} ( Poster )</div>
                        <div className="message">
                          <div className="msgimg"/>
                          <div className="msgtxt">Message</div>
                        </div>
                        {
                          offer_modal_type === 1 &&
                            <div className="postername">Previous Offer Amount : ${prev_offer_amount}</div>
                        }
                        
                      </div>
                    </div>
      
                    <div className="makeoffer-dlg-top1-budgetcontainer">
                      <div className="offercount11">
                        ${ tasks_datas[task_index].task_budget }
                      </div>
        
                      <div className="offercount21">
                        Budget
                      </div>
                    </div>
    
                  </div>
    
                  <div className="makeoffer-dlg-top1-bar"/>
    
                  <div className="makeoffer-dlg-top2">
                    <div className="makeoffer-dlg-top1-avatarcontainer"/>
      
                    <div className="makeoffer-dlg-top1-descontainer11">
                      <div className="emaountleftside">
                        <div>ENTER OFFER AMOUNT</div>
                        <input
                          className="form-control enteramountinput"
                          ref={ref => (this._input_amount = ref)}
                          onChange={this.onChangeAmount}
                          value={amounttext}
                        />
                        <div className="youroffercontainer">
                          <div className="youroffer">Your Offer</div>
                          <div className="yourofferval">${amounttext}</div>
                        </div>
                        <div className="youroffercontainer">
                          <div className="youroffer">Taxes</div>
                          <div className="yourofferval">${taxamount}</div>
                        </div>
                        <div className="youroffercontainer">
                          <div className="youroffer">Total</div>
                          <div className="yourofferval">${totalamount}</div>
                        </div>
                        <div className="youroffercontainer">
                          <div className="youroffer">Commission</div>
                          <div className="yourofferval">${commissionamount}</div>
                        </div>
                        <div className="yourofferbar"/>
                        <div className="youroffercontainer">
                          <div className="youroffer redtext">Your Earning</div>
                          <div className="yourofferval redtext">${taskerearning}</div>
                        </div>
                      </div>
                      <div className="spacemediumside">
                      </div>
                      <div className="descrightside">
                        <div className="flexview">
                          <div className="youroffer">DESCRIPTION</div>
                          <div className="yourofferval exgraytext">Upto 500 Characters</div>
                        </div>
                        <textarea
                          className="form-control descarea"
                          ref={ref => (this._input_desc = ref)}
                        />
                        <div>
                          <div className="submitbtn" onClick={() => { this.submitMakeOffer(tasks_datas[task_index]._id, offer_modal_type); }}>
                            { offer_modal_type === 0 ? "Make Offer" : "Update Offer" }
                          </div>
                        </div>
                      </div>
                    </div>
    
                  </div>
  
                </div>
            }
  
            
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.hideOfferModal}>Close</Button>
          </Modal.Footer>
        </Modal>
        
      </div>
    )
  }
}

ExploreTasks.propTypes = {
  updateHeader: PropTypes.func.isRequired
};
