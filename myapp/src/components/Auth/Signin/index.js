/* eslint-disable */
import React, { PropTypes } from 'react';
import { Redirect } from 'react-router';
import Swiper from 'react-id-swiper';
import "./styles.css";
import "./../../../../public/styles.css";
import config from './../../../config';
import {reactLocalStorage} from 'reactjs-localstorage';
import { Link } from 'react-router-dom';
import { Animated } from "react-animated-css";
import { Modal, Button } from 'react-bootstrap';
import LoginHOC from 'react-facebook-login-hoc'
import ip from 'public-ip';
import Loader from 'halogen/PulseLoader';
import applozic from "applozic";

import Promise from 'promise';
import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';
let superagent = superagentPromise(_superagent, Promise);

const base_url_public = config.baseUrl;
const configureLoginProps = {
  scope: 'public_profile',
  xfbml: false,
  cookie: false,
  version: 2.6,
  language: 'en_US',
  appId: '488387194689361'
};

export default class Signin extends React.Component {
  
  constructor() {
    super();
    
    this.params = {
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      }
    };
    
    this.state = {
      pageIndex: 0,
      sendType: 0,
      redirect: 0,
      loginState: 0, // 0: active, 1: inactive, 2: suspended
      showAlert: false,
      alertText: "",
    };
    
    this._code = "";
    this._email = "";
    this._phonenumber = "";
    
    this.requests = {
      signin: (email, pass, ip) =>
        superagent.post(base_url_public + '/frontend/user/login', { email, pass, loginIp: ip }).then(res => {
          if (!res.body.result) {
            this.setState({ showAlert: true, alertText: res.body.text })
          } else {
            config.imagePreviewUrl = res.body.imagePreviewUrl;
            if (res.body.userstatus === "Active") { // can log in
              reactLocalStorage.set('loggedToken', res.body.token);
              this.makeChatUser(res.body.email.toLowerCase(), res.body.username, res.body.signupStep);
            } else if (res.body.userstatus === "Inactive") { // can't log in
              this.setState({ loginState: 1 });
            } else { // suspended
              this.setState({ loginState: 2 });
            }
          }
        }),
      sendforgotcode: (email) =>
        superagent.post(base_url_public + '/frontend/user/sendforgotcode', { email }).then(res => {
          if (!res.body.result) {
            this.setState({ showAlert: true, alertText: res.body.text })
          } else {
            this._code = res.body.code;
            this.setState({ pageIndex: 2 });
          }
        }),
      sendforgotcodewithphone: (phonenumber) =>
        superagent.post(base_url_public + '/frontend/user/phoneverify', { phonenumber }).then(res => {
          if (!res.body.result) {
            this.setState({ showAlert: true, alertText: res.body.text })
          } else {
            this._code = res.body.code;
            this.setState({ pageIndex: 2 });
          }
        }),
      sendforgotreq: (email, newpass) =>
        superagent.post(base_url_public + '/frontend/user/sendforgotreq', { email, newpass }).then(res => {
          if (!res.body.result) {
            this.setState({ showAlert: true, alertText: res.body.text })
          } else {
            this.setState({ pageIndex: 0 }, () => {
              this._inputEmail.value = this._email;
              this._inputPass.value = "";
            });
          }
        }),
    };
    
