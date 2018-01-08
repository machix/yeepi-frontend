import React, { PropTypes } from 'react';
import './styles.css';
import './animationcss.css';
import "./../../../../public/styles.css";
import Swiper from 'react-id-swiper';
import Robot from './components/Robot';
import User from './components/User';
import AccountTypeSelector from './components/AccountTypeSelector';
import SkillSelector from "./components/SkillSelector";
import LangSelector from "./components/LangSelector";
import TransportionSelector from "./components/TransportionSelector";
import ConfirmFillSelector from "./components/ConfirmFillSelector";
import { Redirect } from 'react-router';
import { reactLocalStorage } from 'reactjs-localstorage';
import config from './../../../config';
import Autocomplete from 'react-google-autocomplete';
import PlacesAutocomplete, { geocodeByPlaceId } from 'react-places-autocomplete'
import { Link } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import ip from 'public-ip';

import Promise from 'promise';
import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';
let superagent = superagentPromise(_superagent, Promise);

const base_url_public = config.baseUrl;

const STATE_CHATBOT_LOADING = 0;
const STATE_USER_LOADING = 1;
const botDelayTime = 1000;

const defaultFlow = [{
  role: "bot",
  displayText: "..."
}];

export default class Signup extends React.Component {
  
  constructor() {
    super();
    this.state = {
      signupFlow: defaultFlow,
      redirect: 0,
      address_input_state: false,
      inputType: 0,
      showAlert: false,
      alertText: "",
      address: "",
      placeId: "",
      lat: 0,
      lng: 0,
      zipcode: ""
    };
    this.localValues = {
      code: "",
      username: "",
      email: "",
      password: "",
      availablelanguage: [],
      language: "",
      trans: [],
      address: "",
      zipcode: "",
      phonenumber: "",
      accounttype: "",
      skill: [],
      botState: 0,
      flowState: 0
    };
    this.directType = 0;
    this.localValues.flowState = STATE_CHATBOT_LOADING;
    
    this.requests = {
      emailvalidate: (str) =>
        superagent.post(base_url_public + '/user/signup/validate/email', { email: str }).then(res => {
          if (res.body.result === "error") {
            this.setState({ showAlert: true, alertText: "Error" })
          } else if (res.body.result) {
            this.localValues.email = str;
            this.goToNextStep();
          } else {
            this.setState({ showAlert: true, alertText: "This email is already existing. Please check again." })
          }
        }),
      signupverify: () =>
        superagent.post(base_url_public + '/user/signupverify', { email: this.localValues.email }).then(res => {
          this.localValues.code = res.body.code;
          this.setState({ signupFlow: [] }, () => {
            this.setState({ signupFlow: defaultFlow, address_input_state: false, inputType: 0 });
            this.localValues.flowState = STATE_USER_LOADING;
          });
        }),
      signupFirstWithLowInfos: (ip) =>
        superagent.post(base_url_public + '/user/signup/first', {
          username: this.localValues.username,
          email: this.localValues.email,
          password: this.localValues.password,
          availablelanguage: ["English"],
          language: "English",
          trans: "",
          address: "",
          zipcode: "",
          lat: 0,
          lng: 0,
          phonenumber: "",
          accounttype: this.localValues.accounttype,
          signupstep: 2,
          skill: [],
          signupIp: ip,
          existstripe: false,
        }).then(res => {
          this.localValues.code = res.body.code;
          this.setState({ signupFlow: [] }, () => {
            reactLocalStorage.set('loggedToken', res.body.token);
            this.makeChatUser(res.body.email.toLowerCase(), res.body.username);
            this.setState({ redirect: 1 });
          });
        }),
      signupFirst: (ip) => {
        superagent.post(base_url_public + '/user/signup/first', {
          username: this.localValues.username,
          email: this.localValues.email,
          password: this.localValues.password,
          availablelanguage: this.localValues.availablelanguage,
          language: this.localValues.language,
          trans: this.localValues.trans,
          address: this.state.address,
          zipcode: this.state.zipcode,
          lat: this.state.lat,
          lng: this.state.lng,
          phonenumber: this.localValues.phonenumber,
          accounttype: this.localValues.accounttype,
          skill: this.localValues.skill,
          signupIp: ip,
          existstripe: false,
        }).then(res => {
          reactLocalStorage.set('loggedToken', res.body.token);
          this.makeChatUser(res.body.email.toLowerCase(), res.body.username);
          this.setState({ redirect: 2, address_input_state: false, inputType: 0 });
        })
      },
      signupFirstWithoutStripe: (ip) => {
        superagent.post(base_url_public + '/user/signup/first', {
          username: this.localValues.username,
          email: this.localValues.email,
          password: this.localValues.password,
          availablelanguage: this.localValues.availablelanguage,
          language: this.localValues.language,
          trans: this.localValues.trans,
          address: this.state.address,
          zipcode: this.state.zipcode,
          lat: this.state.lat,
          lng: this.state.lng,
          phonenumber: this.localValues.phonenumber,
          accounttype: this.localValues.accounttype,
          skill: this.localValues.skill,
          signupstep: 2,
          signupIp: ip,
          existstripe: false,
        }).then(res => {
          reactLocalStorage.set('loggedToken', res.body.token);
          this.makeChatUser(res.body.email.toLowerCase(), res.body.username);
          this.setState({redirect: 3, address_input_state: false, inputType: 0});
        })
      }
    };
    this.rollDirection = 'right';
    this._timeout1 = window.setTimeout(() => {this.startRolling()}, config.swiperDuration);
  }
  
