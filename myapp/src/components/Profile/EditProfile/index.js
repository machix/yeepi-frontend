import React, { PropTypes } from 'react';
import config from "./../../../config";
import { reactLocalStorage } from 'reactjs-localstorage';
import { eng, fre } from './../../../lang';
import { Redirect } from 'react-router';
import { Modal, Button } from 'react-bootstrap';
import PlacesAutocomplete, { geocodeByPlaceId } from 'react-places-autocomplete'
import "./styles.css"

import Promise from 'promise';
import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';
let superagent = superagentPromise(_superagent, Promise);

const base_url_public = config.baseUrl;

export default class EditProfile extends React.Component {
  
  constructor() {
    super();
    this.state = {
      file: '',
      imagePreviewUrl: '',
      personal_datas: {},
      availablelanguage: [],
      lang: eng,
      showModal: false,
      showAlert: false,
      alertText: "",
      redirect: 0,
      userType: 0,
      username: "",
      phonenumber: "",
      address: "",
      placeId: "",
      lat: 0,
      lng: 0,
      zipcode: "",
      portfolio: [],
    };
    this.requests = {
      uploadFileTest: (file) =>
        superagent.post(base_url_public + '/frontend/user/uploadfiletest', { file: file }).then(res => {
          debugger;
          if (!res.body.result) {
            this.setState({ showAlert: true, alertText: res.body.text })
          } else {
          }
        }),
      fetchDatas: () =>
        superagent.post(base_url_public + '/frontend/user/fetchpersonalinfos', { token: reactLocalStorage.get('loggedToken') }).then(res => {
          if (!res.body.result) {
            this.setState({ showAlert: true, alertText: res.body.text })
          } else {
            if (res.body.personal_datas.language === "English") {
              config.language = 0;
              this.props.updateHeader(2);
              let usertype = 0;
              if (res.body.personal_datas.usertype === "Tasker") {
                usertype = 1;
              } else if (res.body.personal_datas.usertype === "Poster") {
                usertype = 2;
              } else {
                usertype = 3;
              }
              // this._input_language.value = "11";
              this.setState({
                personal_datas: res.body.personal_datas,
                lang: eng, userType: usertype,
                username: res.body.personal_datas.username,
                phonenumber: res.body.personal_datas.phonenumber,
                address: res.body.personal_datas.address,
                imagePreviewUrl: res.body.personal_datas.imagePreviewUrl,
                availablelanguage: res.body.personal_datas.availablelanguage,
                portfolio: res.body.personal_datas.portfolio,
              })
            } else {
              config.language = 1;
              this.props.updateHeader(2);
              let usertype = 0;
              if (res.body.personal_datas.usertype === "Tasker") {
                usertype = 1;
              } else if (res.body.personal_datas.usertype === "Poster") {
                usertype = 2;
              } else {
                usertype = 3;
              }
              // this._input_language.value = "12";
              this.setState({
                personal_datas: res.body.personal_datas,
                lang: fre, userType: usertype,
                username: res.body.personal_datas.username,
                phonenumber: res.body.personal_datas.phonenumber,
                address: res.body.personal_datas.address,
                imagePreviewUrl: res.body.personal_datas.imagePreviewUrl,
                availablelanguage: res.body.personal_datas.availablelanguage,
                portfolio: res.body.personal_datas.portfolio
              })
            }
          }
        }),
      updateProfile: () => {
        superagent.post(base_url_public + '/frontend/user/editSave1', {
          token: reactLocalStorage.get('loggedToken'),
          username: this._input_username.value,
          phonenumber: this._input_phonenumber.value,
          address: this.state.address,
          zipcode: this.state.zipcode,
          lat: this.state.lat,
          lng: this.state.lng,
          usertype: this.state.userType,
          language: this.state.lang === eng,
          aboutme: this._input_textarea.value,
          imagePreviewUrl: this.state.imagePreviewUrl,
          availablelanguage: this.state.availablelanguage,
          portfolio: this.state.portfolio
        }).then(res => {
          if (!res.body.result) {
            this.setState({ showAlert: true, alertText: res.body.text })
          } else {
            this.setState({ redirect: 1 });
          }
        })
      }
    };
    this.imageUploadClickState = 0;
  }
  