    this.rollDirection = 'right';
    this._timeout1 = window.setTimeout(() => {this.startRolling()}, config.swiperDuration);
  }
  
  handleSubmit = (e) => {
    e.preventDefault();
    if (this._inputEmail.value === "") {
      this.setState({ showAlert: true, alertText: "Please Input Your Email Address." })
    } else if (this._inputPass.value === "") {
      this.setState({ showAlert: true, alertText: "Please Input Your Password." })
    } else {
      this.onLogin()
    }
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
  
  makeChatUser = (email, username, signupStep) => {
    reactLocalStorage.set('loggedEmail', email);
    reactLocalStorage.set('loggedUsername', username);
    this.setState({ redirect: signupStep, loginState: 0 });
  };
  
  checkLeftEdge = () => {
    return document.getElementsByClassName("swiper-button-prev swiper-button-disabled").length !== 0
  };
  
  checkRightEdge = () => {
    return document.getElementsByClassName("swiper-button-next swiper-button-disabled").length !== 0
  };
  
  componentDidMount() {
    reactLocalStorage.set('sign_state', 'true');
    reactLocalStorage.set('dahsboard_loaded', "false");
    this.props.updateHeader(0);
  }
  
  componentWillUnmount() {
    window.clearTimeout(this._timeout1);
    this._timeout1 = null;
  }
  
  onForgot = () => {
    this.setState({ pageIndex: 1 });
  };
  
  onUpdate = i => {
    const { sendType } = this.state;
    if (sendType !== i) {
      this.setState({ sendType: i });
    }
  };
  
  onSendMe = () => {
    if (this.state.sendType === 1) {
      this._email = this._input_emailorphone.value;
      this.requests.sendforgotcode(this._email)
    } else {
      this._phonenumber = this._input_emailorphone.value;
      this.requests.sendforgotcodewithphone(this._phonenumber)
    }
  };
  
  onVerify = () => {
    if (this._code === " " + this._input_code.value) {
      this.setState({ pageIndex: 3 });
    } else {
      this.setState({ showAlert: true, alertText: "Incorrect Code. Please Try Again." })
      this.setState({ pageIndex: 1 });
    }
  };
  
  onReset = () => {
    if (this._input_newpass.value === "" || this._inputnewpassconf.value === "") {
      this.setState({ showAlert: true, alertText: "Please Fill In The Blanks." })
    } else if (this._input_newpass.value.length < 6) {
      this.setState({ showAlert: true, alertText: "Password Length Should Be At Least 6." })
    } else if (this._input_newpass.value !== this._inputnewpassconf.value) {
      this.setState({ showAlert: true, alertText: "Confirm Password Is Not Matched." })
    } else {
      this.requests.sendforgotreq(this._email, this._input_newpass.value);
    }
  };
  
  onLogin = () => {
    ip.v4().then(ip => {
      const email = this._inputEmail.value;
      const pass = this._inputPass.value;
      this.requests.signin(email, pass, ip);
    });
  };
  
  closeAlert = () => {
    this.setState({ showAlert: false })
  };
  
  render() {
    const { pageIndex, sendType, redirect, loginState, showAlert, alertText } = this.state;
    if (redirect === 1) {
      return <Redirect push to="/signup/stripe" />;
    } else if (redirect === 2) {
      return <Redirect push to="/dashboard" />;
    }
    return (
      <div>
        
        {/*<div className="loadingbar">*/}
          {/*<Loader color="#26A65B" size="16px" margin="4px"/>*/}
        {/*</div>*/}
        
        <div className="row basicontainer">
          <div className="col-sm-5 basicontainer1">
            <Swiper
              {...this.params}
            >
              <div className="image1" />
              <div className="image2" />
              <div className="image3" />
              <div className="image4" />
              <div className="image5" />
              <div className="image6" />
            </Swiper>
          </div>
          {
            pageIndex === 0 ?
              <div className="col-sm-7 basicontainer1">
                <div className="signinContent">
                  <div className="leftSideContainer">
            
                    <h4 className="title1">Login to your account</h4>
            
                    <form>
                      <div className="title1">Email Address</div>
                      <form onSubmit={this.handleSubmit}>
                        <input
                          type="text"
                          className="form-control pass"
                          id="usr"
                          ref={ref => (this._inputEmail = ref)}
                        />
                      </form>
                    </form>
            
                    <form>
                      <div className="title1">Password</div>
                      <form onSubmit={this.handleSubmit}>
                        <input
                          type="password"
                          className="form-control pass"
                          id="usr"
                          ref={ref => (this._inputPass = ref)}
                        />
                      </form>
                    </form>
            
                    <h6 className="forgot" onClick={() => { this.onForgot(); }}>Forgot password?</h6>
          
                  </div>
                </div>
        
                {
                  loginState === 1 &&
                  <Animated animationIn="shake" animationOut="fadeOut" isVisible={true}>
                    <div className="suspendState">
                      Your account is inactive.
                    </div>
                  </Animated>
                }
                {
                  loginState === 2 &&
                  <Animated animationIn="shake" animationOut="fadeOut" isVisible={true}>
                    <div className="suspendState">
                      Your account is suspended.
                    </div>
                  </Animated>
                }
        
                <div className="loginViewContainer">
                  <div className="loginBtn" onClick={() => {this.onLogin();}}>Login</div>
                </div>
        
                <div className="loginViewContainer">
                  <div className="loginBar" />
                </div>
        
                <div className="loginViewContainer">
                  <div className="fb">
                  </div>
                  <div className="fbText">
                    Login with facebook
                  </div>
                </div>
      
              </div>
      
              :
      
              pageIndex === 1 ?
                <div className="col-sm-7 basicontainer1">
                  <div className="signinContent">
                    <div className="leftSideContainer">
              
                      <h4 className="title1">Forgot Password?</h4>
              
                      <form>
                        <div className="title2" />
                      </form>
              
                      <form>
                        <div className="title2">Enter your email or mobile number.</div>
                      </form>
              
                      <form>
                        <div className="title2">We will send instructions to reset your password in the form of a secret code.password.</div>
                      </form>
              
                      <form>
                        <div className="title2" />
                      </form>
              
                      <form>
                        <label className="radio-inline">
                          <input type="radio" name="optradio" checked={sendType === 0} onClick={() => {this.onUpdate(0);}} /> Phone Number
                        </label>
                        <label className="radio-inline">
                        </label>
                        <label className="radio-inline">
                          <input type="radio" name="optradio" checked={sendType === 1} onClick={() => {this.onUpdate(1);}} /> Email
                        </label>
                      </form>
              
                      <form>
                        <div className="title2" />
                      </form>
              
                      <form>
                        <div className="title1">{ sendType === 0 ? "ENTER YOUR PHONE NUMBER" : "ENTER YOUR EMAIL" }</div>
                        <form onSubmit={this.handleSubmit}>
                          <input
                            type="text"
                            className="form-control pass"
                            id="usr"
                            placeholder={sendType === 0 ? "eg: +1 (514) 888-8888" : "eg: youremail@email.com"}
                            ref={ref => (this._input_emailorphone = ref)}
                          />
                        </form>
                      </form>
            
                    </div>
                  </div>
          
                  <div className="loginViewContainer">
                    <div className="sendCodeBtn" onClick={() => {this.onSendMe();}}>Send me the Code</div>
                  </div>
        
                </div>
        
                :
        
                pageIndex === 2 ?
          
                  <div className="col-sm-7 basicontainer1">
                    <div className="signinContent">
                      <div className="leftSideContainer">
                
                        <h4 className="title1">Forgot Password?</h4>
                
                        <form>
                          <div className="title2" />
                        </form>
                
                        <form>
                          <div className="title2">Enter the secret code sent to your phone or email below and reset your password</div>
                        </form>
                
                        <form>
                          <div className="title2" />
                        </form>
                
                        <form>
                          <div className="title1">ENTER YOUR SECRET CODE</div>
                          <form onSubmit={this.handleSubmit}>
                            <input
                              type="text"
                              className="form-control pass"
                              id="usr"
                              placeholder="code"
                              ref={ref => (this._input_code = ref)}
                            />
                          </form>
                        </form>
              
                      </div>
                    </div>
            
                    <div className="loginViewContainer">
                      <div className="sendCodeBtn" onClick={() => {this.onVerify();}}>Verify</div>
                    </div>
          
                  </div>
          
                  :
          
                  <div className="col-sm-7 basicontainer1">
                    <div className="signinContent">
                      <div className="leftSideContainer">
                
                        <h4 className="title1">Reset your password</h4>
                
                        {/*<form>*/}
                        {/*<div className="title1">ENTER CURRENT PASSWORD</div>*/}
                        {/*<form onSubmit={this.handleSubmit}>*/}
                        {/*<input*/}
                        {/*type="text"*/}
                        {/*className="form-control pass"*/}
                        {/*id="usr"*/}
                        {/*ref={ref => (this._input_currentpass = ref)}*/}
                        {/*/>*/}
                        {/*</form>*/}
                        {/*</form>*/}
                
                        <form>
                          <div className="title1">ENTER NEW PASSWORD</div>
                          <form onSubmit={this.handleSubmit}>
                            <input
                              type="password"
                              className="form-control pass"
                              id="usr"
                              ref={ref => (this._input_newpass = ref)}
                            />
                          </form>
                        </form>
                
                        <form>
                          <div className="title1">CONFIRM PASSWORD</div>
                          <form onSubmit={this.handleSubmit}>
                            <input
                              type="password"
                              className="form-control pass"
                              id="usr"
                              ref={ref => (this._inputnewpassconf = ref)}
                            />
                          </form>
                        </form>
              
                      </div>
                    </div>
            
                    <div className="loginViewContainer">
                      <div className="sendCodeBtn" onClick={() => {this.onReset();}}>Reset</div>
                    </div>
          
                  </div>
          }
          <div className="switchContainer">
            <div className="donhaveaccount">
              Don't have an account?
            </div>
            <Link to="/signup">
              <div className="signupButton">
                Sign Up
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
  
        
  
      </div>
    );
  }
}

Signin.propTypes = {
  updateHeader: PropTypes.func.isRequired
};