  componentDidMount() {
    reactLocalStorage.set('sign_state', 'true');
    reactLocalStorage.set('dahsboard_loaded', "false");
    this.props.updateHeader(0);
    setTimeout(() => {
      this.goToNextStep();
    }, botDelayTime);
  }
  
  componentDidUpdate() {
    let el = this._refChatContent;
    el.scrollTop = el.scrollHeight;
  }
  
  componentWillUnmount() {
    window.clearTimeout(this._timeout1);
    this._timeout1 = null;
    
    this.localValues.username = "";
    this.localValues.email = "";
    this.localValues.botState = 0;
    this.localValues.flowState = 0;
    // noinspection JSAnnotator
    defaultFlow = [{
      role: "bot",
      displayText: "..."
    }];
  }
  
  makeChatUser = (email, username) => {
    reactLocalStorage.set('loggedEmail', email);
    reactLocalStorage.set('loggedUsername', username);
    window.applozic.init({
      appId: '2fde83d9c3e0d87d15b2373bbf99e6172',
      userId: email,
      userName: email,
      imageLink : '',
      email : '',
      contactNumber: '',
      accessToken: '',
      desktopNotification: true,
      notificationIconLink: '',
    });
  };
  
  
  startRolling() {
    if (this.rollDirection === 'right') {
      if (this.checkRightEdge()) {
        this.rollDirection = 'left';
        //click left button, delay 3s, call startRolling
        const list = document.getElementsByClassName("swiper-button-prev");
        list[0].click();
      } else {
        //click right button, delay 3s, call startRolling
        const list = document.getElementsByClassName("swiper-button-next");
        list[0].click();
      }
      this._timeout1 = window.setTimeout(() => {this.startRolling()}, config.swiperDuration);
    } else {
      if (this.checkLeftEdge()) {
        this.rollDirection = 'right';
        //click right button, delay 3s, call startRolling
        const list = document.getElementsByClassName("swiper-button-next");
        list[0].click();
      } else {
        //click left button, delay 3s, call startRolling
        const list = document.getElementsByClassName("swiper-button-prev");
        list[0].click();
      }
      this._timeout1 = window.setTimeout(() => {this.startRolling()}, config.swiperDuration);
    }
  }
  
  checkLeftEdge = () => {
    return document.getElementsByClassName("swiper-button-prev swiper-button-disabled").length !== 0
  };
  
  checkRightEdge = () => {
    return document.getElementsByClassName("swiper-button-next swiper-button-disabled").length !== 0
  };
  
  handleSubmit = (e) => {
    e.preventDefault();
    this.onSendTyping();
  };
  
