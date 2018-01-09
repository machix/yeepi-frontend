import React, { PropTypes } from 'react';
import "./styles.css"
import config from "../../config";
import {eng, fre} from "../../lang";
import ReactList from 'react-list';
import {reactLocalStorage} from "reactjs-localstorage";
import moment from 'moment';
import demoFancyMapStyles from './../ExploreTasks/demoFancyMapStyles';
import Swiper from 'react-id-swiper';
import { Redirect } from 'react-router';
import { Modal, Button } from 'react-bootstrap';
import {
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow,
  withScriptjs
} from "react-google-maps";

import Promise from 'promise';
import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';
import {compose, withProps, withStateHandlers} from "recompose";
let superagent = superagentPromise(_superagent, Promise);

const base_url_public = config.baseUrl;

export default class TaskSummary extends React.Component {
  
  constructor() {
    super();
    this.state = {
      task: {},
      offer_users: [],
      
      pageState: 0,
      showImageSlider: false,
      offerModalShow: false,
      offerAssigned: false,
      cancelTask: false,
  
      assigned_user: {},
      redirect: 0,
      
      isPoster: 0,
  
      tax_array: [],
      tasker_update_or_create_offer: false,
      amounttext: 0,
      commissionrate: 100,
      taxamount: 0,
      totalamount: 0,
      commissionamount: 0,
      taskerearning: 0,
  
      categoryClassName: '',
      modal_duration: '',
      offer_modal_type: 0,
      prev_offer_amount: 0,
      lang: eng,
    };
    this.requests = {
      fetchDatas: () =>
        superagent.post(base_url_public + '/frontend/fetchtaskbyid', { id: reactLocalStorage.get('task_summary_id') }).then(res => {
          if (!res.body.result) {
            this.setState({ showAlert: true, alertText: res.body.text })
          } else {
            this.setState({ task: res.body.task, offer_users: res.body.offer_users, assigned_user: res.body.assigned_user })
          }
        }),
      assignTask: () =>
        superagent.post(base_url_public + '/frontend/task/assign', {
          id: reactLocalStorage.get('task_summary_id'),
          offer_amount: this.offer_amount,
          offer_user_token: this.offer_usertoken
        }).then(res => {
          if (!res.body.result) {
            this.setState({ showAlert: true, alertText: res.body.text })
          } else {
            this.hideOfferModal();
            this.showOfferAssigned();
            this.setState({ task: res.body.task, assigned_user: res.body.assigned_user })
          }
        }),
      startTask: () =>
        superagent.post(base_url_public + '/frontend/task/start', {
          id: reactLocalStorage.get('task_summary_id'),
        }).then(res => {
          if (!res.body.result) {
            this.setState({ showAlert: true, alertText: res.body.text })
          } else {
            this.setState({ task: res.body.task })
          }
        }),
      cancelTask: () =>
        superagent.post(base_url_public + '/frontend/task/cancel', {
          id: reactLocalStorage.get('task_summary_id'),
        }).then(res => {
          if (!res.body.result) {
            this.setState({ showAlert: true, alertText: res.body.text })
          } else {
            this.cancelTask();
          }
        }),
      withdrawFromTask: () =>
        superagent.post(base_url_public + '/frontend/task/withdraw', {
          id: reactLocalStorage.get('task_summary_id'),
        }).then(res => {
          if (!res.body.result) {
            this.setState({ showAlert: true, alertText: res.body.text })
          } else {
            this.requests.fetchDatas();
            this.hideCancelTaskModal();
          }
        }),
      fetchTaxInfosAndOpenOfferModal: (dur, offer_state, prev_offer) =>
        superagent.get(base_url_public + '/settings/list', {}).then(res => {
          if (!res.body.result) {
            this.setState({ showAlert: true, alertText: res.body.text })
          } else {
            this.setState({ tax_array: res.body.settings[0].tax_array, commissionrate: parseInt(res.body.settings[0].commission) });
            this.showOfferModal(dur, offer_state, prev_offer);
          }
        }),
      makeOffer: (id) =>
        superagent.post(base_url_public + '/frontend/tasks/offer/make', {id: id, user_token: reactLocalStorage.get('loggedToken'), offer_amount: this.state.amounttext, offer_desc: this._input_desc.value, offer_update_time: moment() }).then(res => {
          if (!res.body.result) {
            this.setState({ showAlert: true, alertText: res.body.text })
          } else {
            this.requests.fetchDatas();
            this.hideNewOfferModal();
          }
        }),
      updateOffer: (id) =>
        superagent.post(base_url_public + '/frontend/tasks/offer/update', {id: id, user_token: reactLocalStorage.get('loggedToken'), offer_amount: this.state.amounttext, offer_desc: this._input_desc.value, offer_update_time: moment() }).then(res => {
          if (!res.body.result) {
            this.setState({ showAlert: true, alertText: res.body.text })
          } else {
            this.setState({ task: res.body.task });
            this.hideNewOfferModal();
          }
        }),
      createMsgLink: (poster_email, tasker_email) =>
        superagent.post(base_url_public + '/msglink/create', { poster_email, tasker_email }).then(res => {
          debugger;
          if (!res.body.result) {
            this.setState({ showAlert: true, alertText: res.body.text })
          } else {
            this.setState({ redirect: 1221 });
          }
        })
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
    this.params = {
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      },
    };
    this.offer_username = '';
    this.offer_amount = '';
    this.offer_desc = '';
    this.offer_dur = '';
    this.imagePreviewUrl = '';
    this.offer_usertoken = '';
  
    this.isWithdraw = false;
  }
  
  componentDidMount() {
    this.setState({ isPoster: reactLocalStorage.get('task_summary_type') });
    setTimeout(() => {
      this.props.updateHeader(10);
    }, 100);
    this.requests.fetchDatas();
  }
  
  onViewOffers = () => {
    this.setState({ pageState: 1 });
  };
  
  onCloseOffers = () => {
    this.setState({ pageState: 0 });
  };
  
  onPopUpAttachments = () => {
    this.setState({ showImageSlider: true })
  };
  
  closeImageSlider = () => {
    this.setState({ showImageSlider: false })
  };
  
  hideOfferModal = () => {
    this.setState({ offerModalShow: false })
  };
  
  showOfferAssigned = () => {
    this.setState({ offerAssigned: true })
  };
  
  hideOfferAssigned = () => {
    this.setState({ offerAssigned: false })
  };
  
  showCancelTaskModal = () => {
    this.isWithdraw = false;
    this.setState({ cancelTask: true });
  };
  
  hideCancelTaskModal = () => {
    this.setState({ cancelTask: false });
  };
  
