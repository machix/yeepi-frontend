import React, { PropTypes } from 'react';
import "./styles.css";
import "./../../../../public/styles.css";
import config from "./../../../config";
import { reactLocalStorage } from 'reactjs-localstorage';
import { FacebookLogin } from 'react-facebook-login-component';
import { Modal, Button } from 'react-bootstrap';
import { eng, fre } from './../../../lang';
import { Redirect } from 'react-router';

import Promise from 'promise';
import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';
let superagent = superagentPromise(_superagent, Promise);

const base_url_public = config.baseUrl;

export default class MyProfile extends React.Component {
  
  constructor() {
    super();
    this.state = {
      phoneverified: false,
      fbConnected: false,
      personal_datas: {},
      showModal: false,
      lang: eng,
      showAlert: false,
      alertText: "",
      redirect: 0,
      portfolio: [],
    };
    this._phonecode = "";
    this.requests = {
      fetchDatas: () =>
        superagent.post(base_url_public + '/frontend/user/fetchpersonalinfos', { token: reactLocalStorage.get('loggedToken') }).then(res => {
          debugger;
          if (!res.body.result) {
            this.setState({ showAlert: true, alertText: res.body.text })
          } else {
            config.imagePreviewUrl = res.body.personal_datas.imagePreviewUrl;
            if (res.body.personal_datas.language === "English") {
              config.language = 0;
              this.props.updateHeader(2);
              this.setState({ personal_datas: res.body.personal_datas, lang: eng, portfolio: res.body.personal_datas.portfolio })
            } else {
              config.language = 1;
              this.props.updateHeader(2);
              this.setState({ personal_datas: res.body.personal_datas, lang: fre, portfolio: res.body.personal_datas.portfolio })
            }
          }
        }),
      updateFaceBookAccount: (fb_id, fb_email, fb_name, fb_accessToken) =>
        superagent.post(base_url_public + '/frontend/user/updateFB', { token: reactLocalStorage.get('loggedToken'), fb_id, fb_email, fb_name, fb_accessToken }).then(res => {
          if (!res.body.result) {
            this.setState({ showAlert: true, alertText: res.body.text })
          } else {
            this.setState({ personal_datas: res.body.personal_datas })
          }
        }),
      phoneVerify: (phone_number) =>
        superagent.post(base_url_public + '/frontend/user/phoneverify', { phonenumber: phone_number }).then(res => {
          if (!res.body.result) {
            this.setState({ showAlert: true, alertText: res.body.text })
          } else {
            this._phonecode = res.body.code;
            console.info(this._phonecode);
            this.setState({ showModal: true })
          }
        }),
      phoneVerifyStep2: () =>
        superagent.post(base_url_public + '/frontend/user/phoneverifyinprofile', { token: reactLocalStorage.get('loggedToken') }).then(res => {
          if (!res.body.result) {
            this.setState({ showAlert: true, alertText: res.body.text })
          } else {
            if (" " + this._input_phonecode.value === this._phonecode) {
              this.setState({ showModal: false, personal_datas: res.body.personal_datas })
            } else {
              this.setState({ showAlert: true, alertText: "code is incorrect" })
            }
          }
        }),
    }
  }
  
  componentDidMount() {
    this.onFetchPersonalInfos();
  }
  
  onVerifiyEmail = () => {
    // this.setState({ emailverified: true });
  };
  
  onVerifyPhone = () => {
    if (this.state.personal_datas.phonenumber === "") {
      this.setState({ showAlert: true, alertText: "you didn't enter phone number. please edit your profile" })
    } else {
      this.requests.phoneVerify(this.state.personal_datas.phonenumber);
    }
  };
  
  onFetchPersonalInfos() {
    this.requests.fetchDatas()
  }
  
  responseFacebook = response => {
    console.log(response);
    //anything else you want to do(save to localStorage)...
    this.requests.updateFaceBookAccount(response.id, response.email, response.name, response.accessToken)
  };
  
  close = () => {
    this.setState({ showModal: false });
  };
  