  onSendTyping = () => {
    const { inputType, address_input_state } = this.state;
    if (inputType === 1) {
      if (this.localValues.accounttype === "") {
      
      } else {
        if (this.localValues.accounttype === "Poster") {
          ip.v4().then(ip => {
            this.requests.signupFirstWithLowInfos(ip)
          });
        } else {
          defaultFlow[defaultFlow.length - 1].displayText = "My plan is " + this.localValues.accounttype;
          defaultFlow.push({
            role: "bot",
            displayText: "..."
          });
          this.setState({ signupFlow: [] }, () => {
            this.setState({ signupFlow: defaultFlow, address_input_state: false, inputType: 0 });
            this.localValues.flowState = STATE_CHATBOT_LOADING;
          });
          this.runBotTimer();
        }
      }
    } else if (inputType === 2) {
      if (this.localValues.skill.length === 0) {
      } else if (this.localValues.skill.length === 1) {
        defaultFlow[defaultFlow.length - 1].displayText = "My skill is " + this.localValues.skill[0];
        defaultFlow.push({
          role: "bot",
          displayText: "..."
        });
        this.setState({signupFlow: []}, () => {
          this.setState({signupFlow: defaultFlow, address_input_state: false, inputType: 0});
          this.localValues.flowState = STATE_CHATBOT_LOADING;
        });
        this.runBotTimer();
      } else {
        defaultFlow[defaultFlow.length - 1].displayText = "My skills are ";
        for (let i = 0; i < this.localValues.skill.length; i++) {
          defaultFlow[defaultFlow.length - 1].displayText += this.localValues.skill[i];
          if (i !== this.localValues.skill.length - 1) {
            defaultFlow[defaultFlow.length - 1].displayText += ", ";
          }
        }
        defaultFlow.push({
          role: "bot",
          displayText: "..."
        });
        this.setState({signupFlow: []}, () => {
          this.setState({signupFlow: defaultFlow, address_input_state: false, inputType: 0});
          this.localValues.flowState = STATE_CHATBOT_LOADING;
        });
        this.runBotTimer();
      }
    } else if (inputType === 3) {
      if (this.localValues.availablelanguage.length === 0) {
    
      } else {
        if (this.localValues.availablelanguage.length === 2) {
          defaultFlow[defaultFlow.length - 1].displayText = "Languages are English and French.";
          this.localValues.language = "English";
        } else {
          defaultFlow[defaultFlow.length - 1].displayText = "Language is " + this.localValues.availablelanguage[0];
          this.localValues.language = this.localValues.availablelanguage[0];
        }
        defaultFlow.push({
          role: "bot",
          displayText: "..."
        });
        this.setState({signupFlow: []}, () => {
          this.setState({signupFlow: defaultFlow, address_input_state: false, inputType: 0});
          this.localValues.flowState = STATE_CHATBOT_LOADING;
        });
        this.runBotTimer();
      }
    } else if (inputType === 4) {
      if (this.localValues.trans.length === 0) {
    
      } else if (this.localValues.trans.length === 1) {
        defaultFlow[defaultFlow.length - 1].displayText = "Transportion is " + this.localValues.trans[0];
        defaultFlow.push({
          role: "bot",
          displayText: "..."
        });
        this.setState({signupFlow: []}, () => {
          this.setState({signupFlow: defaultFlow, address_input_state: false, inputType: 0});
          this.localValues.flowState = STATE_CHATBOT_LOADING;
        });
        this.runBotTimer();
      } else {
        defaultFlow[defaultFlow.length - 1].displayText = "Transportions are ";
        for (let i = 0; i < this.localValues.trans.length; i++) {
          defaultFlow[defaultFlow.length - 1].displayText += this.localValues.trans[i];
          if (i !== this.localValues.trans.length - 1) {
            defaultFlow[defaultFlow.length - 1].displayText += ", ";
          }
        }
        defaultFlow.push({
          role: "bot",
          displayText: "..."
        });
        this.setState({signupFlow: []}, () => {
          this.setState({signupFlow: defaultFlow, address_input_state: false, inputType: 0});
          this.localValues.flowState = STATE_CHATBOT_LOADING;
        });
        this.runBotTimer();
      }
    } else if (inputType === 5) {
      if (this.directType === 0) {
    
      } else {
        if (this.directType === 1) {
          ip.v4().then(ip => {
            this.requests.signupFirstWithoutStripe(ip)
          });
        } else {
          ip.v4().then(ip => {
            this.requests.signupFirst(ip)
          });
        }
      }
    } else if (address_input_state) {
      if (this.state.address === "") {
      
      } else {
        this.goToNextStep()
      }
    } else {
      if (defaultFlow[defaultFlow.length - 1].displayText !== "..." || defaultFlow[defaultFlow.length - 1].role === "bot") {
        this._input.value = "";
        return;
      }
      if (defaultFlow[defaultFlow.length - 1].displayText === "....") {
        this._input.value = "";
        return;
      }
      if (defaultFlow[defaultFlow.length - 1].displayText === ".....") {
        this._input.value = "";
        return;
      }
      if (defaultFlow[defaultFlow.length - 1].displayText === "......") {
        this._input.value = "";
        return;
      }
      if (defaultFlow[defaultFlow.length - 1].displayText === ".......") {
        this._input.value = "";
        return;
      }
      if (defaultFlow[defaultFlow.length - 1].displayText === "........") {
        this._input.value = "";
        return;
      }
      const str = this._input.value;
      if (str !== "") {
        this._input.value = "";
        if (this.localValues.botState === 1) {
          this.localValues.username = str;
        }
        if (this.localValues.botState === 2) {
          if (this.checkValidateEmail(str)) {
            this.requests.emailvalidate(str);
          } else {
            this.setState({ showAlert: true, alertText: "This is not email type." })
          }
        }
        if (this.localValues.botState === 3) {
          this.localValues.password = str;
        }
        if (this.localValues.botState === 9) {
          this.localValues.address = str;
        }
        if (this.localValues.botState === 10) {
          this.localValues.phonenumber = this.maskedPhoneNumber(str);
        }
        if (this.localValues.botState === 4) {
          if (this.isVerified(str)) {
            this.goToNextStep();
          } else {
            this.setState({ showAlert: true, alertText: "Code is incorrect, please check again." })
          }
        } else {
          if (this.localValues.botState !== 2) {
            this.goToNextStep();
          }
        }
      } else {
        if (this.localValues.botState === 9) {
          this.localValues.address = "";
          this.goToNextStep();
        }
        if (this.localValues.botState === 10) {
          this.localValues.phonenumber = "";
          this.goToNextStep();
        }
      }
    }
  };
  