  componentDidMount() {
    setTimeout(() => {
      this.props.updateHeader(2);
    }, 100);
    this.onFetchPersonalInfos();
  }
  
  onFetchPersonalInfos() {
    this.requests.fetchDatas()
  }
  
  onUploadPicture = () => {
    this.imageUploadClickState = 1;
    this._xxx.click()
  };
  
  onNext = () => {
    this.requests.updateProfile()
  };
  
  _handleSubmit(e) {
    e.preventDefault();
  }
  
  _handleImageChange(e) {
    e.preventDefault();
    
    let reader = new FileReader();
    let file = e.target.files[0];
  
    let data = new FormData();
    data.append('file', file);
    
    reader.onloadend = () => {
      if (file.size > 50 * 1024 * 1024) {
        this.setState({ showAlert: true, alertText: "This file is too big. Please upload another photo." })
      } else {
        if (this.imageUploadClickState === 1) {
          this.setState({
            file: file,
            imagePreviewUrl: reader.result
          });
        } else if (this.imageUploadClickState === 2) {
          let portfolio = this.state.portfolio;
          portfolio.push(
            reader.result
          );
          this.setState({ portfolio })
        }
      }
    };

    reader.readAsDataURL(file)
  }
  
  closeAlert = () => {
    this.setState({ showAlert: false })
  };
  
  onUpdateAccountType = i => {
    this.setState({ userType: i });
  };
  
  onChangeLang = (e) => {
    if (e.target.value === "DoNothing") {
      return;
    }
    let availablelanguage = this.state.availablelanguage;
    availablelanguage.push(e.target.value);
    this.setState({ availablelanguage });
    this._input_language.value = "DoNothing";
  };
  
  onRemoveLang = str => {
    let availablelang = this.state.availablelanguage;
    if (str === "English") {
      if (availablelang.length === 2) {
        this.setState({ availablelanguage: ["French"] })
      } else {
        this.setState({ availablelanguage: [] })
      }
    } else {
      if (availablelang.length === 2) {
        this.setState({ availablelanguage: ["English"] })
      } else {
        this.setState({ availablelanguage: [] })
      }
    }
  };
  
  onChangeUser = text => {
    this.setState({ username: this._input_username.value });
  };
  
  onChangePhoneNumber = text => {
    this.setState({ phonenumber: this.maskedPhoneNumber(this._input_phonenumber.value) });
  };
  
