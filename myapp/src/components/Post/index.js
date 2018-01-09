import React, { PropTypes } from 'react';
import { Animated } from "react-animated-css";
import Autocomplete from 'react-google-autocomplete';
import { DateRange } from 'react-date-range';
import config from "./../../config";
import {eng, fre} from "../../lang";
import moment from 'moment';
import { reactLocalStorage } from 'reactjs-localstorage';
import DatePicker from 'react-datepicker';
import Swiper from 'react-id-swiper';
import {
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps";
import {geolocated} from 'react-geolocated';
import { Modal, Button } from 'react-bootstrap';
import PlacesAutocomplete, { geocodeByPlaceId } from 'react-places-autocomplete';
import ToggleButton from 'react-toggle-button'
import "./styles.css";

const base_url_public = config.baseUrl;
import Promise from 'promise';
import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';
let superagent = superagentPromise(_superagent, Promise);

const MapWithAMarker = withGoogleMap(props =>
  <GoogleMap
    defaultZoom={9}
    defaultCenter={{ lat: props.lat, lng: props.lng }}
  >
    <Marker
      position={{ lat: props.lat, lng: props.lng }}
    />
  </GoogleMap>
);

export default class Post extends React.Component {
  
  constructor() {
    super();
    this.state = {
      lang: eng,
      selectIndex: 0,
      step: 0,
      step1_blank: false,
      step2_blank: false,
      step3_blank: false,
      step2_checked: 0,
      hourly_checked: 0,
      address: "",
      city: "",
      zipcode: "",
      taskercount: 1,
      amountError: false,
      lat: 0,
      lng: 0,
      placeId: '',
      reloadGPS: false,
      task_info: [],
      editing: false,
      deadline: moment(),
      post_title: "",
      post_desc: "",
      post_title_bad: false,
      post_desc_bad: false,
      estimated_budget: 0,
      num_of_hour: 0,
      rate: 0,
      fixed_price: 0,
      personal_datas: [],
      attachments: [],
      showImageSlider: false,
      cleaning_toggle1: false,
      cleaning_toggle2: false,
      cleaning_option1: false,
      cleaning_option2: false,
      cleaning_option3: false,
      cleaning_option4: false,
      cleaning_option5: false,
      bedroomcount: 1,
      bathroomcount: 1,
      settingInfos: [],
      fromLocation: '',
      fromLocation_zip: '',
      fromLocation_lat: 0,
      fromLocation_lng: 0,
      toLocation: '',
      toLocation_zip: '',
      toLocation_lat: 0,
      toLocation_lng: 0
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
    this.uploadValue = {
      post_title: "",
      description: "",
      location: "",
      timeline1: 0,
      timeline2: 0,
      budget: 0,
    };
    this.params = {
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      },
    };
    this.requests = {
      fetchSettingInfos: () =>
        superagent.get(base_url_public + '/settings/retrieveinfos', {}).then(res => {
          if (!res.body.result) {
            this.setState({ showAlert: true, alertText: res.body.text })
          } else {
            this.setState({ settingInfos: res.body.settings });
          }
        }),
      fetchDatas: () =>
        superagent.post(base_url_public + '/frontend/user/fetchpersonalinfos', { token: reactLocalStorage.get('loggedToken') }).then(res => {
          if (!res.body.result) {
            this.setState({ showAlert: true, alertText: res.body.text })
          } else {
            this.setState({ personal_datas: res.body.personal_datas })
          }
        }),
      createTask: () => superagent.post(base_url_public + '/frontend/task/create', {
        user_token: reactLocalStorage.get('loggedToken'),
        user_avatar: this.state.personal_datas.imagePreviewUrl,
        user_postername: this.state.personal_datas.username,
        user_posteremail: this.state.personal_datas.email,
        task_category: this.state.selectIndex,
        task_title: this.uploadValue.post_title,
        task_description: this.uploadValue.description,
        task_type: this.state.step2_checked,
        task_location: this.state.address,
        task_location_city: this.state.city,
        task_location_lat: this.state.lat,
        task_location_lng: this.state.lng,
        task_budget: this.uploadValue.budget,
        task_numberoftasker: this.state.taskercount,
        task_attachments: this.state.attachments,
        task_deadline: this.state.deadline,
        task_postline: moment(),
        task_updateline: moment(),
  
        task_is_endleasing: this.state.cleaning_toggle1,
        task_house_or_apartment: this.state.cleaning_toggle2,
        task_cleaning_option1: this.state.cleaning_option1,
        task_cleaning_option2: this.state.cleaning_option2,
        task_cleaning_option3: this.state.cleaning_option3,
        task_cleaning_option4: this.state.cleaning_option4,
        task_cleaning_option5: this.state.cleaning_option5,
        task_bedroomcount: this.state.bedroomcount,
        task_bathroomcount: this.state.bathroomcount,
  
        task_from_location: this.state.fromLocation,
        task_from_location_zip: this.state.fromLocation_zip,
        task_from_location_lat: this.state.fromLocation_lat,
        task_from_location_lng: this.state.fromLocation_lng,
  
        task_to_location: this.state.toLocation,
        task_to_location_zip: this.state.toLocation_zip,
        task_to_location_lat: this.state.toLocation_lat,
        task_to_location_lng: this.state.toLocation_lng,
  
        task_status: 1,   // 1: Active, 2: Closed, 3: SPAM, 4: Cancelled, 5: Expired (once due date is reached)
        task_state: 1,    // 1: Posted, 2: Assigned, 3: Completed, 4: Cancelled, 5: Started
        
      }).then(res => {
        if (!res.body.result) {
          this.setState({ showAlert: true, alertText: res.body.text })
        } else {
          this.setState({ amountError: false, task_info: res.body.task_info, step2_blank: false, step3_blank: false, step: 4, editing: false, reloadGPS: true }, () => {
            this.setState({ reloadGPS: false })
          })
        }
      }),
      removeTask: (task_id) => superagent.post(base_url_public + '/frontend/task/remove', {
        task_id: task_id
      }).then(res => {
        if (!res.body.result) {
          this.setState({ showAlert: true, alertText: res.body.text })
        } else {
          this.setState({ selectIndex: 0, amountError: false, step2_blank: false, step3_blank: false, step: 0 })
        }
      }),
      editTask: (task_id) => superagent.post(base_url_public + '/frontend/task/edit', {
        task_id: task_id,
        task_category: this.state.selectIndex,
        task_title: this.state.post_title,
        task_description: this.state.post_desc,
        task_type: this.state.step2_checked,
        task_location: this.state.address,
        task_location_city: this.state.city,
        task_location_lat: this.state.lat,
        task_location_lng: this.state.lng,
        task_budget: this.uploadValue.budget,
        task_numberoftasker: this.state.taskercount,
        task_attachments: this.state.attachments,
        task_deadline: this.state.deadline,
        task_updateline: moment(),
  
        task_from_location: this.state.fromLocation,
        task_from_location_zip: this.state.fromLocation_zip,
        task_from_location_lat: this.state.fromLocation_lat,
        task_from_location_lng: this.state.fromLocation_lng,
        
        task_to_location: this.state.toLocation,
        task_to_location_zip: this.state.toLocation_zip,
        task_to_location_lat: this.state.toLocation_lat,
        task_to_location_lng: this.state.toLocation_lng,
        
      }).then(res => {
        if (!res.body.result) {
          this.setState({ showAlert: true, alertText: res.body.text })
        } else {
          this.setState({ amountError: false, task_info: res.body.task_info, step2_blank: false, step3_blank: false, step: 4, editing: false, reloadGPS: true }, () => {
            this.setState({ reloadGPS: false })
          })
        }
      }),
    }
  }
  
  componentDidMount() {
    this.requests.fetchDatas();
    this.requests.fetchSettingInfos();
    setTimeout(() => {
      if (reactLocalStorage.get("sign_state") === "false") {
        this.props.updateHeader(1);
      } else {
        this.props.updateHeader(2);
      }
    }, 100);

  }
  
  update = () => {
    this.setState({ selectIndex: 0, amountError: false, step2_blank: false, step3_blank: false, step: 0 })
  };
  
  selectCategory = i => {
    this.setState({ selectIndex: i, step: 1, attachments: [], post_title: "", post_desc: "", cleaning_toggle1: false, cleaning_toggle2: false, cleaning_option1: false, cleaning_option2: false, cleaning_option3: false, cleaning_option4: false, cleaning_option5: false })
  };
  
  onCancel1 = () => {
    this.setState({ selectIndex: 0, step: 0 })
  };
  
  onCancel2 = () => {
    this.setState({ step: 1 })
  };
  
  onChangeNumHour = (text) => {
    if (text.nativeEvent.inputType === "deleteContentBackward") {
      this.setState({ num_of_hour: this._ref_hour.value })
    } else {
      if (this.checkDigits(text.nativeEvent.data)) {
        this.setState({ num_of_hour: this._ref_hour.value }, () => {
          this.calcEstimatedBudget()
        })
      }
    }
  };
  
  onChangeRate = (text) => {
    if (text.nativeEvent.inputType === "deleteContentBackward") {
      this.setState({ rate: this._ref_rate.value })
    } else {
      if (this.checkDigits(text.nativeEvent.data)) {
        this.setState({ rate: this._ref_rate.value }, () => {
          this.calcEstimatedBudget()
        })
      }
    }
  };
  
  onChangeFixedPrice = (text) => {
    if (text.nativeEvent.inputType === "deleteContentBackward") {
      this.setState({ fixed_price: this._ref_fixedamount.value })
    } else {
      if (this.checkDigits(text.nativeEvent.data)) {
        this.setState({ fixed_price: this._ref_fixedamount.value }, () => {
          this.calcEstimatedBudget()
        })
      }
    }
  };
  
  onNext1 = () => {
    if (this._ref_inputtitle.value.length < 10 || this._ref_inputdesc.value.length < 25) {
      if (this._ref_inputtitle.value.length < 10) {
        this.setState({ post_title_bad: true});
      } else {
        this.setState({ post_title_bad: false});
      }
      if (this._ref_inputdesc.value.length < 25) {
        this.setState({ post_desc_bad: true});
      } else {
        this.setState({ post_desc_bad: false});
      }
    } else {
      if (this._ref_inputtitle.value === "" || this._ref_inputdesc.value === "") {
        this.setState({ step1_blank: true, post_title_bad: false })
      } else {
        this.uploadValue.post_title = this._ref_inputtitle.value;
        this.uploadValue.description = this._ref_inputdesc.value;
        this.setState({ step1_blank: false, step2_blank: false, step3_blank: false, step: 2, post_title_bad: false, post_desc_bad: false })
      }
    }
  };
  
  onNext2 = () => {
    
    if (this.state.selectIndex === 4) { //moving
      if (this.state.fromLocation === '' || this.state.toLocation === '') {
        this.setState({ step2_blank: true })
      } else {
        this.setState({ step1_blank: false, step2_blank: false, step3_blank: false, step: 3 })
      }
    } else {
      if (this.state.step2_checked === 0) { //not moving
        this.uploadValue.timeline2 = this.state.deadline.diff(moment(), 'days');
        this.setState({ step1_blank: false, step2_blank: false, step3_blank: false, step: 3 })
      } else {
        if (this.state.address === "") {
          this.setState({ step2_blank: true })
        } else {
          // this.uploadValue.timeline1 = this.state.startDate.diff(moment(), 'days');
          this.uploadValue.timeline2 = this.state.deadline.diff(moment(), 'days');
          this.setState({ step1_blank: false, step2_blank: false, step3_blank: false, step: 3 })
        }
      }
    }
    
  };
  
  onNext3 = () => {
    let amount = 0;
    if (this.state.hourly_checked === 0) {
      amount = this.state.rate * this.state.num_of_hour * this.state.taskercount;
      // let amount = parseInt(this._ref_hour.value) * parseInt(this._ref_rate.value);
      // if (!this.checkDigits(this._ref_hour.value) || !this.checkDigits(this._ref_rate.value)) {
      //   this.setState({ amountError: true })
      // } else {
      //
      //   if (amount >= parseInt(this.state.personal_datas.min_amount) && parseInt(amount <= this.state.personal_datas.max_amount)) {
      //     this.uploadValue.budget_hourly = amount;
      //     if (this.state.editing) {
      //       this.requests.editTask(this.state.task_info._id)
      //     } else {
      //       this.requests.createTask()
      //     }
      //   } else {
      //     if (this.state.editing) {
      //       this.requests.editTask(this.state.task_info._id)
      //     } else {
      //       this.requests.createTask()
      //     }
      //   }
      // }
    } else {
      amount = this.state.fixed_price * this.state.taskercount;
    }
    
    // if (this.state.hourly_checked === 1) {
    //   if (!this.checkDigits(this._ref_fixedamount.value)) {
    //     this.setState({ amountError: true })
    //   } else {
    //     let amount = parseInt(this._ref_fixedamount.value);
    //     if (amount >= 10 && amount <= 500) {
    //       this.uploadValue.budget_fixed = amount;
    //       this.requests.createTask()
    //     } else {
    //       this.setState({ amountError: true })
    //     }
    //   }
    // }
    
    if (amount >= this.state.settingInfos.min_amount && amount <= this.state.settingInfos.max_amount) {
      this.uploadValue.budget = amount;
      if (this.state.editing) {
        this.requests.editTask(this.state.task_info._id)
      } else {
        this.requests.createTask()
      }
    } else {
      this.setState({ amountError: true })
    }
    
  };
  
  onCancel3 = () => {
    this.setState({ step: 2 })
  };
  
  onUpdateTaskType = i => {
    this.setState({ step2_checked: i })
  };
  
  onHourly = i => {
    this.setState({ hourly_checked: i, amountError: false }, () => {
      this.calcEstimatedBudget()
    })
  };
  
  onTaskerCountUp = () => {
    this.setState({ taskercount: this.state.taskercount + 1 }, () => {
      this.calcEstimatedBudget()
    });
  };
  
  onTaskerCountDown = () => {
    if (this.state.taskercount > 1) {
      this.setState({ taskercount: this.state.taskercount - 1 }, () => {
        this.calcEstimatedBudget()
      });
    }
  };
  
  onBedroomCountUp = () => {
    this.setState({ bedroomcount: this.state.bedroomcount + 1 });
  };
  onBedroomCountDown = () => {
    if (this.state.bedroomcount > 1) {
      this.setState({ bedroomcount: this.state.bedroomcount - 1 });
    }
  };
  
  onBathroomCountUp = () => {
    this.setState({ bathroomcount: this.state.bathroomcount + 1 });
  };
  onBathroomCountDown = () => {
    if (this.state.bathroomcount > 1) {
      this.setState({ bathroomcount: this.state.bathroomcount - 1 });
    }
  };
  
  calcEstimatedBudget = () => {
    let estimated_budget = 0;
    if (this.state.hourly_checked === 0) {
      if (this._ref_hour.value !== "" && this._ref_rate.value !== "") {
        estimated_budget = parseInt(this._ref_hour.value) * parseInt(this._ref_rate.value) * (this.state.taskercount)
      }
    } else {
      if (this._ref_fixedamount.value !== "") {
        estimated_budget = parseInt(this._ref_fixedamount.value) * (this.state.taskercount)
      }
    }
    this.setState({ estimated_budget })
  };
  
  checkDigits = (str) => {
    return /^\d+$/.test(str);
  };
  
  navigateCurrentLoc = () => {
    this.setState({ reloadGPS: true }, () => {
      this.setState({ reloadGPS: false })
    });
  };
  
  cancelTask = () => {
    this.requests.removeTask(this.state.task_info._id)
  };
  
  editTask = () => {
    this.setState({ editing: true, selectIndex: 0, step: 0 });
  };
  
  onChange = (address) => {
    this.setState({ address });
  };
  
  onChange_FROM = (address) => {
    this.setState({ fromLocation: address });
  };
  onChange_TO = (address) => {
    this.setState({ toLocation: address });
  };
  
  handleSelectAddress = (address, placeId) => {
    geocodeByPlaceId(placeId)
      .then(results => {
        let zipcode = results[0].address_components.filter(function (it) { return it.types.indexOf('postal_code') != -1;}).map(function (it) {return it.long_name;});
        let city = "";
        for (let i = 0; i < results[0].address_components.length; i++) {
          if (results[0].address_components[i].types[0] === "administrative_area_level_1") {
            city = results[0].address_components[i].long_name;
          }
        }
        this.setState({ address, city, placeId, zipcode, lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng() })
      })
      .catch(error => console.error(error));
  };
  
  handleSelectAddress_FROM = (address, placeId) => {
    geocodeByPlaceId(placeId)
      .then(results => {
        let zipcode = results[0].address_components.filter(function (it) { return it.types.indexOf('postal_code') != -1;}).map(function (it) {return it.long_name;});
        let city = "";
        for (let i = 0; i < results[0].address_components.length; i++) {
          if (results[0].address_components[i].types[0] === "administrative_area_level_1") {
            city = results[0].address_components[i].long_name;
          }
        }
        this.setState({ city, fromLocation: address, fromLocation_zip: zipcode, fromLocation_lat: results[0].geometry.location.lat(), fromLocation_lng: results[0].geometry.location.lng() })
      })
      .catch(error => console.error(error));
  };
  
  handleSelectAddress_TO = (address, placeId) => {
    geocodeByPlaceId(placeId)
      .then(results => {
        let zipcode = results[0].address_components.filter(function (it) { return it.types.indexOf('postal_code') != -1;}).map(function (it) {return it.long_name;});
        this.setState({ toLocation: address, toLocation_zip: zipcode, toLocation_lat: results[0].geometry.location.lat(), toLocation_lng: results[0].geometry.location.lng() })
      })
      .catch(error => console.error(error));
  };
  
  onDateChange = (date) => {
    this.setState({
      deadline: date
    });
  };
  
  onChangeTitle = (text) => {
    this.setState({ post_title: this._ref_inputtitle.value })
  };
  
  onChangeDesc = (text) => {
    this.setState({ post_desc: this._ref_inputdesc.value })
  };
  
  _handleSubmit = (e) => {
    e.preventDefault();
  };
  
  _handleImageChange = (e) => {
    e.preventDefault();
    
    let reader = new FileReader();
    let file = e.target.files[0];
    
    let data = new FormData();
    data.append('file', file);
    
    reader.onloadend = () => {
      if (file.size > 50 * 1024 * 1024) {
        this.setState({ showAlert: true, alertText: "This file is too big. Please upload another photo." })
      } else {
        let attachments = this.state.attachments;
        attachments.push(reader.result)
        this.setState({ attachments })
      }
    };
    reader.readAsDataURL(file)
  };
  
  onAddAttachments = () => {
    this.fileGhost.click()
  };
  
  closeAlert = () => {
    this.setState({ showImageSlider: false })
  };
  
  showImageSlider = () => {
    this.setState({ showImageSlider: true })
  };
  
  closeImageSlider= () => {
    this.closeAlert()
  };
  
  render() {
    const {
      lang,
      selectIndex,
      step,
      step1_blank,
      step2_checked,
      hourly_checked,
      step2_blank,
      deadline,
      taskercount,
      amountError,
      lat,
      lng,
      reloadGPS,
      task_info,
      editing,
      post_title,
      post_desc,
      post_title_bad,
      post_desc_bad,
      estimated_budget,
      num_of_hour,
      rate,
      fixed_price,
      personal_datas,
      attachments,
      showImageSlider,
      cleaning_toggle1,
      cleaning_toggle2,
      cleaning_option1,
      cleaning_option2,
      cleaning_option3,
      cleaning_option4,
      cleaning_option5,
      bedroomcount,
      bathroomcount,
      settingInfos
    } = this.state;
    const inputProps = {
      value: this.state.address,
      onChange: this.onChange,
    };
    const inputProps_from = {
      value: this.state.fromLocation,
      onChange: this.onChange_FROM,
    };
    const inputProps_to = {
      value: this.state.toLocation,
      onChange: this.onChange_TO,
    };
    const AutocompleteItem = ({ formattedSuggestion }) => (
      <div>
        <strong>{ formattedSuggestion.mainText }</strong>{' '}
        <small>{ formattedSuggestion.secondaryText }</small>
      </div>
    );
    let categoryClassName = "categoryicon" + task_info.task_category;
    
    let render_attachments = [];
    if (step === 1) {
      if (attachments.length === 0) {
        render_attachments.push(
          <div className="attachment_2"/>
        );
      } else if (attachments.length === 1) {
        render_attachments.push(
          <div className="attachment_2_withattach" onClick={this.showImageSlider}>
            <img className="attachment_2_withattach_img" src={attachments[0]}/>
          </div>
        );
      } else {
        render_attachments.push(
          <div className="attachment_1" onClick={this.showImageSlider}>
            <img className="attachment_2_withattach_img" src={attachments[0]}/>
          </div>
        );
        render_attachments.push(
          <div className="attachment_2" onClick={this.showImageSlider}>
            <div className="loadmoreimage"/>
            <div className="loadmorenum">+{attachments.length - 1}</div>
          </div>
        );
      }
    }
    
    let render_attachments_done = [];
    if (step === 4) {
      if (attachments.length === 0) {
        render_attachments_done.push(
          <div className="attachment_2_done"/>
        );
      } else if (attachments.length === 1) {
        render_attachments_done.push(
          <div className="attachment_2_withattach_done" onClick={this.showImageSlider}>
            <img className="attachment_2_withattach_img" src={attachments[0]}/>
          </div>
        );
      } else {
        render_attachments_done.push(
          <div className="attachment_1_done" onClick={this.showImageSlider}>
            <img className="attachment_2_withattach_img" src={attachments[0]}/>
          </div>
        );
        render_attachments_done.push(
          <div className="attachment_2_done" onClick={this.showImageSlider}>
            <div className="loadmoreimage"/>
            <div className="loadmorenum">+{attachments.length - 1}</div>
          </div>
        );
      }
    }
    
    let render_popup_attachs = [];
    if (step === 1 || step === 4) {
      for (let i = 0; i < attachments.length; i++) {
        render_popup_attachs.push(
          <img className="post_image1" src={attachments[i]} />
        );
      }
    }
    
    let render_new_cleaningoptions = [];
    if (step === 4 && selectIndex === 1) {
      let x = [];
      let y = [];
      if (cleaning_option1) {
        x.push("Laundry");
        y.push("1");
      }
      if (cleaning_option2) {
        x.push("Oven");
        y.push("2");
      }
      if (cleaning_option3) {
        x.push("Cabinet");
        y.push("3");
      }
      if (cleaning_option4) {
        x.push("Carpet");
        y.push("4");
      }
      if (cleaning_option5) {
        x.push("Windows");
        y.push("5");
      }
      for (let i = 0; i < x.length; i++) {
        let classkey = "cleaning_option_item_new" + (i + 1);
        let imgkey = "cleaning_option_item_img" + y[i] + "_checked";
        let titlekey = "cleaning_option_item_title" + y[i];
        render_new_cleaningoptions.push(
          <div className={classkey}>
            <div className={imgkey}/>
            <div className={titlekey}>{x[i]}</div>
          </div>
        );
      }
    }
    
    return (
      <div>
        <div className="col-sm-12 centerContent">
          {
            selectIndex === 0 ?
              <div className="post_toptitle_center" >
                WHAT DO YOU NEED DONE?
              </div>
              :
              step === 4 ?
                <div className="post_toptitle_center" >
                  {lang.your_task_has_been_successfully_posted}!
                </div>
                :
                <div className="post_toptitle_left">
                  <div className="post_toptitle_1">{lang.categories}</div>
                  <div className="post_toptitle_1_leftmargin">{">"}</div>
                  <div className="post_toptitle_1_leftmargin">{this.categoryLists[selectIndex - 1]}</div>
                  <div className="post_toptitle_1_leftmargin">{">"}</div>
                  <div className="post_toptitle_1_leftmargin">{lang.describe_your_task}</div>
                </div>
          }
          <div className="post_bar" />
        </div>
        {
          step === 0 &&
          <div className="col-sm-12 centerContent">
            
            <div className="post_item">
              <div className="post_item_1" onClick={() => { this.selectCategory(1); }}>
                <div className="post_item_1_image"/>
              </div>
              <div className="post_item_2">
                { this.categoryLists[0] }
              </div>
            </div>
            
            <div className="post_item">
              <div className="post_item_1" onClick={() => { this.selectCategory(2); }}>
                <div className="post_item_2_image"/>
              </div>
              <div className="post_item_2">
                { this.categoryLists[1] }
              </div>
            </div>
            
            <div className="post_item">
              <div className="post_item_1" onClick={() => { this.selectCategory(3); }}>
                <div className="post_item_3_image"/>
              </div>
              <div className="post_item_2">
                { this.categoryLists[2] }
              </div>
            </div>
            
            <div className="post_item">
              <div className="post_item_1" onClick={() => { this.selectCategory(4); }}>
                <div className="post_item_4_image"/>
              </div>
              <div className="post_item_2">
                { this.categoryLists[3] }
              </div>
            </div>
            
            <div className="post_item">
              <div className="post_item_1" onClick={() => { this.selectCategory(5); }}>
                <div className="post_item_5_image"/>
              </div>
              <div className="post_item_2">
                { this.categoryLists[4] }
              </div>
            </div>
            
            <div className="post_item">
              <div className="post_item_1" onClick={() => { this.selectCategory(6); }}>
                <div className="post_item_6_image"/>
              </div>
              <div className="post_item_2">
                { this.categoryLists[5] }
              </div>
            </div>
            
            <div className="post_item">
              <div className="post_item_1" onClick={() => { this.selectCategory(7); }}>
                <div className="post_item_7_image"/>
              </div>
              <div className="post_item_2">
                { this.categoryLists[6] }
              </div>
            </div>
            
            <div className="post_item">
              <div className="post_item_1" onClick={() => { this.selectCategory(8); }}>
                <div className="post_item_8_image"/>
              </div>
              <div className="post_item_2">
                { this.categoryLists[7] }
              </div>
            </div>
            
            <div className="post_item">
              <div className="post_item_1" onClick={() => { this.selectCategory(9); }}>
                <div className="post_item_9_image"/>
              </div>
              <div className="post_item_2">
                { this.categoryLists[8] }
              </div>
            </div>
            
            <div className="post_item">
              <div className="post_item_1" onClick={() => { this.selectCategory(10); }}>
                <div className="post_item_10_image"/>
              </div>
              <div className="post_item_2">
                { this.categoryLists[9] }
              </div>
            </div>
          
          </div>
        }
        {
          step === 1 &&
          <div className="col-sm-12 centerContent">
            <div>
              {lang.step1_add_details}
            </div>
            <div className="post_toptitle_center">
              <div className="post_toptitle_center_bar_on"/>
              <div className="post_toptitle_center_bar_off"/>
              <div className="post_toptitle_center_bar_off"/>
            </div>
            
            <div className="post_toptitle_center">
              <div className="post_title">{lang.post_title}</div>
            </div>
            <div className="post_toptitle_center">
              <input
                className="form-control post_title_input"
                ref={ref => {this._ref_inputtitle = ref}}
                onChange={this.onChangeTitle}
                value={post_title}
              />
            </div>
            {
              post_title_bad &&
              <Animated animationIn="shake" animationOut="fadeOut" isVisible={true}>
                <div className="post_toptitle_center">
                  <div className="post_title_withoutmargin">{lang.minimum_10_chars_required}</div>
                </div>
              </Animated>
            }
            
            <div className="post_toptitle_center">
              <div className="post_title">{lang.description}</div>
            </div>
            <div className="post_toptitle_center">
                <textarea
                  className="form-control post_title_input"
                  ref={ref => {this._ref_inputdesc = ref}}
                  onChange={this.onChangeDesc}
                  value={post_desc}
                />
            </div>
            {
              post_desc_bad &&
              <Animated animationIn="shake" animationOut="fadeOut" isVisible={true}>
                <div className="post_toptitle_center">
                  <div className="post_title_withoutmargin">{lang.minimum_25_chars_required}</div>
                </div>
              </Animated>
            }
            
            <div className="post_toptitle_center_big">
              <div className="attach_inside_container">
                <div className="attachment" onClick={this.onAddAttachments}>{lang.add_attachments}</div>
                {
                  render_attachments
                }
              </div>
            </div>
            <div className="post_toptitle_center">
              <div className="post_bar1"/>
            </div>
            {
              step1_blank &&
              <div className="post_toptitle_center">
                <Animated animationIn="shake" animationOut="fadeOut" isVisible={true}>
                  <div className="margintop redText">{lang.please_fill_in_the_blanks}</div>
                </Animated>
              </div>
            }
            <div className="post_toptitle_center_withpadding">
              <div className="button1" onClick={this.onCancel1}>{lang.cancel1}</div>
              <div className="button2" onClick={this.onNext1}>{lang.next1}</div>
            </div>
          </div>
        }
        {
          step === 2 &&
          <div className="col-sm-12 centerContent">
            <div className="post_toptitle_center">
              <div>
                {lang.step2_add_location}
              </div>
            </div>
            <div className="post_toptitle_center">
              <div className="post_toptitle_center_bar_on"/>
              <div className="post_toptitle_center_bar_on"/>
              <div className="post_toptitle_center_bar_off"/>
            </div>
            
            {
              selectIndex === 1 &&
              <div className="post_toptitle_center">
                <div className="post_title">
                  <div className="cleaning_toggle_title">
                    {lang.is_this_end_of_lease_cleaning}
                  </div>
                  <div className="cleaning_toggle">
                    <div className="cleaning_toggle_x1">
                      <ToggleButton
                        value={ cleaning_toggle1 }
                        onToggle={(value) => {
                          this.setState({
                            cleaning_toggle1: !cleaning_toggle1,
                          })
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            }
            {
              selectIndex === 1 &&
              <div className="post_toptitle_center">
                <div className="post_title">
                  <div className="cleaning_toggle_pt_image"/>
                  <div className="cleaning_toggle_pt_title">
                    {lang.property_type}
                  </div>
                  {
                    cleaning_toggle2 ? <div className="cleaning_toggle_pt_img1_off" onClick={() => {this.setState({cleaning_toggle2: false})}}/> : <div className="cleaning_toggle_pt_img1_on" onClick={() => {this.setState({cleaning_toggle2: false})}}/>
                  }
                  <div className="cleaning_toggle_pt_img1_title">
                    {lang.house}
                  </div>
                  {
                    cleaning_toggle2 ? <div className="cleaning_toggle_pt_img2_on" onClick={() => {this.setState({cleaning_toggle2: true})}}/> : <div className="cleaning_toggle_pt_img2_off" onClick={() => {this.setState({cleaning_toggle2: true})}}/>
                  }
                  <div className="cleaning_toggle_pt_img2_title">
                    {lang.apartment}
                  </div>
                </div>
              </div>
            }
            
            <div className="post_toptitle_center">
              <div className="post_title">{lang.task_type}</div>
            </div>
            <div className="post_toptitle_center">
              <label className="radio-inline marginview">
                <input type="radio" name="optradio" checked={ step2_checked === 0 } onClick={() => {this.onUpdateTaskType(0);}}/> {lang.virtual_task}
              </label>
              <label className="radio-inline marginview">
                <input type="radio" name="optradio" checked={ step2_checked === 1 } onClick={() => {this.onUpdateTaskType(1);}}/> {lang.task_is_in_spec_loc}
              </label>
            </div>
            
            {
              selectIndex === 4 ?
                <div>
                  <div className="post_toptitle_center">
                    <div className="post_title">{lang.from_locations}</div>
                  </div>
                  <div className="post_toptitle_center">
                    <div className="post_title_input">
                      <form>
                        <PlacesAutocomplete inputProps={inputProps_from} autocompleteItem={AutocompleteItem} onSelect={this.handleSelectAddress_FROM} />
                      </form>
                    </div>
                  </div>
                  
                  <div className="post_toptitle_center">
                    <div className="post_title">{lang.to_location}</div>
                  </div>
                  <div className="post_toptitle_center paddingbottom">
                    <div className="post_title_input">
                      <form>
                        <PlacesAutocomplete inputProps={inputProps_to} autocompleteItem={AutocompleteItem} onSelect={this.handleSelectAddress_TO} />
                      </form>
                    </div>
                  </div>
                </div>
                :
                <div>
                  <div className="post_toptitle_center">
                    <div className="post_title">{lang.add_deadline}</div>
                  </div>
                  <div className="post_toptitle_center">
                    <DatePicker
                      selected={this.state.deadline}
                      onChange={this.onDateChange}
                      className="post_datepicker"
                    />
                  </div>
                  
                  <div className="post_toptitle_center">
                    <div className="post_title">{lang.add_locations}</div>
                  </div>
                  <div className="post_toptitle_center paddingbottom">
                    <div className="post_title_input">
                      <form>
                        <PlacesAutocomplete inputProps={inputProps} autocompleteItem={AutocompleteItem} onSelect={this.handleSelectAddress} />
                      </form>
                    </div>
                  </div>
                </div>
            }
            
            
            
            
            <div className="post_toptitle_center">
              <div className="post_bar1"/>
            </div>
            {
              step2_blank &&
              <div className="post_toptitle_center">
                <Animated animationIn="shake" animationOut="fadeOut" isVisible={true}>
                  <div className="margintop redText">{lang.please_fill_in_the_blanks}</div>
                </Animated>
              </div>
            }
            <div className="post_toptitle_center_withpadding">
              <div className="button1" onClick={this.onCancel2}>{lang.back1}</div>
              <div className="button2" onClick={this.onNext2}>{lang.next1}</div>
            </div>
          </div>
        }
        {
          step === 3 &&
          <div className="col-sm-12 centerContent">
            <div className="post_toptitle_center">
              <div>
                {lang.step3_add_budget}
              </div>
            </div>
            <div className="post_toptitle_center">
              <div className="post_toptitle_center_bar_on"/>
              <div className="post_toptitle_center_bar_on"/>
              <div className="post_toptitle_center_bar_on"/>
            </div>
            
            <div className="post_toptitle_center margintop">
              <div className="post_title">
                <div className="post_title_content1">
                  {lang.number_of_taskers_needed}
                </div>
                <div className="post_title_content2">
                  <div className="post_content2_plus" onClick={this.onTaskerCountDown}>
                    <div className="post_content2_plus_con"/>
                  </div>
                  <div className="post_content2_num">
                    <div className="post_content2_num_con">
                      { taskercount }
                    </div>
                  </div>
                  <div className="post_content2_minus" onClick={this.onTaskerCountUp}>
                    <div className="post_content2_minus_con"/>
                  </div>
                </div>
              </div>
            </div>
            
            {
              selectIndex === 1 &&
              <div className="post_toptitle_center margintop">
                <div className="post_title">
                  <div className="post_title_content1">
                    {lang.number_of_bedrooms}
                  </div>
                  <div className="post_title_content2">
                    <div className="post_content2_plus" onClick={this.onBedroomCountDown}>
                      <div className="post_content2_plus_con"/>
                    </div>
                    <div className="post_content2_num">
                      <div className="post_content2_num_con">
                        { bedroomcount }
                      </div>
                    </div>
                    <div className="post_content2_minus" onClick={this.onBedroomCountUp}>
                      <div className="post_content2_minus_con"/>
                    </div>
                  </div>
                </div>
              </div>
            }
            {
              selectIndex === 1 &&
              <div className="post_toptitle_center margintop">
                <div className="post_title">
                  <div className="post_title_content1">
                    {lang.number_of_bathrooms}
                  </div>
                  <div className="post_title_content2">
                    <div className="post_content2_plus" onClick={this.onBathroomCountDown}>
                      <div className="post_content2_plus_con"/>
                    </div>
                    <div className="post_content2_num">
                      <div className="post_content2_num_con">
                        { bathroomcount }
                      </div>
                    </div>
                    <div className="post_content2_minus" onClick={this.onBathroomCountUp}>
                      <div className="post_content2_minus_con"/>
                    </div>
                  </div>
                </div>
              </div>
            }
            {
              selectIndex === 1 &&
              <div>
                <div className="post_toptitle_center margintop">
                  <div className="post_title">{lang.additional_cleaning_options}</div>
                </div>
                <div className="post_toptitle_center">
                  <div className="cleaning_option_item_container">
                    {
                      cleaning_option1 ?
                        <div className="cleaning_option_item_checked" onClick={() => {
                          this.setState({ cleaning_option1: !cleaning_option1 })
                        }}>
                          <div className="cleaning_option_item_img1_checked"/>
                          <div className="cleaning_option_item_title1">{lang.laundry}</div>
                        </div>
                        :
                        <div className="cleaning_option_item" onClick={() => {
                          this.setState({ cleaning_option1: !cleaning_option1 })
                        }}>
                          <div className="cleaning_option_item_img1"/>
                          <div className="cleaning_option_item_title1">{lang.laundry}</div>
                        </div>
                    }
                    
                    {
                      cleaning_option2 ?
                        <div className="cleaning_option_item_checked" onClick={() => {
                          this.setState({ cleaning_option2: !cleaning_option2 })
                        }}>
                          <div className="cleaning_option_item_img2_checked"/>
                          <div className="cleaning_option_item_title2">{lang.oven}</div>
                        </div>
                        :
                        <div className="cleaning_option_item" onClick={() => {
                          this.setState({ cleaning_option2: !cleaning_option2 })
                        }}>
                          <div className="cleaning_option_item_img2"/>
                          <div className="cleaning_option_item_title2">{lang.oven}</div>
                        </div>
                    }
                    
                    {
                      cleaning_option3 ?
                        <div className="cleaning_option_item_checked" onClick={() => {
                          this.setState({ cleaning_option3: !cleaning_option3 })
                        }}>
                          <div className="cleaning_option_item_img3_checked"/>
                          <div className="cleaning_option_item_title3">{lang.cabinet}</div>
                        </div>
                        :
                        <div className="cleaning_option_item" onClick={() => {
                          this.setState({ cleaning_option3: !cleaning_option3 })
                        }}>
                          <div className="cleaning_option_item_img3"/>
                          <div className="cleaning_option_item_title3">{lang.cabinet}</div>
                        </div>
                    }
                    
                    {
                      cleaning_option4 ?
                        <div className="cleaning_option_item_checked" onClick={() => {
                          this.setState({ cleaning_option4: !cleaning_option4 })
                        }}>
                          <div className="cleaning_option_item_img4_checked"/>
                          <div className="cleaning_option_item_title4">{lang.carpet}</div>
                        </div>
                        :
                        <div className="cleaning_option_item" onClick={() => {
                          this.setState({ cleaning_option4: !cleaning_option4 })
                        }}>
                          <div className="cleaning_option_item_img4"/>
                          <div className="cleaning_option_item_title4">{lang.carpet}</div>
                        </div>
                    }
                    
                    {
                      cleaning_option5 ?
                        <div className="cleaning_option_item_checked" onClick={() => {
                          this.setState({ cleaning_option5: !cleaning_option5 })
                        }}>
                          <div className="cleaning_option_item_img5_checked"/>
                          <div className="cleaning_option_item_title5">{lang.windows}</div>
                        </div>
                        :
                        <div className="cleaning_option_item" onClick={() => {
                          this.setState({ cleaning_option5: !cleaning_option5 })
                        }}>
                          <div className="cleaning_option_item_img5"/>
                          <div className="cleaning_option_item_title5">{lang.windows}</div>
                        </div>
                    }
                  
                  </div>
                </div>
              </div>
            }
            
            <div className="post_toptitle_center">
              <div className="post_title">
                <div className="post_title_content1 margintop">
                  BUDGET
                </div>
                <div className="post_title_content2 margintop">
                  <label className="radio-inline hourlyview1">
                    <input type="radio" name="optradio" checked={ hourly_checked === 0 } onClick={() => {this.onHourly(0);}}/> {lang.hourly}
                  </label>
                  <label className="radio-inline hourlyview2">
                    <input type="radio" name="optradio" checked={ hourly_checked === 1 } onClick={() => {this.onHourly(1);}}/> {lang.total_budget}
                  </label>
                </div>
              </div>
            </div>
            {
              hourly_checked === 0 &&
              <div>
                <div className="post_toptitle_center margintop">
                  <div className="post_title">{lang.nb_of_hours}</div>
                </div>
                <div className="post_toptitle_center">
                  <input
                    className="form-control post_title_input"
                    ref={ref => {this._ref_hour = ref}}
                    value={num_of_hour}
                    onChange={this.onChangeNumHour}
                  />
                </div>
                <div className="post_toptitle_center">
                  <div className="post_title">{lang.hourly_rate}</div>
                </div>
                <div className="post_toptitle_center">
                  <input
                    className="form-control post_title_input"
                    ref={ref => {this._ref_rate = ref}}
                    value={rate}
                    onChange={this.onChangeRate}
                  />
                </div>
              </div>
            }
            {
              hourly_checked === 1 &&
              <div>
                <div className="post_toptitle_center margintop">
                  <div className="post_title">{lang.amount}</div>
                </div>
                <div className="post_toptitle_center">
                  <input
                    className="form-control post_title_input"
                    ref={ref => {this._ref_fixedamount = ref}}
                    value={fixed_price}
                    onChange={this.onChangeFixedPrice}
                  />
                </div>
              </div>
            }
            <div className="post_toptitle_center margintop">
              <div className="redText">
                {lang.estimated_budget} : ${ estimated_budget }
              </div>
            </div>
            {
              amountError &&
              <div className="post_toptitle_center margintop">
                <Animated animationIn="shake" animationOut="fadeOut" isVisible={true}>
                  <div className="redText">
                    {lang.error}: {lang.amounts_accepted_are_between} ${settingInfos.min_amount} {lang.and1} ${settingInfos.max_amount}
                  </div>
                </Animated>
              </div>
            }
            <div className="post_toptitle_center">
              <div className="post_bar1"/>
            </div>
            {
              step2_blank &&
              <div className="post_toptitle_center">
                <Animated animationIn="shake" animationOut="fadeOut" isVisible={true}>
                  <div className="margintop redText">{lang.please_fill_in_the_blanks}</div>
                </Animated>
              </div>
            }
            <div className="post_toptitle_center_withpadding">
              <div className="button1" onClick={this.onCancel3}>{lang.back1}</div>
              <div className="button2" onClick={this.onNext3}>{ editing ? lang.update_the_task : lang.post_the_task }</div>
            </div>
          </div>
        }
        {
          step === 4 ?
            selectIndex === 1 ? // cleaning?
              <div className="col-sm-12 post_centerContent">
                <div className="col-sm-12 centerContent1">
                  <div className="step4Container">
                    
                    <div className="categoryiconcontainer1">
                      <div className="categoryicon">
                        <div className={categoryClassName}/>
                      </div>
                    </div>
                    
                    <div className="categoryiconcontainer2">
                      <div className="categoryiconcontainer2_1">
                        {this.categoryLists[task_info.task_category - 1]} - {task_info.task_title}
                      </div>
                      <div className="categoryiconcontainer2_2">
                        
                        {
                          personal_datas.imagePreviewUrl === '' ?
                            <div className="myavatar"/>
                            :
                            <img className="myavatarwithsrc" src={personal_datas.imagePreviewUrl} />
                        }
                        
                        <div className="myavatartext">
                          <div className="myavatartext_1">
                            Alexander Ignacz ( {lang.you1} )
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="categoryiconcontainer3">
                      <div className="categoryiconcontainer3_1">
                        ${task_info.task_budget}
                      </div>
                      <div className="categoryiconcontainer3_2">
                        Budget
                      </div>
                    </div>
                  
                  </div>
                </div>
                
                <div className="post_toptitle_center1 margintop" >
                  
                  <div className="post_toptitle_center1_1_clock" />
                  <div className="post_toptitle_center1_1" >
                    {lang.posted_uppercase} :
                  </div>
                  <div className="post_toptitle_center1_2" >
                    {lang.just_before}
                  </div>
                  
                  <div className="marginBar"/>
                  
                  <div className="post_toptitle_center1_1_stopwatch" />
                  <div className="post_toptitle_center1_1" >
                    {lang.deadline} :
                  </div>
                  <div className="post_toptitle_center1_2" >
                    { deadline.format() }
                  </div>
                  
                  <div className="marginBar"/>
                  
                  <div className="post_toptitle_center1_1 marginleft" >
                    {lang.status_uppercase} :
                  </div>
                  <div className="post_toptitle_center1_2" >
                    {lang.open1}
                  </div>
                  
                  <div className="marginBar"/>
                  
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
                
                <div className="post_toptitle_center2 margintop" >
                  
                  <div className="post_leftRangeContainer">
                    
                    <div className="post_leftRange_drumroll">
                      <div className="post_leftRange_drumroll_icon"/>
                      <div className="post_leftRange_drumroll_text1">
                        {lang.drumroll_please}!
                      </div>
                      <div className="post_leftRange_drumroll_text2">
                        {lang.no_offers_yet_description}
                      </div>
                    </div>
                    
                    <div className="post_left_horibar"/>
                    
                    <div className="post_leftRange_taskdesc">
                      {lang.task_description}
                    </div>
                    
                    <div className="post_leftRange_taskdesc_content">
                      { task_info.task_description }
                    </div>
                    
                    <div className="post_leftRange_new_endleasing">
                      { cleaning_toggle1 ? lang.this_is_an_end_leasing_cleaning : lang.this_is_not_an_end_leasing_cleaning }
                    </div>
                    
                    <div className="post_leftRange_new_propertytype">
                      {lang.property_type}
                    </div>
                    
                    <div className="post_leftRange_new_bedroomnum">
                      {lang.number_of_bedrooms}
                    </div>
                    
                    <div className="post_leftRange_new_propertytype_value">
                      { cleaning_toggle2 ? lang.house : lang.apartment }
                    </div>
                    
                    <div className="post_leftRange_new_bedroomnum_value">
                      { bedroomcount } - {lang.bedrooms}
                    </div>
                    
                    <div className="post_leftRange_new_bathroomnum">
                      {lang.number_of_bathrooms}
                    </div>
                    
                    <div className="post_leftRange_new_taskernum">
                      {lang.taskers_needed}
                    </div>
                    
                    <div className="post_leftRange_new_bathroomnum_value">
                      { bathroomcount } - {lang.bathrooms}
                    </div>
                    
                    <div className="post_leftRange_new_taskernum_value">
                      { taskercount } - {lang.taskers_needed}
                    </div>
                    
                    <div className="post_leftRange_new_cleaningoptions">
                      {lang.additional_cleaning_options}
                    </div>
                    
                    {
                      render_new_cleaningoptions
                    }
                  
                  </div>
                  
                  <div className="post_rightRangeContainer">
                    
                    <div className="post_leftRange_drumroll">
                      <div className="post_gps_icon" onClick={this.navigateCurrentLoc}/>
                      <div>
                        TASK LOCATION
                      </div>
                      <div className="post_rightRange_drumroll_text2_icon"/>
                      <div className="post_rightRange_drumroll_text2">
                        { task_info.task_location === "" ? lang.no_location : task_info.task_location }
                      </div>
                      <div className="locationwindow">
                        {
                          !reloadGPS &&
                          <MapWithAMarker
                            containerElement={<div className="xxx" />}
                            mapElement={<div style={{ height: `100%` }} />}
                            lat={lat}
                            lng={lng}
                          />
                        }
                      </div>
                    </div>
                    
                    <div className="post_leftRange_view_new">
                      {lang.view_attachments}
                    </div>
                    
                    <div className="post_done_viewattach_container_new">
                      { render_attachments_done }
                    </div>
                  
                  </div>
                </div>
                
                <div className="post_toptitle_new_center3" />
                <div className="post_canceltaskbtn_new" onClick={this.cancelTask}>
                  {lang.cancel_the_task}
                </div>
                <div className="post_edittaskbtn_new" onClick={this.editTask}>
                  {lang.edit_the_task}
                </div>
                <div className="post_marginBottom" />
              </div>
              : // not cleaning?
              <div className="col-sm-12 post_centerContent">
                <div className="col-sm-12 centerContent1">
                  <div className="step4Container">
                    
                    <div className="categoryiconcontainer1">
                      <div className="categoryicon">
                        <div className={categoryClassName}/>
                      </div>
                    </div>
                    
                    <div className="categoryiconcontainer2">
                      <div className="categoryiconcontainer2_1">
                        {this.categoryLists[task_info.task_category - 1]} - {task_info.task_title}
                      </div>
                      <div className="categoryiconcontainer2_2">
                        
                        {
                          personal_datas.imagePreviewUrl === '' ?
                            <div className="myavatar"/>
                            :
                            <img className="myavatarwithsrc" src={personal_datas.imagePreviewUrl} />
                        }
                        
                        <div className="myavatartext">
                          <div className="myavatartext_1">
                            Alexander Ignacz ( {lang.you1} )
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="categoryiconcontainer3">
                      <div className="categoryiconcontainer3_1">
                        ${task_info.task_budget}
                      </div>
                      <div className="categoryiconcontainer3_2">
                        {lang.budget}
                      </div>
                    </div>
                  
                  </div>
                </div>
                
                <div className="post_toptitle_center1 margintop" >
                  
                  <div className="post_toptitle_center1_1_clock" />
                  <div className="post_toptitle_center1_1" >
                    {lang.posted_uppercase} :
                  </div>
                  <div className="post_toptitle_center1_2" >
                    {lang.just_before}
                  </div>
                  
                  <div className="marginBar"/>
                  
                  <div className="post_toptitle_center1_1_stopwatch" />
                  <div className="post_toptitle_center1_1" >
                    {lang.deadline} :
                  </div>
                  <div className="post_toptitle_center1_2" >
                    { deadline.format() }
                  </div>
                  
                  <div className="marginBar"/>
                  
                  <div className="post_toptitle_center1_1 marginleft" >
                    {lang.status_uppercase} :
                  </div>
                  <div className="post_toptitle_center1_2" >
                    {lang.open1}
                  </div>
                  
                  <div className="marginBar"/>
                  
                  <div className="post_toptitle_center1_1 marginleft" >
                    {lang.share_on} :
                  </div>
                  <div className="post_toptitle_center1_1_fb" />
                  <div className="post_toptitle_center1_1" >
                    {lang.facebook}
                  </div>
                  <div className="post_toptitle_center1_1_mail" />
                  <div className="post_toptitle_center1_1" >
                    {lang.facebook}
                  </div>
                </div>
                
                <div className="post_toptitle_center2 margintop" >
                  
                  <div className="post_leftRangeContainer">
                    
                    <div className="post_leftRange_drumroll">
                      <div className="post_leftRange_drumroll_icon"/>
                      <div className="post_leftRange_drumroll_text1">
                        {lang.drumroll_please}!
                      </div>
                      <div className="post_leftRange_drumroll_text2">
                        {lang.no_offers_yet_description}
                      </div>
                    </div>
                    
                    <div className="post_left_horibar"/>
                    
                    <div className="post_leftRange_taskdesc">
                      {lang.task_description}
                    </div>
                    
                    <div className="post_leftRange_taskdesc_content">
                      { task_info.task_description }
                    </div>
                    
                    <div className="post_leftRange_taskersneeded">
                      {lang.taskers_needed} :
                    </div>
                    
                    <div className="post_leftRange_tasktype">
                      { selectIndex === 4 ? lang.distance__ : lang.task_type__ }
                    </div>
                    
                    <div className="post_leftRange_taskersneeded_content">
                      { task_info.task_numberoftasker } - {lang.taskers_needed}
                    </div>
                    
                    <div className="post_leftRange_tasktype_content">
                      {
                        selectIndex === 4 ?
                          "15 Kilometers"
                          :
                          task_info.task_type === 0 ?
                            lang.virtual_task
                            :
                            lang.task_is_in_spec_loc
                      }
                    </div>
                    
                    {
                      selectIndex === 4 &&
                        <div>
                          <div className="post_leftRange_taskersneeded_margintop1">
                            {lang.from_locations} :
                          </div>
  
                          <div className="post_leftRange_tasktype_margintop1">
                            {lang.to_location} :
                          </div>
  
                          <div className="post_leftRange_taskersneeded_content_margintop1">
                            H7R 0D8
                          </div>
  
                          <div className="post_leftRange_tasktype_content_margintop1">
                            H2P 5X2
                          </div>
                        </div>
                    }
                    {
                      selectIndex === 4 ?
                        <div>
                          <div className="post_leftRange_view_margintop1">
                            {lang.view_attachments}
                          </div>
  
                          <div className="post_done_viewattach_container_margintop1">
                            { render_attachments_done }
                          </div>
                        </div>
                        :
                        <div>
                          <div className="post_leftRange_view">
                            {lang.view_attachments}
                          </div>
    
                          <div className="post_done_viewattach_container">
                            { render_attachments_done }
                          </div>
                        </div>
                    }
                  
                  </div>
                  
                  <div className="post_rightRangeContainer">
                    
                    <div className="post_leftRange_drumroll">
                      <div className="post_gps_icon" onClick={this.navigateCurrentLoc}/>
                      <div>
                        {lang.task_location}
                      </div>
                      <div className="post_rightRange_drumroll_text2_icon"/>
                      <div className="post_rightRange_drumroll_text2">
                        { task_info.task_location === "" ? lang.no_location : task_info.task_location }
                      </div>
                      <div className="locationwindow">
                        {
                          !reloadGPS &&
                            selectIndex === 4 ? //moving?
                            <MapWithAMarker
                              containerElement={<div className="xxx" />}
                              mapElement={<div style={{ height: `100%` }} />}
                              lat={lat}
                              lng={lng}
                            />
                            :
                            <MapWithAMarker //not moving
                              containerElement={<div className="xxx" />}
                              mapElement={<div style={{ height: `100%` }} />}
                              lat={lat}
                              lng={lng}
                            />
                        }
                      </div>
                    </div>
                  
                  </div>
                </div>
                
                <div className="post_toptitle_center3" />
                <div className="post_canceltaskbtn" onClick={this.cancelTask}>
                  {lang.cancel_the_task}
                </div>
                <div className="post_edittaskbtn" onClick={this.editTask}>
                  {lang.edit_the_task}
                </div>
                <div className="post_marginBottom" />
              </div> : null
        }
        
        <div className="previewComponent">
          <form onSubmit={(e)=>this._handleSubmit(e)}>
            <input className="fileInput"
                   type="file"
                   ref={ref=>{this.fileGhost=ref}}
                   onChange={(e)=>this._handleImageChange(e)} />
            <button className="submitButton"
                    type="submit"
                    onClick={(e)=>this._handleSubmit(e)}>Upload Image</button>
          </form>
        </div>
        
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
            <Button onClick={this.closeAlert}>{lang.close}</Button>
          </Modal.Footer>
        </Modal>
      
      </div>
    );
  }
}

Post.propTypes = {
  updateHeader: PropTypes.func.isRequired
};