  onSendTyping_Address = () => {
    this.goToNextStep();
  };
  
  isVerified = (str) => {
    return this.localValues.code === " " + str;
    // return true;
  };
  
  runBotTimer() {
    setTimeout(() => {
      this.goToNextStep();
    }, botDelayTime);
  }
  
  goToNextStep() {
    if (this.localValues.flowState === STATE_CHATBOT_LOADING) {
      defaultFlow[defaultFlow.length - 1].displayText = this.getBotSampleText(this.localValues.botState);
      if (this.localValues.botState === 4) {
        defaultFlow.push({
          role: "user",
          displayText: "...."
        });
      } else if (this.localValues.botState === 5) {
        defaultFlow.push({
          role: "user",
          displayText: "....."
        });
      } else if (this.localValues.botState === 6) {
        defaultFlow.push({
          role: "user",
          displayText: "......"
        });
      } else if (this.localValues.botState === 7) {
        defaultFlow.push({
          role: "user",
          displayText: "......."
        });
      } else if (this.localValues.botState === 10) {
        defaultFlow.push({
          role: "user",
          displayText: "........"
        });
      } else {
        defaultFlow.push({
          role: "user",
          displayText: "..."
        });
      }
      this.localValues.botState++;
      if (this.localValues.botState === 4) {
        this.requests.signupverify()
      } else {
        if (this.localValues.botState === 9) {
          this.setState({ signupFlow: [] }, () => {
            this.setState({ signupFlow: defaultFlow, address_input_state: true });
            this.localValues.flowState = STATE_USER_LOADING;
          });
        } else {
          if (this.localValues.botState === 5) {
            this.setState({signupFlow: []}, () => {
              this.setState({signupFlow: defaultFlow, address_input_state: false, inputType: 1});
              this.localValues.flowState = STATE_USER_LOADING;
            });
          } else if (this.localValues.botState === 6) {
            this.setState({signupFlow: []}, () => {
              this.setState({signupFlow: defaultFlow, address_input_state: false, inputType: 2});
              this.localValues.flowState = STATE_USER_LOADING;
            });
          } else if (this.localValues.botState === 7) {
            this.setState({signupFlow: []}, () => {
              this.setState({signupFlow: defaultFlow, address_input_state: false, inputType: 3});
              this.localValues.flowState = STATE_USER_LOADING;
            });
          } else if (this.localValues.botState === 8) {
            this.setState({signupFlow: []}, () => {
              this.setState({signupFlow: defaultFlow, address_input_state: false, inputType: 4});
              this.localValues.flowState = STATE_USER_LOADING;
            });
          } else if (this.localValues.botState === 11) {
            this.setState({signupFlow: []}, () => {
              this.setState({signupFlow: defaultFlow, address_input_state: false, inputType: 5});
              this.localValues.flowState = STATE_USER_LOADING;
            });
          } else {
            this.setState({ signupFlow: [] }, () => {
              this.setState({ signupFlow: defaultFlow, address_input_state: false, inputType: 0 });
              this.localValues.flowState = STATE_USER_LOADING;
            });
          }
        }
      }
    } else if (this.localValues.flowState === STATE_USER_LOADING) {
      defaultFlow[defaultFlow.length - 1].displayText = this.getUserSampleText(this.localValues.botState);
      defaultFlow.push({
        role: "bot",
        displayText: "..."
      });
      this.setState({ signupFlow: [] }, () => {
        this.setState({ signupFlow: defaultFlow });
        this.localValues.flowState = STATE_CHATBOT_LOADING;
        this.runBotTimer();
      });
    }
  }
  