  onCheckVerifyCode = () => {
    this.requests.phoneVerifyStep2()
  };
  
  onUpdateLang = i => {
    if (i === 0) {
      this.setState({ lang: eng });
    } else {
      this.setState({ lang: fre });
    }
  };
  
  closeAlert = () => {
    this.setState({ showAlert: false })
  };
  
  onEditProfile = () => {
    config.editProfile = true;
    this.setState({ redirect: 1 });
  };
  
  render() {
    const {
      personal_datas,
      lang,
      showAlert,
      alertText,
      redirect,
      portfolio
    } = this.state;
    
    let render_skills = [];
    for (let item in personal_datas.skill) {
      render_skills.push(
        <div className="rightaboutcontent">
          {personal_datas.skill[item]}
        </div>
      )
    }
    
    let render_langs = [];
    for (let item in personal_datas.availablelanguage) {
      render_langs.push(
        <div className="rightaboutcontent">
          {personal_datas.availablelanguage[item]}
        </div>
      )
    }
  
    let render_trans = [];
    for (let item in personal_datas.transportation) {
      render_trans.push(
        <div className="rightaboutcontent">
          {personal_datas.transportation[item]}
        </div>
      )
    }
    
  
    if (redirect === 1) {
      return <Redirect push to="/editprofile/1"/>;
    }
    
    let render_portfolio = [];
    for (let i = 0; i < portfolio.length; i++) {
      render_portfolio.push(
        <div className="myprofile_portfolio_container">
          <div className="addNewPortfolio">
            <img className="portfolio_item" src={portfolio[i]} />
          </div>
        </div>
      );
    }
    
    return (
      <div className="row myprofileContent">
    
        {
          personal_datas.imagePreviewUrl === '' ?
            <div className="col-sm-12 centerContent">
              <div className="avatar_null" />
            </div>
            :
            <div className="col-sm-12 centerContent">
              <img className="avatarUploadedimage" src={personal_datas.imagePreviewUrl} />
            </div>
        }
        
    
        <div className="col-sm-12 usernameContent">
          <div className="username">
            { personal_datas.username }
          </div>
        </div>
        
        <div className="col-sm-12 usernameContent">
          <div className="smallbar1" />
        </div>
  
        <div className="leftRangeContainer">
          
          <div className="leftRange">
            <div className="about">
              { lang.about_me }
            </div>
          </div>
  
          <div className="leftRange">
            <div className="aboutcontent">
              { personal_datas.aboutme }
            </div>
          </div>
          
          <div className="leftRange">
            <div className="smallbar2"/>
          </div>
  
          <div className="leftRange">
            <div className="about">
              {lang.email}
            </div>
            {
              personal_datas.emailverified ?
                <div>
                  <div className="roundCheck1"/>
                  <div className="emailconfirmedtext">{lang.confirmed}</div>
                </div>
                :
                <div className="emailverify" onClick={() => {this.onVerifiyEmail();}}>{lang.verify}</div>
            }
          </div>
  
          <div className="leftRange">
            <div className="aboutcontent">
              { personal_datas.email }
            </div>
          </div>
  
          
          <div className="leftRange">
            <div className="about">
              { lang.phone_number }
            </div>
            {
              personal_datas.phoneverified ?
                <div>
                  <div className="roundCheck2"/>
                  <div className="phoneconfirmedtext">{lang.confirmed}</div>
                </div>
                :
                <div className="phoneverify" onClick={() => {this.onVerifyPhone();}}>{lang.verify}</div>
            }
          </div>
  
          <div className="leftRange">
            <div className="aboutcontent">
              {/*{ personal_datas.phoneverified ? personal_datas.phonenumber : "+0(000)-000-0000"}*/}
              { personal_datas.phonenumber }
            </div>
          </div>
  
          <div className="leftRange">
            <div className="smallbar2"/>
          </div>
  
          <div className="leftRange">
            <div className="about">
              { lang.address }
            </div>
          </div>
  
          <div className="leftRange">
            <div className="aboutcontent">
              { personal_datas.address }
            </div>
          </div>
  
          <div className="leftRange">
            <div className="smallbar2"/>
          </div>
  
          <div className="leftRange">
            <div className="about">
              { lang.connected_on_facebook }
            </div>
          </div>
  
          <div className="leftRange">
            <div className="fb"/>
            <div className="fbText">
              { personal_datas.fb_name }
            </div>
            {
              personal_datas.fbverified ?
                <div className="fbConnect"> { lang.connected } </div>
                :
                <FacebookLogin
                  socialId="151871885544645"
                  language="en_US"
                  scope="public_profile,email"
                  responseHandler={this.responseFacebook}
                  xfbml={true}
                  fields="id,email,name"
                  version="v2.5"
                  className="fbConnect"
                  buttonText={lang.connect}/>
            }
            
          </div>
  
          
  
          <div className="leftRange">
            <div className="smallbar2"/>
          </div>
  
          <div className="leftRange">
            <div className="about">
              { lang.portfolio }
            </div>
          </div>
  
          <div className="leftRange">
            {
              render_portfolio
            }
          </div>
          
          
          
        </div>
  
        
        <div className="rightRangeContainer">
          
          <div className="rightRange">
            <div className="rightabout">
              { lang.spoken_languages }
            </div>
          </div>
  
          <div className="rightRange">
            { render_langs }
          </div>
  
          <div className="col-sm-12">
            <div className="smallbar1" />
          </div>
  
          <div className="rightRange">
            <div className="rightabout">
              { lang.skills }
            </div>
          </div>
  
          <div className="rightRange">
            { render_skills }
          </div>
  
          <div className="col-sm-12">
            <div className="smallbar1" />
          </div>
  
  
          <div className="rightRange">
            <div className="rightabout">
              { lang.transport }
            </div>
          </div>
  
          <div className="rightRange">
            { render_trans }
          </div>
  
          <div className="col-sm-12">
            <div className="smallbar1" />
          </div>
          
          <div className="rightRange">
            <div className="rightabout">
              { lang.rbq_license_number }
            </div>
          </div>
  
          <div className="rightRange">
            <div className="aboutcontent2">
              {personal_datas.rbqLicenceNumber}
            </div>
          </div>
  
          <div className="rightRange">
            {
              personal_datas.policecheck ? <div className="policecheck"/> : <div className="policecheckoff"/>
            }
            <div className="aboutcontent3">
              { lang.police_check_required }
            </div>
          </div>
  
          <div className="rightRange">
            <div className="aboutcontent4">
              { lang.your_app_is_under_processing }
            </div>
          </div>
  
          <div className="col-sm-12">
            <div className="smallbar1" />
          </div>
  
  
          <div className="rightRange">
            <div className="rightabout">
              { lang.reviews }
            </div>
          </div>
  
          <div className="rightRange">
            <div className="aboutcontent2">
              { lang.no_reviews_to_show }
            </div>
          </div>
          
          
        </div>
  
  
        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>
              <div>Verify Phone Number</div>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="verifyContainer">
              <div className="secode">{lang.enter_secret_code_long_string}</div>
            </div>
            <br/>
            <div className="verifyContainer">
              <div className="secode">{lang.enter_secret_code_short_string}</div>
            </div>
            <div className="verifyContainer">
              <input
                type="text"
                className="form-control"
                id="usr"
                placeholder="Eg: ****"
                ref={ref => (this._input_phonecode = ref)}
              />
            </div>
            <br/>
            <div className="verifyContainer">
              <div className="modalverify" onClick={() => {this.onCheckVerifyCode();}}>{ lang.verify }</div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.close}>{lang.close}</Button>
          </Modal.Footer>
        </Modal>
  
  
        <Modal show={showAlert} onHide={this.closeAlert}>
          <Modal.Header closeButton>
            <Modal.Title>
              <div>Alert</div>
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
  
        <div className="editprofile" onClick={() => {this.onEditProfile();}}>Edit Profile</div>
      </div>
    );
  }
}

MyProfile.propTypes = {
  updateHeader: PropTypes.func.isRequired
};