  maskedPhoneNumber = v => {
    let r = v.replace(/\D/g,"");
    if (r.length === 16) {
      r = r.replace(/^(\d{6})(\d{3})(\d{3})(\d{4}).*/, "+$1 ($2) $3-$4");
    } else if (r.length === 15) {
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
    } else if (r.length === 8) {
      r = r.replace(/^(\d{1})(\d{3})(\d{4}).*/,"($1) $2-$3");
    } else if (r.length === 7) {
      r = r.replace(/^(\d{3})(\d{4}).*/,"$1-$2");
    } else if (r.length === 6) {
      r = r.replace(/^(\d{2})(\d{4}).*/,"$1-$2");
    } else if (r.length === 5) {
      r = r.replace(/^(\d{1})(\d{4}).*/,"$1-$2");
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
  
  onUploadPortfolio = () => {
    this.imageUploadClickState = 2;
    this._xxx.click()
  };
  
  render() {
    let {
      imagePreviewUrl,
      showAlert,
      alertText,
      personal_datas,
      userType,
      redirect,
      username,
      phonenumber,
      address,
      availablelanguage,
      portfolio
    } = this.state;
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
    
    let render_restlangs = [];
    let render_langs = [];
    if (availablelanguage.length === 0) {
      render_restlangs.push(
        <option value="English"> English </option>
      );
      render_restlangs.push(
        <option value="French"> French </option>
      );
    } else if (availablelanguage.length === 1) {
      if (availablelanguage[0] === "English") {
        render_restlangs.push(
          <option value="French"> French </option>
        );
      } else {
        render_restlangs.push(
          <option value="English"> English </option>
        );
      }
    }
    
    for (let i = 0; i < availablelanguage.length; i++) {
      render_langs.push(
        <div className="item1" onClick={() => {this.onRemoveLang(availablelanguage[i])}}>
          { availablelanguage[i] }
        </div>
      )
    }
    
    let render_portfolios = [];
    for (let i = 0; i < portfolio.length; i++) {
      render_portfolios.push(
        <div className="addNewPortfolioContain">
          <div className="addNewPortfolio">
            <img className="portfolio_item" src={portfolio[i]} />
          </div>
        </div>
      );
    }
  
    if (redirect === 1) {
      return <Redirect push to="/editprofile/2"/>;
    }
    return (
      <div className="row myprofileContent">
        <div className="col-sm-12 centerContent">
          {
            imagePreviewUrl !== "" ?
              <div className="uploadavatar_exist" onClick={this.onUploadPicture} >
                <img className="avatarUploadedimage" src={imagePreviewUrl} />
              </div>
              :
              <div className="uploadavatar" onClick={this.onUploadPicture} />
          }
          <div>Change my Picture</div>
        </div>
  
        
        <div className="leftRangeContainer bottomPadding">
    
          <div className="leftRange rightPadding">
            <div className="about">
              USER NAME
            </div>
            <label className="redLabel">*</label>
            <form onSubmit={this.handleSubmit}>
              <input
                type="text"
                className="form-control topSmallMargin"
                id="usr"
                placeholder="Eg: First Name"
                ref={ref => (this._input_username = ref)}
                value={username}
                onChange={this.onChangeUser}
              />
            </form>
          </div>
  
          {/*<div className="leftRange rightPadding">*/}
            {/*<div className="about topMargin">*/}
              {/*USER NAME*/}
            {/*</div>*/}
            {/*<label className="redLabel">*</label>*/}
            {/*<form onSubmit={this.handleSubmit}>*/}
              {/*<input*/}
                {/*type="text"*/}
                {/*className="form-control topSmallMargin"*/}
                {/*id="usr"*/}
                {/*placeholder="Eg: Last Name"*/}
                {/*ref={ref => (this._input_username = ref)}*/}
                {/*value={ personal_datas.username }*/}
              {/*/>*/}
            {/*</form>*/}
          {/*</div>*/}
  
          <div className="leftRange rightPadding">
            <div className="about topMargin">
              EMAIL
            </div>
            <label className="redLabel">*</label>
            <form onSubmit={this.handleSubmit}>
              <input
                type="text"
                className="form-control topSmallMargin"
                id="usr"
                placeholder="user@email.com"
                ref={ref => (this._input_email = ref)}
                value={ personal_datas.email }
              />
            </form>
          </div>
  
          <div className="leftRange rightPadding">
            <div className="about topMargin">
              PHONE NUMBER
            </div>
            <form onSubmit={this.handleSubmit}>
              <input
                type="text"
                className="form-control topSmallMargin"
                id="usr"
                placeholder="Eg: +1(574) 808-9765"
                ref={ref => (this._input_phonenumber = ref)}
                value={ phonenumber }
                onChange={this.onChangePhoneNumber}
              />
            </form>
          </div>
  
          <div className="leftRange rightPadding">
            <div className="about topMargin">
              YOUR ADDRESS
            </div>
            {/*<form onSubmit={this.handleSubmit}>*/}
              {/*<input*/}
                {/*type="text"*/}
                {/*className="form-control topSmallMargin"*/}
                {/*id="usr"*/}
                {/*placeholder="Eg: 11-472, Hazel Street, Landmark"*/}
                {/*ref={ref => (this._input_address = ref)}*/}
                {/*value={ address }*/}
                {/*onChange={this.onChangeAddress}*/}
              {/*/>*/}
            {/*</form>*/}
            <form>
              <PlacesAutocomplete inputProps={inputProps} autocompleteItem={AutocompleteItem} onSelect={this.handleSelect} />
            </form>
          </div>
          
          <div className="leftRange">
            <div className="about topMargin2">
              CONNECT THE FOLLOWING:
            </div>
            <div>
              <div className="fb"/>
              <div className="fbText">
              
              </div>
              <div className="connect_editprofile" onClick={() => {this.onVerifiyEmail();}}>Connect</div>
            </div>
          </div>
    
    
        </div>
  
  
        <div className="rightRangeContainer">
    
          <div className="rightRange">
            <div className="rightabout">
              SELECT YOUR ROLE
            </div>
          </div>
  
          <div className="rightRange">
            {
              userType === 1 ?
                <div className="rightRangeContent">
                  <div className="policecheckon"/>
                  <div className="aboutcontent3">
                    TASKER
                  </div>
                </div>
                :
                <div className="rightRangeContent">
                  <div className="policecheckoff" onClick={() => {this.onUpdateAccountType(1);}}/>
                  <div className="aboutcontent3">
                    TASKER
                  </div>
                </div>
            }
            {
              userType === 2 ?
                <div className="rightRangeContent">
                  <div className="policecheckon" />
                  <div className="aboutcontent3">
                    POSTER
                  </div>
                </div>
                :
                <div className="rightRangeContent">
                  <div className="policecheckoff" onClick={() => {this.onUpdateAccountType(2);}}/>
                  <div className="aboutcontent3">
                    POSTER
                  </div>
                </div>
            }
            {
              userType === 3 ?
                <div className="rightRangeContent">
                  <div className="policecheckon" />
                  <div className="aboutcontent3">
                    BOTH
                  </div>
                </div>
                :
                <div className="rightRangeContent">
                  <div className="policecheckoff" onClick={() => {this.onUpdateAccountType(3);}}/>
                  <div className="aboutcontent3">
                    BOTH
                  </div>
                </div>
            }
          </div>
    
          <div className="rightRange topMargin">
            <div className="rightabout">
              SPOKEN LANGUAGES
            </div>
  
            <form>
              <select
                type="text"
                className="form-control topSmallMargin leftMargin"
                ref={ref=>{this._input_language = ref;}}
                onChange={this.onChangeLang}
              >
                <option value="DoNothing">Choose...</option>
                { render_restlangs }
              </select>
            </form>
  
          </div>
  
          <div className="centerLang topMargin">
            {
              render_langs
            }
          </div>
  
          <div className="rightRange topMargin">
            <div className="rightabout">
              DESCRIBE YOURSELF
            </div>
            <textarea className="form-control topSmallMargin leftMargin" rows="5" id="comment" ref={ref=>{this._input_textarea = ref;}}/>
          </div>
  
          <div className="rightRange topMargin">
            
            <div className="rightabout">
              PORTFOLIO
            </div>
            
            <div className="smallfont leftMargin">ADD ITEMS TO YOUR PORTFOLIO. MAXIMUM OF 10 ITEMS.</div>
            
            {
              render_portfolios
            }
            
            {
              portfolio.length < 10 &&
                <div className="addNewPortfolioContain" onClick={this.onUploadPortfolio}>
                  <div className="addNewPortfolio">
                    <img className="addNewPlus"/>
                  </div>
                </div>
            }
            
          </div>
          
        </div>
  
  
        <div className="previewComponent">
          <form onSubmit={(e)=>this._handleSubmit(e)}>
            <input className="fileInput"
                   type="file"
                   ref={ref=>{this._xxx=ref}}
                   onChange={(e)=>this._handleImageChange(e)} />
            <button className="submitButton"
                    type="submit"
                    onClick={(e)=>this._handleSubmit(e)}>Upload Image</button>
          </form>
        </div>
        
        <div className="bottomContent_editProfile">
          <div className="clear" onClick={this.onClear}>Clear</div>
          <div className="next" onClick={() => {this.onNext();}}>Next</div>
        </div>
  
  
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
        
        
      </div>
    );
  }
}

EditProfile.propTypes = {
  updateHeader: PropTypes.func.isRequired
};