  getBotSampleText = (i) => {
    if (i === 0) {
      return "Hi, I'm Yeepi and I'm here to guide you with the signup. What is your name?"
    } else if (i === 1) {
      return "Awesome, " + this.localValues.username + "! What is your email address?"
    } else if (i === 2) {
      return "Type in your password."
    } else if (i === 3) {
      return "Ok, I just sent the verification code. Check your email and type the code here."
    } else if (i === 4) {
      return "Good, your code is verified. What do you plan to do on Yeepi?"
    } else if (i === 5) {
      return "Awesome. Please tell us your skills. Choose among the following."
    } else if (i === 6) {
      return "Select your spoken language."
    } else if (i === 7) {
      return "Select your transportation."
    } else if (i === 8) {
      return "Now, I need your address please. That helps to find tasks near you."
    } else if (i === 9) {
      return "What is your phone number. Mask is : +1 (999) 999-9999"
    } else if (i === 10) {
      return "Would you like to fill your bank account now. This is to transfer funds in your account once you complete a task. Don't worry, the info is secure."
    } else if (i === 11) {
      return "11"
    } else if (i === 12) {
      return "12"
    } else if (i === 13) {
      return "13"
    }
  };
  
  getUserSampleText = (i) => {
    if (i === 1) {
      return "My name is " + this.localValues.username;
    } else if (i === 2) {
      return "My email is " + this.localValues.email;
    } else if (i === 3) {
      return "This is the password"
    } else if (i === 4) {
      return "This is the verification code";
    } else if (i === 5) {
      return "5"
    } else if (i === 6) {
      return "6"
    } else if (i === 7) {
      return "7"
    } else if (i === 8) {
      return "8"
    } else if (i === 9) {
      return "My address is " + this.state.address;
    } else if (i === 10) {
      if (this.localValues.phonenumber === "") {
        return "Skipped signup phone number"
      }
      return "My phone number is " + this.localValues.phonenumber;
    } else if (i === 11) {
      return "11"
    } else if (i === 12) {
      return "12"
    } else if (i === 13) {
      return "13"
    } else if (i === 14) {
      return "14"
    }
  };
  
  updateAccountType = i => {
    if (i === 1) {
      this.localValues.accounttype = "Tasker";
    } else if (i === 2) {
      this.localValues.accounttype = "Poster";
    } else {
      this.localValues.accounttype = "Both";
    }
    this.setState({ address_input_state: false, inputType: 1 })
  };
  
  updateSkills = list => {
    this.localValues.skill = list;
    this.setState({ address_input_state: false, inputType: 2 })
  };
  
  updateLang = (list) => {
    this.localValues.availablelanguage = list;
    this.setState({ address_input_state: false, inputType: 3 })
  };
  