  acceptOffer = (offer_username, offer_amount, offer_desc, offer_dur, imagePreviewUrl, offer_usertoken) => {
    this.offer_username = offer_username;
    this.offer_amount = offer_amount;
    this.offer_desc = offer_desc;
    this.offer_dur = offer_dur;
    this.imagePreviewUrl = imagePreviewUrl;
    this.offer_usertoken = offer_usertoken;
    this.setState({ offerModalShow: true })
  };
  
  cancelTask = () => {
    this.setState({ redirect: 1217 });
  };
  
  createMessageLink = (offer_user) => {
    console.info(reactLocalStorage.get('loggedEmail'));
    console.info(offer_user.email);
    this.requests.createMsgLink(reactLocalStorage.get('loggedEmail'), offer_user.email);
  };

  createMessageLink_Tasker = (poster_email) => {
    this.requests.createMsgLink(reactLocalStorage.get('loggedEmail'), poster_email);
  };
  
  renderItem = (index, key) => {
    const { task, offer_users, lang } = this.state;
    
    
    let offer_amount = "";
    let offer_desc = "";
    let offer_updatetime = "";
    for (let i = 0; i < task.offerarray.length; i++) {
      if (task.offerarray[i].user_token === offer_users[index].token) {
        offer_amount = task.offerarray[i].offer_amount;
        offer_desc = task.offerarray[i].offer_desc;
        offer_updatetime = task.offerarray[i].offer_update_time;
      }
    }
    
    let offer_username = offer_users[index].username;
    let offer_usertoken = offer_users[index].token;
  
    let today = moment();
    let deadline = moment(offer_updatetime);
    let duration1 = moment.duration(today.diff(deadline));
  
    let duration = duration1.asMinutes().toFixed(0); // as minute
    let duration_subfix = duration === '1' ? " Minute Ago" : " Minutes Ago";
    if (duration === '0' || duration === 0) {
      duration = lang.just_before;
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
  
    let dur = duration + " " + duration_subfix;
  
    return (
      <div key={"offer_list_key" + index} className="offerlist_item">
        <div className="offerlist_section1">
          <div className="offerlist_section1_leftside">
            {
              offer_users[index].imagePreviewUrl === "" ? <div className="offerlist_avatar_nosrc"/> : <img src={offer_users[index].imagePreviewUrl} className="offerlist_avatar"/>
            }
          </div>
          <div className="offerlist_section1_mediumside">
            <div className="offerlist_section1_mediumside_txt1">{ offer_username }</div>
            <div className="offerlist_starcontainer">
              <div className="offerlist_star"/>
              <div className="offerlist_star"/>
              <div className="offerlist_star"/>
              <div className="offerlist_star"/>
              <div className="offerlist_star"/>
              <div className="offerlist_section1_mediumside_txt1 greentext margin-left-5px">4.5/5</div>
            </div>
            <div className="offerlist_section1_mediumside_txt1">{lang.task_completion_rate}: 4.5/5</div>
          </div>
          <div className="offerlist_section1_rightside">
            {
              this.state.isPoster === '1' ?
                task.task_state === 2 ?
                  <div className="offer_message_disabled">
                    <div className="msgimg_white"/>
                    <div className="msgtxt whitetext">{lang.message}</div>
                  </div>
                  :
                  <div className="offer_message" onClick={() => { this.createMessageLink(offer_users[index]); }}>
                    <div className="msgimg"/>
                    <div className="msgtxt">{lang.message}</div>
                  </div>
                :
                null
            }
          </div>
        </div>
        <div className="offerlist_section2">
          <div className="offerlist_section2_txt">{lang.hi_i_am_available}</div>
          <div className="offerlist_section2_flex">
            <div className="offerlist_clock"/>
            <div className="offerlist_section2_txt1">{ dur }</div>
          </div>
          <div className="offerlist_section2_txt">{ offer_desc }</div>
          <div className="offerlist_section2_flex">
            <div className="offerlist_section2_flex_leftside">
              <div className="offerlist_section2_txt offeredamount">{lang.offered_amount}: ${offer_amount}</div>
            </div>
            <div className="offerlist_section2_flex_leftside">
              {
                this.state.isPoster === '1' ?
                  task.task_state === 2 ? <div className="offerlist_acceptbtn_disabled">{lang.accept_offer}</div> : <div className="offerlist_acceptbtn" onClick={() => { this.acceptOffer(offer_username, offer_amount, offer_desc, dur, offer_users[index].imagePreviewUrl, offer_usertoken) }}>{lang.accept_offer}</div>
                  :
                  null
              }
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  modifyOffer = () => {
    alert('modify .')
  };
  
  showNewOfferModal = (dur, offer_state, prev_offer) => {
    this.setState({ amounttext: 0 });
    this.calculate(0);
    this.requests.fetchTaxInfosAndOpenOfferModal(dur, offer_state, prev_offer);
  };
  
  hideNewOfferModal = () => {
    this.setState({ tasker_update_or_create_offer: false })
  };
  
  showOfferModal = (dur, offer_state, prev_offer) => {
    let categoryClassName = "exp_categoryicon" + this.state.task.task_category;
    this.setState({ tasker_update_or_create_offer: true, categoryClassName, modal_duration: dur, offer_modal_type: offer_state, prev_offer_amount: prev_offer });
  };
  
  onChangeAmount = (text) => {
    if (text.nativeEvent.inputType === "deleteContentBackward") {
      this.setState({ amounttext: this._input_amount.value });
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
  
  withdrawTask = () => {
    this.isWithdraw = true;
    this.setState({ cancelTask: true });
  };
  
  startTask = () => {
    this.requests.startTask();
  };
  
  render() {
    const {
      task,
      offer_users,
      pageState,
      showImageSlider,
      offerModalShow,
      offerAssigned,
      redirect,
      assigned_user,
      cancelTask,
      isPoster,
      tasker_update_or_create_offer,
      amounttext,
      taxamount,
      totalamount,
      commissionamount,
      taskerearning,
      modal_duration,
      offer_modal_type,
      prev_offer_amount,
      lang,
    } = this.state;
    if (redirect === 1221) {
      return <Redirect push to="/messages"/>;
    }
    if (redirect === 1217) {
      return <Redirect push to="/exploretasks"/>;
    }
    
    let categoryClassName = "exp_categoryicon" + task.task_category;
    
    let today = moment();
    let deadline = moment(task.task_postline);
    let duration1 = moment.duration(today.diff(deadline));
  
    let dead = moment(task.task_deadline).format("MM-DD-YYYY");
  
    let duration = duration1.asMinutes().toFixed(0); // as minute
    let duration_subfix = duration === '1' ? " Minute Ago" : " Minutes Ago";
    if (duration === '0' || duration === 0) {
      duration = lang.just_before;
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
    
    let dur = duration + " " + duration_subfix;
  
  
    const StyledMapWithAnInfoBox = compose(
      withProps({
        googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyD6waqCrk7bWzUg8Y0BYDJUpZ-J1-1Zt7s&v=3.exp&libraries=geometry,drawing,places",
        loadingElement: <div style={{ width: `100%`, height: `100%` }} />,
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
            defaultZoom={9}
            defaultCenter={ props.task.task_category === 4 ? { lat: props.task.task_from_location_lat, lng: props.task.task_from_location_lng } : { lat: props.task.task_location_lat, lng: props.task.task_location_lng }}
            defaultOptions={{ styles: demoFancyMapStyles }}
          >
          
            {
              !(props.task.task_category !== 4 && props.task.task_location === '') &&
                <Marker
                  position={ props.task.task_category === 4 ? { lat: props.task.task_from_location_lat, lng: props.task.task_from_location_lng} : { lat: props.task.task_location_lat, lng: props.task.task_location_lng }}
                  // onClick={() => {
                  //   if (isOpenIndex === index && isOpenStatus) {
                  //     this.setState({ isOpenStatus: false })
                  //   } else if (isOpenIndex === index && !isOpenStatus) {
                  //     this.setState({ isOpenStatus: true })
                  //   } else if (isOpenIndex !== index && isOpenStatus) {
                  //     this.setState({ isOpenIndex: index })
                  //   } else {
                  //     this.setState({ isOpenIndex: index, isOpenStatus: true })
                  //   }
                  // }}
                />
            }
          </GoogleMap>
        )
      }
    );
    
    let render_offer_avatars = [];
    for (let i = 0; i < offer_users.length; i++) {
      let key = "offer_users" + i;
      if (i === 0) {
        if (offer_users[i].imagePreviewUrl === '') {
          render_offer_avatars.push(
            <div key={key} className="offeravatar1_noavatar"/>
          )
        } else {
          render_offer_avatars.push(
            <img key={key} src={offer_users[i].imagePreviewUrl} className="offeravatar1"/>
          )
        }
      } else if (i < 4) {
        if (offer_users[i].imagePreviewUrl === '') {
          render_offer_avatars.push(
            <div key={key} className="offeravatar2_noavatar"/>
          )
        } else {
          render_offer_avatars.push(
            <img key={key} src={offer_users[i].imagePreviewUrl} className="offeravatar2"/>
          )
        }
      }
    }
    if (offer_users.length > 4) {
      render_offer_avatars.push(
        <div className="offeravatar3">
          { offer_users.length - 4 }
        </div>
      )
    }
  
    
    let render_attachments = [];
    if (task.task_attachments !== undefined) {
      if (task.task_attachments.length === 0) {
      
      } else if (task.task_attachments.length === 1) {
        render_attachments.push(
          <img src={task.task_attachments[0]} className="summary_attach1" onClick={this.onPopUpAttachments}/>
        );
      } else if (task.task_attachments.length === 2) {
        render_attachments.push(
          <img src={task.task_attachments[0]} className="summary_attach1" onClick={this.onPopUpAttachments}/>
        );
        render_attachments.push(
          <img src={task.task_attachments[1]} className="summary_attach2" onClick={this.onPopUpAttachments}/>
        );
      } else if (task.task_attachments.length === 3) {
        render_attachments.push(
          <img src={task.task_attachments[0]} className="summary_attach1" onClick={this.onPopUpAttachments}/>
        );
        render_attachments.push(
          <img src={task.task_attachments[1]} className="summary_attach2" onClick={this.onPopUpAttachments}/>
        );
        render_attachments.push(
          <img src={task.task_attachments[2]} className="summary_attach2" onClick={this.onPopUpAttachments}/>
        );
      } else {
        render_attachments.push(
          <img src={task.task_attachments[0]} className="summary_attach1" onClick={this.onPopUpAttachments}/>
        );
        render_attachments.push(
          <img src={task.task_attachments[1]} className="summary_attach2" onClick={this.onPopUpAttachments}/>
        );
        render_attachments.push(
          <img src={task.task_attachments[2]} className="summary_attach2" onClick={this.onPopUpAttachments}/>
        );
        render_attachments.push(
          <div className="summary_attach3" onClick={this.onPopUpAttachments}>
            <div className="summary_loadmore_img"/>
            <div className="summary_loadmore_txt">+ {task.task_attachments.length - 3}</div>
          </div>
        );
      }
    }
  
    let render_popup_attachs = [];
    if (task.task_attachments !== undefined) {
      for (let i = 0; i < task.task_attachments.length; i++) {
        render_popup_attachs.push(
          <img className="post_image1" src={task.task_attachments[i]} />
        );
      }
    }
  
    let render_additional_cleaning_options = [];
    if (task.task_attachments !== undefined) {
      if (task.task_category === 1) {
        if (task.task_cleaning_option1) {
          render_additional_cleaning_options.push(
            <div className="cleaningoptions1_container">
              <div className="cleaningoptions1_container_flex">
                <div className="summary_cleaning_option_item_img1_checked"/>
              </div>
              <div className="centertext">{lang.laundry}</div>
            </div>
          );
        }
        if (task.task_cleaning_option2) {
          render_additional_cleaning_options.push(
            <div className="cleaningoptions1_container">
              <div className="cleaningoptions1_container_flex">
                <div className="summary_cleaning_option_item_img2_checked"/>
              </div>
              <div className="centertext">{lang.oven}</div>
            </div>
          );
        }
        if (task.task_cleaning_option3) {
          render_additional_cleaning_options.push(
            <div className="cleaningoptions1_container">
              <div className="cleaningoptions1_container_flex">
                <div className="summary_cleaning_option_item_img3_checked"/>
              </div>
              <div className="centertext">{lang.cabinet}</div>
            </div>
          );
        }
        if (task.task_cleaning_option4) {
          render_additional_cleaning_options.push(
            <div className="cleaningoptions1_container">
              <div className="cleaningoptions1_container_flex">
                <div className="summary_cleaning_option_item_img4_checked"/>
              </div>
              <div className="centertext">{lang.carpet}</div>
            </div>
          );
        }
        if (task.task_cleaning_option5) {
          render_additional_cleaning_options.push(
            <div className="cleaningoptions1_container">
              <div className="cleaningoptions1_container_flex">
                <div className="summary_cleaning_option_item_img5_checked"/>
              </div>
              <div className="centertext">{lang.windows}</div>
            </div>
          );
        }
      }
    }
  
    let offer_state = 0;
    let prev_offer = 0;
    if (task.offerarray !== undefined) {
      for (let i = 0; i < task.offerarray.length; i++) {
        if (task.offerarray[i].user_token === reactLocalStorage.get('loggedToken')) {
          offer_state = 1;
          prev_offer = task.offerarray[i].offer_amount;
          break;
        }
      }
    }
  
    let me = {};
    if (offer_users.length !== undefined) {
      for (let i = 0; i < offer_users.length; i++) {
        if (offer_users[i].token === reactLocalStorage.get('loggedToken')) {
          me = offer_users[i];
        }
      }
    }
    
    let to_me = false;
    if (assigned_user.token !== undefined) {
      if (me.token === assigned_user.token) {
        to_me = true;
      }
    }

    return (
      <div>
        {
          task._id !== undefined &&
            <div className="col-sm-12 centerContent">
              <div className="makeoffer-dlg-container">
                <div className="summary-dlg-top1">
      
                  <div className="makeoffer-dlg-top1-avatarcontainer">
                    <div className="exp_categoryiconcontainer1">
                      <div className="exp_categoryicon">
                        <div className={categoryClassName}/>
                      </div>
                    </div>
                  </div>
      
                  <div className="summary-descontainer">
                    <div className="largefont">
                      { this.categoryLists[task.task_category - 1] } - { task.task_title }
                    </div>
                    <div className="makeoffer-dlg-top1-desc2">
                      {
                        task.user_avatar === '' ? <div className="avatarimage1"/> : <img src={task.user_avatar} className="avatarimage2"/>
                      }
                      <div className="postername">{task.user_postername} { isPoster === '1' ? "( " + lang.you1 + " )" : "( " + lang.poster + " )"}</div>
                    </div>
                  </div>
  
                  {
                    isPoster === '1' &&
                      <div className="summary-dlg-top1-budgetcontainer">
                        <div className="offercount11 floatright centertext">
                        </div>
                        <div className="offercount21 floatright centertext">
                        </div>
                      </div>
                  }
                  {
                    isPoster === '1' &&
                      <div className="summary-dlg-top1-budgetcontainer">
                        <div className="offercount11 floatright centertext">
                        </div>
                        <div className="offercount21 floatright centertext">
                        </div>
                      </div>
                  }
                  
                  <div className="summary-dlg-top1-budgetcontainer">
                    <div className="offercount11 floatright centertext">
                      ${ task.task_budget }
                    </div>
        
                    <div className="offercount21 floatright centertext">
                      { lang.budget }
                    </div>
                  </div>
  
                  {
                    to_me ?
                      <div className="summary-dlg-top1-budgetcontainer">
                        <div className="summary-tasker-messagebtn" onClick={() => { this.createMessageLink_Tasker(task.user_posteremail) }}>
                          <div className="msgimg"/>
                          <div className="msgtxt">{lang.message}</div>
                        </div>
                      </div>
                      :
                      task.task_state === 2 ?
                        isPoster === '0' &&
                          <div className="summary-dlg-top1-budgetcontainer">
                            <div className="summary-tasker-messagebtn darkgrayback">
                              <div className="msgimg"/>
                              <div className="msgtxt darkgraytxt">{lang.message}</div>
                            </div>
                          </div>
                        :
                        isPoster === '0' &&
                          <div className="summary-dlg-top1-budgetcontainer">
                            <div className="summary-tasker-messagebtn" onClick={() => { this.createMessageLink_Tasker(task.user_posteremail) }}>
                              <div className="msgimg"/>
                              <div className="msgtxt">{lang.message}</div>
                            </div>
                          </div>
                  }
                  
                  {
                    to_me ?
                      <div className="summary-dlg-top1-budgetcontainer" onClick={this.startTask}>
                        {
                          task.task_start && <div className="summary-taskstarted-txt greentext">{lang.task_completed} ?</div>
                        }
                        <div className="summary-tasker-cancelbtn">
                          { task.task_start ? "Request Payment" : "Start Task" }
                        </div>
                      </div>
                      :
                      task.task_state === 2 ?
                        isPoster === '0' &&
                          <div className="summary-dlg-top1-budgetcontainer">
                            <div className="summary-tasker-cancelbtn darkgrayback">
                              { offer_state === 1 ? "Modify the Offer" : "Make the Offer" }
                            </div>
                          </div>
                        :
                        isPoster === '0' &&
                          <div className="summary-dlg-top1-budgetcontainer">
                            <div className="summary-tasker-cancelbtn" onClick={() => {this.showNewOfferModal(duration + " " + duration_subfix, offer_state, prev_offer); }}>
                              { offer_state === 1 ? lang.modify_the_offer : lang.make_the_offer }
                            </div>
                          </div>
                  }
                  
                </div>
  
                <div className="summary_infobar">
                  <div className="summary_info_sub1">
                    <div className="summary-dlg-top1-desc1">
                      <div className="clockimage"/>
                      <div className="postedtext">{lang.posted_uppercase} : </div>
                      <div className="difftext">{ dur }</div>
                    </div>
                  </div>
                  
                  <div className="summary_info_bar1"/>
                  
                  <div className="summary_info_sub2">
                    <div className="summary-dlg-top1-desc1">
                      <div className="summary_stopwatch"/>
                      <div className="postedtext">{lang.deadline} : </div>
                      <div className="difftext">{ dead }</div>
                    </div>
                  </div>
                  
                  <div className="summary_info_bar1"/>
                  
                  <div className="summary_info_sub3">
                    <div className="summary-dlg-top1-desc1">
                      <div className="summary-status1">{lang.status_uppercase} : </div>
                      <div className="summary-status2">{lang.open1}</div>
                    </div>
                  </div>
  
                  <div className="summary_info_bar1"/>
                  
                  <div className="summary_info_sub4">
                    <div className="margintop5">
                      <div className="post_toptitle_center1_1 marginleft" >
                        {lang.share_on} :
                      </div>
                      <div className="post_toptitle_center1_1_fb" />
                      <div className="post_toptitle_center1_1" >
                        {lang.facebook}
                      </div>
                      <div className="post_toptitle_center1_1_mail" />
                      <div className="post_toptitle_center1_1" >
                        {lang.email}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="summary_top_2">
                  <div className="summary_top_2_leftside">
                    {
                      (isPoster === '0' && offer_state === 1 && !to_me) &&
                        <div>
                          
                          <div className="summary_task_assigned_fullcontainer">
    
                            <div className="summary_task_assigned_leftcontainer">
                              <div className="lefttext">{lang.your_offer}</div>
                              <div className="summary-dlg-top2-leftside-top1">
                                <div className="summary-dlg-top2-leftside-top1-avatar">
                                  {
                                    me.imagePreviewUrl === "" ? <div className="modal-avatar-no"/> : <img src={me.imagePreviewUrl} className="modal-avatar"/>
                                  }
                                </div>
                                <div className="summary-dlg-top2-leftside-top1-text">
                                  <div className="offerlist_section1_mediumside_txt1 lineheight-25">{me.username}</div>
                                  <div className="offerlist_section1_mediumside_txt1 lineheight-25">{lang.need_to_be_updated}</div>
                                </div>
                              </div>
                            </div>
    
                            <div className="summary_task_assigned_rightcontainer">
                              <div className="righttext greentext hugetext margintop-25">
                                ${ prev_offer }
                              </div>
                              <div className="righttext">
                                {lang.offer_amount}
                              </div>
                            </div>
                          </div>
  
                          <div className="summary_task_assigned_fullcontainer_bottombar_withoutmargin"/>
                          
                        </div>
                    }
  
                    {
                      task.task_state === 2 &&
                      <div>
      
                        <div className="summary_task_assigned_fullcontainer">
        
                          <div className="summary_task_assigned_leftcontainer">
                            {
                              to_me ? <div className="lefttext redtext">{lang.task_assigned_to_you}</div> : <div className="lefttext">{lang.task_assigned_to}</div>
                            }
                            <div className="summary-dlg-top2-leftside-top1">
                              <div className="summary-dlg-top2-leftside-top1-avatar">
                                {
                                  assigned_user.imagePreviewUrl === "" ? <div className="modal-avatar-no"/> : <img src={assigned_user.imagePreviewUrl} className="modal-avatar"/>
                                }
                              </div>
                              <div className="summary-dlg-top2-leftside-top1-text">
                                <div className="offerlist_section1_mediumside_txt1">{assigned_user.username}</div>
                                <div className="offerlist_starcontainer">
                                  <div className="offerlist_star"/>
                                  <div className="offerlist_star"/>
                                  <div className="offerlist_star"/>
                                  <div className="offerlist_star"/>
                                  <div className="offerlist_star"/>
                                  <div className="offerlist_section1_mediumside_txt1 greentext margin-left-5px">4.5/5</div>
                                </div>
                                <div className="offerlist_section1_mediumside_txt1">{lang.task_completion_rate}: 4.5/5</div>
                                <div className="offerlist_section1_mediumside_txt1">{lang.location}: {assigned_user.city}</div>
                              </div>
                            </div>
                          </div>
        
                          <div className="summary_task_assigned_rightcontainer">
                            <div className="righttext greentext hugetext">
                              ${ task.assigned_amount }
                            </div>
                            <div className="righttext">
                              Amount agreed
                            </div>
                            <div className="assigned_message" onClick={() => { this.setState({ redirect: 1221 }) }}>
                              <div className="msgimg"/>
                              <div className="msgtxt">{lang.message}</div>
                            </div>
                          </div>
                        </div>
      
                        <div className="summary_task_assigned_fullcontainer_bottombar"/>
    
                      </div>
                    }
                    
                    {
                      pageState === 1 &&
                        <div className="effectview"/>
                    }
                    <div className={ pageState === 0 ? "summary_leftline1" : "summary_leftline1_gray" }>
                      <div className={ pageState === 0 ? "allofferscontainer" : "allofferscontainer_withoutbottom"}>
                        <div className="allofferstxt">{lang.all_offers}</div>
                        {
                          render_offer_avatars
                        }
                        {
                          (pageState === 0 && offer_users.length > 0) &&
                            <div className="viewofferbtn" onClick={this.onViewOffers}>{lang.view_offers}</div>
                        }
                        {
                          pageState === 1 &&
                          <div className="rightImg"/>
                        }
                      </div>
                    </div>
                    <div className="summary_leftline2">
                      <div className="summary_desccontainer">
                        
                        <div className="taskdesctxt">
                          {lang.task_description}
                        </div>
                        
                        <div className="taskdesctxt1">
                          { task.task_description }
                        </div>
  
                        {
                          task.task_category === 1 &&
                            <div>
  
                              <div className="tasksummary_bar"/>
  
                              <div className="taskdesctxt">
                                { task.task_is_endleasing ? "THIS IS AN END LEASING CLEANING" : "THIS IS NOT AN END LEASING CLEANING"}
                              </div>
                              
                              <div className="summary_taskdetail_container">
                                <div className="summary_taskdetail_container1">
                                  <div className="summary_taskdetail_txt">
                                    PROPERTY TYPE
                                  </div>
                                  <div className="summary_taskdetail_txt greentext">
                                    { task.task_house_or_apartment ? "Apartment" : "House" }
                                  </div>
                                </div>
                                <div className="summary_taskdetail_container1">
                                  <div className="summary_taskdetail_txt">
                                    {lang.number_of_bedrooms}
                                  </div>
                                  <div className="summary_taskdetail_txt greentext">
                                    { task.task_bedroomcount } - {lang.bedrooms}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="summary_taskdetail_container">
                                <div className="summary_taskdetail_container1">
                                  <div className="summary_taskdetail_txt">
                                    {lang.number_of_bathrooms}
                                  </div>
                                  <div className="summary_taskdetail_txt greentext">
                                    { task.task_bathroomcount } - {lang.bathrooms}
                                  </div>
                                </div>
                                <div className="summary_taskdetail_container1">
                                  <div className="summary_taskdetail_txt">
                                    {lang.taskers_needed}
                                  </div>
                                  <div className="summary_taskdetail_txt greentext">
                                    { task.task_numberoftasker } - {lang.taskers_needed}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="tasksummary_bar"/>
  
                              <div className="taskdesctxt">
                                {lang.additional_cleaning_options}
                              </div>
  
                              <div className="cleaningoption">
                                {
                                  render_additional_cleaning_options
                                }
                              </div>
                              
                            </div>
                        }
                        
                        {
                          task.task_category === 4 &&
                            <div>
                              
                              <div className="tasksummary_bar"/>
                              
                              <div className="summary_taskdetail_container">
                                <div className="summary_taskdetail_container1">
                                  <div className="summary_taskdetail_txt">
                                    {lang.taskers_needed}
                                  </div>
                                  <div className="summary_taskdetail_txt greentext">
                                    { task.task_numberoftasker } - {lang.taskers_needed}
                                  </div>
                                </div>
                                <div className="summary_taskdetail_container1">
                                  <div className="summary_taskdetail_txt">
                                    {lang.distance}
                                  </div>
                                  <div className="summary_taskdetail_txt greentext">
                                    15 KILOMETERS
                                  </div>
                                </div>
                              </div>
                              
                              <div className="summary_taskdetail_container">
                                <div className="summary_taskdetail_container1">
                                  <div className="summary_taskdetail_txt">
                                    {lang.from_locations}
                                  </div>
                                  <div className="summary_taskdetail_txt greentext">
                                    { task.task_from_location_zip }
                                  </div>
                                </div>
                                <div className="summary_taskdetail_container1">
                                  <div className="summary_taskdetail_txt">
                                    {lang.to_location}
                                  </div>
                                  <div className="summary_taskdetail_txt greentext">
                                    { task.task_to_location_zip }
                                  </div>
                                </div>
                              </div>
  
                              <div className="tasksummary_bar"/>
                              
                            </div>
                        }
  
                        {
                          (task.task_category !== 1 && task.task_category !== 4) &&
                            <div className="summary_taskdetail_container">
                              <div className="summary_taskdetail_container1">
                                <div className="summary_taskdetail_txt">
                                  {lang.taskers_needed}
                                </div>
                                <div className="summary_taskdetail_txt greentext">
                                  { task.task_numberoftasker } - {lang.taskers_needed}
                                </div>
                              </div>
                              <div className="summary_taskdetail_container1">
                                <div className="summary_taskdetail_txt">
                                  {lang.task_type}
                                </div>
                                <div className="summary_taskdetail_txt">
                                  {lang.task} { task.task_type === 0 ? lang.is_not : lang.is } {lang.in_specific_location}
                                </div>
                              </div>
                            </div>
                        }
                        
  
                        <div className="taskdesctxt2">
                          {lang.attachments}
                        </div>
                        
                        <div className="summary_attachcontainer">
                          {
                            render_attachments
                          }
                        </div>
                        
                      </div>
                    </div>
  
                    {
                      this.state.isPoster === '1' &&
                        <div className="summary_leftline3">
                          <div className="canceltaskbtn" onClick={this.showCancelTaskModal}>{lang.cancel_the_task}</div>
                        </div>
                    }
                    
                    {
                      this.state.isPoster === '1' &&
                        <div className="summary_leftline3">
                          <div className="edittaskbtn">{lang.edit_the_task}</div>
                        </div>
                    }
  
                    {
                      (this.state.isPoster === '0' && to_me) &&
                        <div className="summary_leftline3" onClick={this.withdrawTask}>
                          <div className="withdrawbtn">{lang.withdraw_from_task}</div>
                        </div>
                    }
                    
                  </div>
                  {
                    pageState === 0 &&
                      <div className="summary_top_2_mediumbar"/>
                  }
                  {
                    pageState === 0 ?
                      <div className="summary_top_2_rightside">
                        <div className="summary_mapside_toptext">{lang.task_location}</div>
                        <div className="summary_mapside_top">
                          <div className="summary_mapicon"/>
                          <div className="summary_map_location">{ task.task_category === 4 ? task.task_from_location : task.task_location === '' ? 'No Task' : task.task_location}</div>
                          {
                            task.task_category === 4 ? <div className="summary_map_indicator"/> : task.task_location === '' ? null : <div className="summary_map_indicator"/>
                          }
                        </div>
                        <div className="summary_mapside_map1">
                          <StyledMapWithAnInfoBox task={task}/>
                        </div>
                      </div>
                      :
                      <div className="summary_top_2_rightside">
                        <div className="allofferscontainer1">
                          <div className="summary_mapside_toptext">All Offers</div>
                          <div className="summary_mapside_toptext1 graytext">{lang.total1} {offer_users.length} {offer_users.length === 1 ? lang.offer_lowercase : lang.offers_lowercase} {lang.received}</div>
                          <div className="closeImg" onClick={this.onCloseOffers}/>
                        </div>
                        <div className="listcontainer">
                          <ReactList
                            itemRenderer={this.renderItem}
                            length={offer_users.length}
                          />
                        </div>
                      </div>
                  }
                </div>
              </div>
            </div>
        }
  
        <Modal show={showImageSlider} onHide={this.closeImageSlider}>
          <Modal.Header closeButton>
            <Modal.Title>
              <div>{lang.attachments}</div>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <Swiper
                {...this.params}
              >
                {
                  render_popup_attachs
                }
              </Swiper>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.closeImageSlider}>{lang.close}</Button>
          </Modal.Footer>
        </Modal>
  
  
        <Modal
          show={offerModalShow}
          onHide={this.hideOfferModal}
          bsSize="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <div className="modalheader">{lang.assigning_the_task}</div>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {
              task._id !== undefined &&
                <div className="summary-dlg-container">
                  <div className="makeoffer-dlg-top1">
              
                    <div className="makeoffer-dlg-top1-avatarcontainer">
                      <div className="exp_categoryiconcontainer1">
                        <div className="exp_categoryicon">
                          <div className={categoryClassName}/>
                        </div>
                      </div>
                    </div>
              
                    <div className="summary-dlg-top1-descontainer">
                      <div>{ this.categoryLists[task.task_category - 1] } - { task.task_title }</div>
                      <div className="makeoffer-dlg-top1-desc1">
                        <div className="clockimage"/>
                        <div className="postedtext">{lang.posted_uppercase} : </div>
                        <div className="difftext">{ dur }</div>
                      </div>
                    </div>
              
                    <div className="makeoffer-dlg-top1-budgetcontainer">
                      <div className="offercount11">
                        ${ task.task_budget }
                      </div>
                
                      <div className="offercount21">
                        {lang.budget}
                      </div>
                    </div>
            
                  </div>
            
                  <div className="summary-dlg-top1-bar"/>
                  
                  <div className="summary-dlg-top2">
                    <div className="summary-dlg-top2-leftside">
                      <div>{lang.task_assigned_to}</div>
                      <div className="summary-dlg-top2-leftside-top1">
                        <div className="summary-dlg-top2-leftside-top1-avatar">
                          {
                            this.imagePreviewUrl === '' ? <div className="modal-avatar-no"/> : <img src={this.imagePreviewUrl} className="modal-avatar"/>
                          }
                        </div>
                        <div className="summary-dlg-top2-leftside-top1-text">
                          <div className="offerlist_section1_mediumside_txt1">{ this.offer_username }</div>
                          <div className="offerlist_starcontainer">
                            <div className="offerlist_star"/>
                            <div className="offerlist_star"/>
                            <div className="offerlist_star"/>
                            <div className="offerlist_star"/>
                            <div className="offerlist_star"/>
                            <div className="offerlist_section1_mediumside_txt1 greentext margin-left-5px">4.5/5</div>
                          </div>
                          <div className="offerlist_section1_mediumside_txt1">{lang.task_completion_rate}: 4.5/5</div>
                          <div className="offerlist_section1_mediumside_txt1">{lang.location}: Montreal</div>
                          <div className="offer_message" onClick={() => { this.setState({ redirect: 1221 }) }}>
                            <div className="msgimg"/>
                            <div className="msgtxt">{lang.message}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="summary-dlg-top2-rightside">
                      <div className="offerfromtext">{lang.offer_from_tasker}</div>
                      <div className="summary-dlg-top2-rightside-txt1 margintop10">
                        <div className="summary-dlg-top2-rightside-txt2">
                          {lang.hi_i_am_available}
                        </div>
                        <div className="summary-dlg-top2-rightside-txt2">
                          <div className="righttext">{ this.offer_dur }</div>
                          <div className="clockImg"/>
                        </div>
                      </div>
                      <div className="paddingright15 margintop10">{ this.offer_desc }</div>
                      
                      <div className="summary-dlg-top2-rightside-txt1 margintop20">
                        <div className="summary-dlg-top2-rightside-txt2 bigtext">
                          {lang.offer_amount}:
                        </div>
                        <div className="summary-dlg-top2-rightside-txt2">
                          <div className="righttext bigtext">${ this.offer_amount }</div>
                        </div>
                      </div>
                      <div className="summary-dlg-top2-rightside-txt1 margintop5">
                        <div className="summary-dlg-top2-rightside-txt2 bigtext">
                          {lang.transaction_fee}:
                        </div>
                        <div className="summary-dlg-top2-rightside-txt2">
                          <div className="righttext bigtext">$1.50</div>
                        </div>
                      </div>
                      <div className="summary-dlg-top2-rightside-txt-bar margintop5"/>
                      <div className="summary-dlg-top2-rightside-txt1 margintop5">
                        <div className="summary-dlg-top2-rightside-txt2 bigtext redtext">
                          {lang.total_fee_amount}:
                        </div>
                        <div className="summary-dlg-top2-rightside-txt2">
                          <div className="righttext bigtext redtext">${ this.offer_amount }</div>
                        </div>
                      </div>
                      
                    </div>
                  </div>
                  
                  <div className="summary_acceptoffermodal_info">
                    {lang.accept_offer_info_description_1} <a className="redtext" href="#">{lang.accept_offer_info_description_2}</a>
                  </div>
                  
                  <div className="assignbtn" onClick={() => {
                    this.requests.assignTask()
                  }}>
                    {lang.assign_and_review_funds}
                  </div>
                  
                </div>
            }
    
    
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.hideOfferModal}>{lang.close}</Button>
          </Modal.Footer>
        </Modal>
  
  
  
  
        <Modal
          show={offerAssigned}
          onHide={this.hideOfferAssigned}
          bsSize="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <div className="assignedheader_container">
                <div className="assignedheader_checkon"/>
                <div className="assignedheader_txt">
                  {lang.task_successfully_assigned}!
                </div>
              </div>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {
              task._id !== undefined &&
              <div className="summary-dlg-container">
                <div className="makeoffer-dlg-top1">
            
                  <div className="makeoffer-dlg-top1-avatarcontainer">
                    <div className="exp_categoryiconcontainer1">
                      <div className="exp_categoryicon">
                        <div className={categoryClassName}/>
                      </div>
                    </div>
                  </div>
            
                  <div className="summary-dlg-top1-descontainer">
                    <div>{ this.categoryLists[task.task_category - 1] } - { task.task_title }</div>
                    <div className="makeoffer-dlg-top1-desc1">
                      <div className="clockimage"/>
                      <div className="postedtext">{lang.posted_uppercase} : </div>
                      <div className="difftext">{ dur }</div>
                    </div>
                  </div>
            
                  <div className="makeoffer-dlg-top1-budgetcontainer">
                    <div className="offercount11">
                      ${ task.task_budget }
                    </div>
              
                    <div className="offercount21">
                      {lang.budget}
                    </div>
                  </div>
          
                </div>
          
                <div className="summary-dlg-top1-bar"/>
          
                <div className="summary-dlg-top2">
                  <div className="summary-dlg-top2-leftside">
                    <div>{lang.task_assigned_to}</div>
                    <div className="summary-dlg-top2-leftside-top1">
                      <div className="summary-dlg-top2-leftside-top1-avatar">
                        {
                          this.imagePreviewUrl === '' ? <div className="modal-avatar-no"/> : <img src={this.imagePreviewUrl} className="modal-avatar"/>
                        }
                      </div>
                      <div className="summary-dlg-top2-leftside-top1-text">
                        <div className="offerlist_section1_mediumside_txt1">{ this.offer_username }</div>
                        <div className="offerlist_starcontainer">
                          <div className="offerlist_star"/>
                          <div className="offerlist_star"/>
                          <div className="offerlist_star"/>
                          <div className="offerlist_star"/>
                          <div className="offerlist_star"/>
                          <div className="offerlist_section1_mediumside_txt1 greentext margin-left-5px">4.5/5</div>
                        </div>
                        <div className="offerlist_section1_mediumside_txt1">{lang.task_completion_rate}: 4.5/5</div>
                        <div className="offerlist_section1_mediumside_txt1">{lang.location}: Montreal</div>
                      </div>
                    </div>
                  </div>
                  <div className="summary-dlg-top2-rightside_withoutborder">
                    <div className="offerfromtext agreedamount">{lang.agreed_amount}: ${ this.offer_amount }</div>
                    <div className="assign_msg" onClick={() => {
                      this.hideOfferAssigned();
                      this.setState({ redirect: 1221 });
                    }}>
                      <div className="messagetxt">
                        {lang.message}
                      </div>
                      <div className="messageicon"/>
                    </div>
                  </div>
                </div>
              </div>
            }
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.hideOfferAssigned}>{lang.close}</Button>
          </Modal.Footer>
        </Modal>
  
        {/* cancel task modal */}
        <Modal
          show={cancelTask}
          onHide={this.hideCancelTaskModal}
          bsSize="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <div className="assignedheader_container">
                <div className="assignedheader_alarm"/>
                <div className="assignedheader_txt">
                  {
                    this.isWithdraw ? lang.are_you_sure_withdraw_from_task : lang.are_you_sure_want_cancel_task
                  }
                </div>
              </div>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {
              task._id !== undefined &&
              <div className="summary-dlg-container">
                <div className="makeoffer-dlg-top1">
            
                  <div className="makeoffer-dlg-top1-avatarcontainer">
                    <div className="exp_categoryiconcontainer1">
                      <div className="exp_categoryicon">
                        <div className={categoryClassName}/>
                      </div>
                    </div>
                  </div>
            
                  <div className="summary-dlg-top1-descontainer">
                    <div>{ this.categoryLists[task.task_category - 1] } - { task.task_title }</div>
                    <div className="makeoffer-dlg-top1-desc1">
                      <div className="clockimage"/>
                      <div className="postedtext">{lang.posted_uppercase} : </div>
                      <div className="difftext">{ dur }</div>
                    </div>
                  </div>
            
                  <div className="makeoffer-dlg-top1-budgetcontainer">
                    <div className="offercount11">
                      ${ task.task_budget }
                    </div>
              
                    <div className="offercount21">
                      {lang.budget}
                    </div>
                  </div>

                </div>
                
                <div className="canceltask-dlg-top1-desc2">
                  {
                    task.user_avatar === '' ? <div className="avatarimage1"/> : <img src={task.user_avatar} className="avatarimage2"/>
                  }
                  <div className="postername">{task.user_postername} { this.isWithdraw ? "( " + lang.poster + " )" : "( " + lang.you1 + " )" }</div>
                </div>
          
                <div className="summary-dlg-top1-bar"/>
  
                {
                  task.task_state === 2 ?
                    <div className="summary-dlg-top3_assigned">
                      {
                        !this.isWithdraw &&
                          <div className="cancelthetaskbtn_txt redtext">{lang.note__}</div>
                      }
  
                      {
                        !this.isWithdraw &&
                          <div className="cancelthetaskbtn_txt1">{lang.an_amount_of}</div>
                      }
  
                      {
                        !this.isWithdraw &&
                          <div className="cancelthetaskbtn_txt1 redtext">$5.00</div>
                      }
  
                      {
                        !this.isWithdraw &&
                          <div className="cancelthetaskbtn_txt1">{lang.applies_for_the_cancellation__}</div>
                      }
                      
                      {
                        this.isWithdraw &&
                          <div>
                            <div className="cancelthetaskbtn_txt2">{lang.we_suggest_that_you_communicate_the_poster__}</div>
                            <div className="cancelthetaskbtn_txt2 redtext">{lang.warning_this_action_may_will_affect__}</div>
                          </div>
                      }
                      {
                        this.isWithdraw ?
                          <div className="cancelthetaskbtn" onClick={() => { this.requests.withdrawFromTask(); }}>{lang.yes_withdraw_from_task}</div>
                          :
                          <div className="cancelthetaskbtn" onClick={() => { this.requests.cancelTask(); }}>{lang.yes_cancel_the_task}</div>
                      }
                      
                    </div>
                    :
                    <div className="summary-dlg-top3">
                      <div className="cancelthetaskbtn_assigned" onClick={() => { this.requests.cancelTask(); }}>{lang.yes_cancel_the_task}</div>
                    </div>
                }
                
          
              </div>
            }
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.hideCancelTaskModal}>{lang.close}</Button>
          </Modal.Footer>
        </Modal>
  
  
        <Modal
          show={tasker_update_or_create_offer}
          onHide={this.hideNewOfferModal}
          bsSize="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <div>{ offer_modal_type === 0 ? lang.make_your_offer + "!" : lang.modify_your_offer + "!" }</div>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {
              task.offerarray !== undefined &&
              <div className="makeoffer-dlg-container">
                <div className="makeoffer-dlg-top1">
            
                  <div className="makeoffer-dlg-top1-avatarcontainer">
                    <div className="exp_categoryiconcontainer1">
                      <div className="exp_categoryicon">
                        <div className={categoryClassName}/>
                      </div>
                    </div>
                  </div>
            
                  <div className="makeoffer-dlg-top1-descontainer">
                    <div>{ this.categoryLists[task.task_category - 1] } - { task.task_title }</div>
                    <div className="makeoffer-dlg-top1-desc1">
                      <div className="clockimage"/>
                      <div className="postedtext">{lang.posted_uppercase} : </div>
                      <div className="difftext">{ modal_duration }</div>
                    </div>
                    <div className="makeoffer-dlg-top1-desc2">
                      {
                        task.user_avatar === '' ? <div className="avatarimage1"/> : <img src={task.user_avatar} className="avatarimage2"/>
                      }
                      <div className="postername">{task.user_postername} ( {lang.poster} )</div>
                      <div className="message">
                        <div className="msgimg"/>
                        <div className="msgtxt">{lang.message}</div>
                      </div>
                      {
                        offer_modal_type !== 0 &&
                        <div className="postername">{lang.previous_offer_amount} : ${prev_offer_amount}</div>
                      }
              
                    </div>
                  </div>
            
                  <div className="makeoffer-dlg-top1-budgetcontainer">
                    <div className="offercount11">
                      ${ task.task_budget }
                    </div>
              
                    <div className="offercount21">
                      {lang.budget}
                    </div>
                  </div>
          
                </div>
          
                <div className="makeoffer-dlg-top1-bar"/>
          
                <div className="makeoffer-dlg-top2">
                  <div className="makeoffer-dlg-top1-avatarcontainer"/>
            
                  <div className="makeoffer-dlg-top1-descontainer11">
                    <div className="emaountleftside">
                      <div>{lang.enter_offer_amount}</div>
                      <input
                        className="form-control enteramountinput"
                        ref={ref => (this._input_amount = ref)}
                        onChange={this.onChangeAmount}
                        value={amounttext}
                      />
                      <div className="youroffercontainer">
                        <div className="youroffer">{lang.your_offer}</div>
                        <div className="yourofferval">${amounttext}</div>
                      </div>
                      <div className="youroffercontainer">
                        <div className="youroffer">{lang.taxes}</div>
                        <div className="yourofferval">${taxamount}</div>
                      </div>
                      <div className="youroffercontainer">
                        <div className="youroffer">{lang.total1}</div>
                        <div className="yourofferval">${totalamount}</div>
                      </div>
                      <div className="youroffercontainer">
                        <div className="youroffer">{lang.commission}</div>
                        <div className="yourofferval">${commissionamount}</div>
                      </div>
                      <div className="yourofferbar"/>
                      <div className="youroffercontainer">
                        <div className="youroffer redtext">{lang.your_earning}</div>
                        <div className="yourofferval redtext">${taskerearning}</div>
                      </div>
                    </div>
                    <div className="spacemediumside">
                    </div>
                    <div className="descrightside">
                      <div className="flexview">
                        <div className="youroffer">{lang.description}</div>
                        <div className="yourofferval exgraytext">{lang.up_to_500_characters}</div>
                      </div>
                      <textarea
                        className="form-control descarea"
                        ref={ref => (this._input_desc = ref)}
                      />
                      <div>
                        <div className="submitbtn" onClick={() => { this.submitMakeOffer(task._id, offer_modal_type); }}>
                          { offer_modal_type === 0 ? lang.make_offer : lang.update_offer }
                        </div>
                      </div>
                    </div>
                  </div>
          
                </div>
        
              </div>
            }
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.hideNewOfferModal}>{lang.close}</Button>
          </Modal.Footer>
        </Modal>
        
        
        
      </div>
    )
  }
}

TaskSummary.propTypes = {
  updateHeader: PropTypes.func.isRequired
};