  updateTrans = list => {
    this.localValues.trans = list;
    this.setState({ address_input_state: false, inputType: 4 })
  };
  
  updateFill = i => {
    this.directType = i;
    this.setState({ address_input_state: false, inputType: 5 })
  };
  
  checkValidateEmail = mail => {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail);
  };
  
  closeAlert = () => {
    this.setState({ showAlert: false })
  };
  
  maskedPhoneNumber = v => {
    let r = v.replace(/\D/g,"");
    if (r.length === 15) {
      r = r.replace(/^(\d{5})(\d{3})(\d{3})(\d{4}).*/,"+$1 ($2) $3-$4");
    } else if (r.length === 14) {
      r = r.replace(/^(\d{4})(\d{3})(\d{3})(\d{4}).*/,"+$1 ($2) $3-$4");
    } else if (r.length === 13) {
      r = r.replace(/^(\d{3})(\d{3})(\d{3})(\d{4}).*/,"+$1 ($2) $3-$4");
    } else if (r.length === 12) {
      r = r.replace(/^(\d{2})(\d{3})(\d{3})(\d{4}).*/,"+$1 ($2) $3-$4");
    } else if (r.length === 11) {
      r = r.replace(/^(\d{1})(\d{3})(\d{3})(\d{4}).*/,"+$1 ($2) $3-$4");
    } else if (r.length === 10) {
      r = r.replace(/^(\d{3})(\d{3})(\d{4}).*/,"($1) $2-$3");
    } else if (r.length === 9) {
      r = r.replace(/^(\d{2})(\d{3})(\d{4}).*/,"($1) $2-$3");
    }
    return r;
  };
  
  onChange = (address) => {
    this.setState({ address });
  };
  
  handleSelect = (address, placeId) => {
    geocodeByPlaceId(placeId)
      .then(results => {
        let zipcode = results[0].address_components.filter(function (it) { return it.types.indexOf('postal_code') != -1;}).map(function (it) {return it.long_name;});
        this.setState({ address, placeId, zipcode, lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng() })
      })
      .catch(error => console.error(error));
  };
  
  render() {
    const inputProps = {
      value: this.state.address,
      onChange: this.onChange,
    };
    const AutocompleteItem = ({ formattedSuggestion }) => (
      <div>
        <strong>{ formattedSuggestion.mainText }</strong>{' '}
        <small>{ formattedSuggestion.secondaryText }</small>
      </div>
    );
    const params = {
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      }
    };
  
    let { signupFlow, redirect, address_input_state, inputType, showAlert, alertText } = this.state;
  
    if (redirect === 1) {
      return <Redirect push to="/post"/>;
    } else if (redirect === 2) {
      return <Redirect push to="/signup/stripe" />;
    } else if (redirect === 3) {
      return <Redirect push to="/myprofile" />;
    } else {
      let render_signupflow1 = [];
      for (let i = 0; i < signupFlow.length; i++) {
        if (signupFlow[i].role === "bot") {
          render_signupflow1.push(
            <Robot displayText={signupFlow[i].displayText} animation={i === signupFlow.length - 2}/>
          );
        } else {
          if (signupFlow[i].displayText === "....") { // set account type
            render_signupflow1.push(
              <AccountTypeSelector updateAccountType={this.updateAccountType}/>
            );
          } else if (signupFlow[i].displayText === ".....") { // set skills
            render_signupflow1.push(
              <SkillSelector updateSkills={this.updateSkills}/>
            );
          } else if (signupFlow[i].displayText === "......") { // set language
            render_signupflow1.push(
              <LangSelector updateLang={this.updateLang}/>
            );
          } else if (signupFlow[i].displayText === ".......") { // set transportation
            render_signupflow1.push(
              <TransportionSelector updateTrans={this.updateTrans}/>
            );
          } else if (signupFlow[i].displayText === "........") { // set fill confirm
            render_signupflow1.push(
              <ConfirmFillSelector updateFill={this.updateFill}/>
            );
          } else {
            render_signupflow1.push(
              <User displayText={signupFlow[i].displayText} animation={i === signupFlow.length - 2}/>
            );
          }
        }
      }
      
      let render_inputType1 = [];
      if (inputType === 1) {
        if (this.localValues.accounttype === "") {
          render_inputType1.push(
            <div className="skillItem_null" />
          )
        } else {
          render_inputType1.push(
            <div className="skillItem">{ this.localValues.accounttype }</div>
          )
        }
      }
  
      let render_inputType2 = [];
      if (inputType === 2) {
        if (this.localValues.skill.length === 0) {
          render_inputType2.push(
            <div className="skillItem_null" />
          )
        } else {
          for (let i = 0; i < this.localValues.skill.length; i++) {
            let dis = this.localValues.skill[i];
            // if (dis === "House Cleaning") {
            //   dis = "Cleaning"
            // }
            // if (dis === "Assembly Services") {
            //   dis = "Services"
            // }
            // if (dis === "Admin & IT Support") {
            //   dis = "Support"
            // }
            // if (dis === "Beauty & Care") {
            //   dis = "Care"
            // }
            // if (dis === "Other Services") {
            //   dis = "Other"
            // }
            render_inputType2.push(
              <div className="skillItem">{ dis }</div>
            )
          }
        }
      }
  
      let render_inputType3 = [];
      if (inputType === 3) {
        if (this.localValues.availablelanguage.length === 0) {
          render_inputType3.push(
            <div className="skillItem_null" />
          )
        } else {
          for (let i = 0; i < this.localValues.availablelanguage.length; i++) {
            render_inputType3.push(
              <div className="skillItem">{ this.localValues.availablelanguage[i] }</div>
            )
          }
        }
      }
  
      let render_inputType4 = [];
      if (inputType === 4) {
        if (this.localValues.trans.length === 0) {
          render_inputType4.push(
            <div className="skillItem_null" />
          )
        } else {
          for (let i = 0; i < this.localValues.trans.length; i++) {
            render_inputType4.push(
              <div className="skillItem">{ this.localValues.trans[i] }</div>
            )
          }
        }
      }
  
      let render_inputType5 = [];
      if (inputType === 5) {
        if (this.directType === 0) {
          render_inputType5.push(
            <div className="skillItem_null" />
          )
        } else {
          if (this.directType === 1) {
            render_inputType5.push(
              <div className="skillItem">No</div>
            )
          } else {
            render_inputType5.push(
              <div className="skillItem">Yes</div>
            )
          }
        }
      }
      
      return (
        <div className="row basicontainer">
          <div className="col-sm-5">
            <Swiper {...params}>
              <div className="image1" />
              <div className="image2" />
              <div className="image3" />
              <div className="image4" />
              <div className="image5" />
              <div className="image6" />
            </Swiper>
          </div>
          <div className="col-sm-7 scroll chatContainer">
            <div className="scroll chatContent_border" ref={ref => {this._refChatContent = ref;}}>
              { render_signupflow1 }
            </div>
            {
              !address_input_state && inputType === 0 &&
              <form onSubmit={this.handleSubmit}>
                <div className="inputContainer">
                  <div className="typingSend" onClick={() => {this.onSendTyping();}}/>
                  <input
                    type={this.localValues.botState === 3 ? "password" : "text"}
                    className="form-control inputbar"
                    id="usr"
                    ref={ref => (this._input = ref)}
                  />
                </div>
              </form>
            }
            {
              !address_input_state && inputType === 1 &&
              <form onSubmit={this.handleSubmit}>
                <div className="skillItem_inputContainer">
                  <div className="typingSend" onClick={() => {this.onSendTyping();}}/>
                  <div className="form-control skillItem_inputbar">
                    { render_inputType1 }
                  </div>
                </div>
              </form>
            }
            {
              !address_input_state && inputType === 2 &&
              <form onSubmit={this.handleSubmit}>
                <div className="skillItem_inputContainer">
                  <div className="typingSend" onClick={() => {this.onSendTyping();}}/>
                  <div className="form-control skillItem_inputbar">
                    { render_inputType2 }
                  </div>
                </div>
              </form>
            }
            {
              !address_input_state && inputType === 3 &&
              <form onSubmit={this.handleSubmit}>
                <div className="skillItem_inputContainer">
                  <div className="typingSend" onClick={() => {this.onSendTyping();}}/>
                  <div className="form-control skillItem_inputbar">
                    { render_inputType3 }
                  </div>
                </div>
              </form>
            }
            {
              !address_input_state && inputType === 4 &&
              <form onSubmit={this.handleSubmit}>
                <div className="skillItem_inputContainer">
                  <div className="typingSend" onClick={() => {this.onSendTyping();}}/>
                  <div className="form-control skillItem_inputbar">
                    { render_inputType4 }
                  </div>
                </div>
              </form>
            }
            {
              !address_input_state && inputType === 5 &&
              <form onSubmit={this.handleSubmit}>
                <div className="skillItem_inputContainer">
                  <div className="typingSend" onClick={() => {this.onSendTyping();}}/>
                  <div className="form-control skillItem_inputbar">
                    { render_inputType5 }
                  </div>
                </div>
              </form>
            }
            {
              address_input_state &&
              <form onSubmit={this.handleSubmit}>
                <div className="inputContainer">
                  {/*<Autocomplete*/}
                    {/*className="form-control inputbar"*/}
                    {/*style={{ width: '100%', height: '50px' }}*/}
                    {/*onPlaceSelected={(place) => {*/}
                      {/*this.localValues.address = place.formatted_address;*/}
                      {/*this.localValues.zipcode = place.address_components.filter(function (it) { return it.types.indexOf('postal_code') != -1;}).map(function (it) {return it.long_name;});*/}
                    {/*}}*/}
                  {/*>*/}
                  {/*</Autocomplete>*/}
                  <form>
                    <PlacesAutocomplete inputProps={inputProps} autocompleteItem={AutocompleteItem} onSelect={this.handleSelect} />
                  </form>
                  <div className="typingSend" onClick={() => {this.onSendTyping();}}/>
                </div>
              </form>
            }
            
            
            
            {/*<div className="content scroll">*/}
              {/*<div className="emptySpace" />*/}
              {/*{*/}
                {/*render_signupflow*/}
              {/*}*/}
              {/*<div className={!address_input_state ? "bottomMargin" : "bottomMargin1"}/>*/}
              {/*{*/}
                {/*!address_input_state &&*/}
                  {/*<form*/}
                    {/*onSubmit={this.handleSubmit}*/}
                  {/*>*/}
                    {/*<div className="inputContainer">*/}
                      {/*<div className="typingSend" onClick={() => {this.onSendTyping();}}/>*/}
                      {/*<input*/}
                        {/*type="text"*/}
                        {/*className="form-control inputbar"*/}
                        {/*id="usr"*/}
                        {/*ref={ref => (this._input = ref)}*/}
                      {/*/>*/}
                    {/*</div>*/}
                  {/*</form>*/}
              {/*}*/}
            {/*</div>*/}
            {/*{*/}
              {/*address_input_state &&*/}
              {/*<form*/}
              {/*>*/}
                {/*<div className="inputContainer1">*/}
                  {/*<div className="typingSend1" onClick={() => {this.onSendTyping_Address();}}/>*/}
                  {/*<Autocomplete*/}
                    {/*className="form-control inputbar"*/}
                    {/*style={{ width: '100%', height: '50px' }}*/}
                    {/*onPlaceSelected={(place) => {*/}
                      {/*this.localValues.address = place.formatted_address;*/}
                      {/*this.localValues.zipcode = place.address_components.filter(function (it) { return it.types.indexOf('postal_code') != -1;}).map(function (it) {return it.long_name;});*/}
                    {/*}}*/}
                  {/*>*/}
                  {/*</Autocomplete>*/}
                {/*</div>*/}
              {/*</form>*/}
            {/*}*/}
          </div>
          <div className="switchContainer">
            <div className="donhaveaccount">
              Already have an account?
            </div>
            <Link to="/signin">
              <div className="signupButton">
                Sign In
              </div>
            </Link>
          </div>
  
  
          <Modal show={showAlert} onHide={this.closeAlert}>
            <Modal.Header closeButton>
              <Modal.Title>
                <h5>Alert</h5>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div>
                { alertText }
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.closeAlert}>Close</Button>
            </Modal.Footer>
          </Modal>
          
          
        </div>
      );
    }
  }
}

Signup.propTypes = {
  updateHeader: PropTypes.func.isRequired
};
