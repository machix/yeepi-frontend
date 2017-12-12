import React, { Component, PropTypes } from 'react';
import { Redirect } from 'react-router';
import "./styles.css";
import "./../../../../public/styles.css";
import config from "./../../../config";
import { reactLocalStorage } from 'reactjs-localstorage';
import { eng, fre } from './../../../lang';
import { Animated } from "react-animated-css";
import { Modal, Button, DropdownButton, MenuItem } from 'react-bootstrap';
import Autocomplete from 'react-google-autocomplete';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import PlacesAutocomplete, { geocodeByPlaceId } from 'react-places-autocomplete'

import Promise from 'promise';
import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';
let superagent = superagentPromise(_superagent, Promise);

const base_url_public = config.baseUrl;

const bankname_arr = {
  "11": "Banque de Montréal (BMO)",
  "12": "Banque Scotia (BNS)",
  "13": "Banque Royale du Canada (RBC)",
  "14": "Banque Toronto-Dominion (TD)",
  "15": "Banque nationale du Canada (BNC)",
  "16": "Banque Canadienne Impériale de Commerce (CIBC)",
  "17": "Banque Laurentienne du Canada (BLC)"
};
const institution_arr = {
  "11": "001",
  "12": "002",
  "13": "003",
  "14": "004",
  "15": "006",
  "16": "010",
  "17": "039"
};

export default class SignupStripe extends Component {
  
  constructor() {
    super();
    this.state = {
      company: false,
      redirect: 0,
      personal_datas: {},
      checked: 0,
      requiredBlanks: false,
      lang: eng,
      showAlert: false,
      alertText: "",
      institutionNumberState: "",
      startDate: moment(),
      address: "",
      placeId: "",
      lat: 0,
      lng: 0,
      zipcode: "",
      sin: "",
      accountnum: "",
      accountnum_re: "",
      transit: "",
      city: "",
      gst_tax: "",
      pst_tax: ""
    };
    this.requests = {
      fetchDatas: () =>
        superagent.post(base_url_public + '/frontend/user/fetchpersonalinfos', { token: reactLocalStorage.get('loggedToken') }).then(res => {
          if (!res.body.result) {
            this.setState({ showAlert: true, alertText: res.body.text })
          } else {
            if (res.body.personal_datas.language === "English") {
              config.language = 0;
              this.props.updateHeader(3);
              this.setState({ personal_datas: res.body.personal_datas, lang: eng })
            } else {
              config.language = 1;
              this.props.updateHeader(3);
              this.setState({ personal_datas: res.body.personal_datas, lang: fre })
            }
          }
        }),
      updateProfile: () =>
        superagent.post(base_url_public + '/frontend/user/updateProfile', {
          token: reactLocalStorage.get('loggedToken'),
          _input_bankname: bankname_arr[this._input_bankname.value],
          _input_accountholder: this._input_accountholder.value,
          _input_institution: institution_arr[this._input_bankname.value],
          _input_bankaddr: this.state.address,
          _input_transit: this.state.transit,
          _input_city: this.state.city,
          zipcode: this.state.zipcode,
          lat: this.state.lat,
          lng: this.state.lng,
          _input_accountnumber: this.state.accountnum,
          _input_birth: `${this.state.startDate.month() + 1}/${this.state.startDate.date()}/${this.state.startDate.year()}`,
          _input_insurance: this.state.sin,
          _input_businessname: this.state.company ? this._input_businessname.value : "",
          _input_gstTax: this.state.company ? this.state.gst_tax : "",
          _input_pstTax: this.state.company ? this.state.pst_tax : "",
          existstripe: true,
        }).then(res => {
          if (!res.body.result) {
            this.setState({ showAlert: true, alertText: res.body.text })
          } else {
            if (this.editProfile) {
              this.setState({ redirect: 2 });
            } else {
              this.setState({ redirect: 1 });
            }
          }
        }),
    }
  }
  
  componentDidMount() {
    this.onFetchPersonalInfos();
    this._input_bankname.value = 11;
    this.setState({ institutionNumberState: "001"});
    this.editProfile = config.editProfile;
    config.editProfile = false;
  }
  
  onFetchPersonalInfos() {
    this.requests.fetchDatas()
  }
  
  toggleCompany = () => {
    const { company } = this.state;
    this.setState({ company: !company });
  };
  
  onNext = () => {
    if (this.state.company) {
      if (
        this._input_accountholder.value === "" ||
        this.state.accountnum === "" ||
        this.state.address === "" ||
        this.state.startDate === "" ||
        this.state.sin === "" ||
        this._input_transit.value === "" ||
        this._input_pstTax.value === "" ||
        this._input_gstTax.value === "" ||
        this.state.transit === ""
      ) {
        this.setState({ requiredBlanks: true });
      } else {
        this.checkValidation();
      }
    } else {
      if (
        this._input_accountholder.value === "" ||
        this.state.accountnum === "" ||
        this.state.address === "" ||
        this.state.startDate === "" ||
        this.state.sin === "" ||
        this.state.transit === ""
      ) {
        this.setState({ requiredBlanks: true });
      } else {
        this.checkValidation();
      }
    }
  };
  
  checkValidation = () => {
    if (!this.checkDigits(this._input_transit.value, 5)) {
      this.setState({ showAlert: true, alertText: "Input the correct transit number" });
      return;
    }
    if (!this.checkDigits(this._input_accountnumber.value, 12)) {
      this.setState({ showAlert: true, alertText: "Input the correct account number" });
      return;
    }
    if (!this.checkDigits(this._input_confirmaccountnumber.value, 12) || (this._input_confirmaccountnumber.value !== this._input_accountnumber.value)) {
      this.setState({ showAlert: true, alertText: "Input the correct confirm account number" });
      return;
    }
    if (!this.checkSocialInsurance(this.state.sin)) {
      this.setState({ showAlert: true, alertText: "Input the correct social insurance number" });
      return;
    }
    if (this.state.company) {
      if (!this.checkDigits(this._input_gstTax.value, 10)) {
        this.setState({ showAlert: true, alertText: "Input the correct GST TAX ID" });
        return;
      }
      if (!this.checkDigits(this._input_pstTax.value, 10)) {
        this.setState({ showAlert: true, alertText: "Input the correct PST TAX ID" });
        return;
      }
    }
    this.requests.updateProfile()
  };
  
  checkDigits = (str, len) => {
    return /^\d+$/.test(str) && str.length === len;
  };
  
  checkSocialInsurance = soc => {
    let array = soc.split('');
    let sum = 0;
    for (let i = 0; i < array.length; i++) {
      if (i % 2 === 0) {
        sum += parseInt(array[i]);
      } else {
        let t = parseInt(array[i]) * 2;
        if (t > 10) {
          let p = t.toString().split('');
          sum += parseInt(p[0]) + parseInt(p[1]);
        } else {
          sum += t;
        }
      }
    }
    return sum % 10 === 0;
  };
  
  onUpdateProfileType = i => {
    if (this.state.checked !== i)
      this.setState({ checked: i });
  };
  
  onUpdateLang = i => {
    if (i === 0) {
      this.setState({ lang: eng });
    } else {
      this.setState({ lang: fre });
    }
  };
  
  onChangeSIN = (text) => {
    if (text.nativeEvent.inputType === "deleteContentBackward") {
      this.setState({ sin: this._input_insurance.value })
    } else {
      if (this._input_insurance.value.length < 10) {
        if (this.checkDigits(text.nativeEvent.data, 1)) {
          this.setState({ sin: this._input_insurance.value })
        }
      }
    }
  };
  
  onChangeAccountNum = (text) => {
    if (text.nativeEvent.inputType === "deleteContentBackward") {
      this.setState({ accountnum: this._input_accountnumber.value })
    } else {
      if (this._input_accountnumber.value.length < 13) {
        if (this.checkDigits(text.nativeEvent.data, 1)) {
          this.setState({ accountnum: this._input_accountnumber.value })
        }
      }
    }
  };
  
  onChangeAccountNum_Re = (text) => {
    if (text.nativeEvent.inputType === "deleteContentBackward") {
      this.setState({ accountnum_re: this._input_confirmaccountnumber.value })
    } else {
      if (this._input_confirmaccountnumber.value.length < 13) {
        if (this.checkDigits(text.nativeEvent.data, 1)) {
          this.setState({ accountnum_re: this._input_confirmaccountnumber.value })
        }
      }
    }
  };
  
  onChangeTransit = (text) => {
    if (text.nativeEvent.inputType === "deleteContentBackward") {
      this.setState({ transit: this._input_transit.value })
    } else {
      if (this._input_transit.value.length < 6) {
        if (this.checkDigits(text.nativeEvent.data, 1)) {
          this.setState({ transit: this._input_transit.value })
        }
      }
    }
  };
  
  onChangeGSTTAX = (text) => {
    if (text.nativeEvent.inputType === "deleteContentBackward") {
      this.setState({ gst_tax: this._input_gstTax.value })
    } else {
      if (this._input_gstTax.value.length < 11) {
        if (this.checkDigits(text.nativeEvent.data, 1)) {
          this.setState({ gst_tax: this._input_gstTax.value })
        }
      }
    }
  };
  
  onChangePSTTAX = (text) => {
    if (text.nativeEvent.inputType === "deleteContentBackward") {
      this.setState({ pst_tax: this._input_pstTax.value })
    } else {
      if (this._input_pstTax.value.length < 11) {
        if (this.checkDigits(text.nativeEvent.data, 1)) {
          this.setState({ pst_tax: this._input_pstTax.value })
        }
      }
    }
  };
  
  onClear = () => {
    this._input_accountholder.value = "";
    this._input_accountnumber.value = "";
    this._input_bankname.value = "";
    if (this.state.company) {
      this._input_businessname.value = "";
      this._input_gstTax.value = "";
      this._input_pstTax.value = "";
    }
    this._input_institution.value = "";
    this._input_confirmaccountnumber.value = "";
    this._input_postalcode.value = "";
    this._input_transit.value = "";
    this._input_insurance.value = "";
    this._input_bankname.value = 11;
  
    this.setState({ sin: "", accountnum: "", accountnum_re: "", institutionNumberState: "001", transit: "", city: "", gst_tax: "", pst_tax: "" });
  };
  
  closeAlert = () => {
    this.setState({ showAlert: false })
  };
  
  onDateChange = (date) => {
    this.setState({
      startDate: date
    });
  };
  
  onChangeBankName = (e) => {
    this.setState({ institutionNumberState: institution_arr[e.target.value]});
  };
  
  onChange = (address) => {
    this.setState({ address });
  };
  
  handleSelect = (address, placeId) => {
    geocodeByPlaceId(placeId)
      .then(results => {
        let zipcode = results[0].address_components.filter(function (it) { return it.types.indexOf('postal_code') != -1;}).map(function (it) {return it.long_name;});
        let city = "";
        for (let i = 0; i < results[0].address_components.length; i++) {
          if (results[0].address_components[i].types[0] === "administrative_area_level_1") {
            city = results[0].address_components[i].long_name;
          }
        }
        this.setState({ address, placeId, zipcode, lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng(), city })
      })
      .catch(error => console.error(error));
  };
  
  render() {
    const {
      requiredBlanks,
      checked,
      company,
      redirect,
      personal_datas,
      lang,
      showAlert,
      alertText,
      institutionNumberState,
      zipcode,
      sin,
      accountnum,
      accountnum_re,
      transit,
      city,
      gst_tax,
      pst_tax
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
    
    if (redirect === 1) {
      return <Redirect push to="/myprofile"/>;
    } else if (redirect === 2) {
      return <Redirect push to="/editprofile/1"/>;
    }
    return (
      <div className="signupstripcontent">
  
        {
          personal_datas.imagePreviewUrl === '' ?
            <div className="col-sm-12 centerContent">
              <div className="avatar" />
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
        
        {
          personal_datas.usertype === 'Both' ?
            <div className="col-sm-12 usernameContent">
              <form>
                <label className="radio-inline">
                  <input type="radio" name="optradio" checked={ checked === 0 } onClick={() => {this.onUpdateProfileType(0);}}/> { lang.tasker_profile }
                </label>
                <label className="radio-inline">
                  <input type="radio" name="optradio" checked={ checked === 1 } onClick={() => {this.onUpdateProfileType(1);}}/> { lang.poster_profile }
                </label>
              </form>
            </div>
            :
            <div className="col-sm-12 usernameContent">
              <form>
                <label className="radio-inline">
                  <input type="radio" name="optradio" checked={ checked === 0 } /> {personal_datas.usertype}
                </label>
              </form>
            </div>
        }
  
        <div className="col-sm-12 usernameContent">
          <form>
            <div className="leftSideContainer">
              <label>{lang.bank_name}</label>
              <label className="redLabel">*</label>
              <form onSubmit={this.handleSubmit}>
                <select
                  type="text"
                  className="form-control"
                  defaultValue={11}
                  ref={ref => (this._input_bankname = ref)}
                  onChange={this.onChangeBankName}
                >
                  <option value={11}>
                    Banque de Montréal (BMO)
                  </option>
                  <option value={12}>
                    Banque Scotia (BNS)
                  </option>
                  <option value={13}>
                    Banque Royale du Canada (RBC)
                  </option>
                  <option value={14}>
                    Banque Toronto-Dominion (TD)
                  </option>
                  <option value={15}>
                    Banque nationale du Canada (BNC)
                  </option>
                  <option value={16}>
                    Banque Canadienne Impériale de Commerce (CIBC)
                  </option>
                  <option value={17}>
                    Banque Laurentienne du Canada (BLC)
                  </option>
                </select>
              </form>
              
              {/*<form onSubmit={this.handleSubmit}>*/}
                {/*<input*/}
                  {/*type="text"*/}
                  {/*className="form-control bankaddr"*/}
                  {/*id="usr"*/}
                  {/*placeholder={ lang.bank_name_placeholder }*/}
                  {/*ref={ref => (this._input_bankname = ref)}*/}
                {/*/>*/}
              {/*</form>*/}
            </div>
            <div className="rightSideContainer">
              <label>{ lang.account_holder_name }</label>
              <label className="redLabel">*</label>
              <form onSubmit={this.handleSubmit}>
                <input
                  type="text"
                  className="form-control bankaddr"
                  id="usr"
                  placeholder={ lang.account_holder_name_placeholder }
                  ref={ref => (this._input_accountholder = ref)}
                />
              </form>
            </div>
          </form>
  
          <form>
            <div className="leftSideContainer">
              <label>{ lang.institution_number }</label>
              <label className="redLabel">*</label>
              <form onSubmit={this.handleSubmit}>
                <input
                  type="text"
                  className="form-control bankaddr"
                  id="usr"
                  disabled={true}
                  ref={ref => (this._input_institution = ref)}
                  value={institutionNumberState}
                />
              </form>
            </div>
            <div className="rightSideContainer">
              <label>{ lang.address_of_the_bank_account }</label>
              <label className="redLabel">*</label>
              <form>
                <PlacesAutocomplete inputProps={inputProps} autocompleteItem={AutocompleteItem} onSelect={this.handleSelect} />
              </form>
            </div>
          </form>
  
          <form>
            <div className="leftSideContainer">
              <label>{ lang.transit_number }</label>
              <label className="redLabel">*</label>
              <form onSubmit={this.handleSubmit}>
                <input
                  type="text"
                  className="form-control bankaddr"
                  id="usr"
                  // placeholder={ lang.transit_number_placeholder }
                  placeholder="00000"
                  ref={ref => (this._input_transit = ref)}
                  value={transit}
                  onChange={this.onChangeTransit}
                />
              </form>
            </div>
            <div className="rightSideContainer">
              <div className="rightDivider1">
                <label>{ lang.city }</label>
                <label className="redLabel">*</label>
                <form onSubmit={this.handleSubmit}>
                  <input
                    type="text"
                    className="form-control bankaddr"
                    id="usr"
                    placeholder={ lang.city_placeholder }
                    value={city}
                  />
                </form>
              </div>
              <div className="rightDivider2">
                <label>{ lang.postal_code }</label>
                <form onSubmit={this.handleSubmit}>
                  <input
                    type="text"
                    className="form-control bankaddr"
                    id="usr"
                    placeholder={ lang.postal_code_placeholder }
                    ref={ref => (this._input_postalcode = ref)}
                    value={zipcode}
                  />
                </form>
              </div>
            </div>
          </form>
  
          <form>
            <div className="leftSideContainer">
              <label>{ lang.account_number }</label>
              <label className="redLabel">*</label>
              <form onSubmit={this.handleSubmit}>
                <input
                  type="text"
                  className="form-control bankaddr"
                  id="usr"
                  // placeholder={ lang.account_number_placeholder }
                  placeholder="000011112222"
                  ref={ref => (this._input_accountnumber = ref)}
                  value={ accountnum }
                  onChange={this.onChangeAccountNum}
                />
              </form>
            </div>
            <div className="rightSideContainer">
              <label>{ lang.date_of_birth }</label>
              <label className="redLabel">*</label>
              {/*<form onSubmit={this.handleSubmit}>*/}
                {/*<input*/}
                  {/*type="text"*/}
                  {/*className="form-control bankaddr"*/}
                  {/*id="usr"*/}
                  {/*placeholder={ lang.date_of_birth_placeholder }*/}
                  {/*ref={ref => (this._input_birth = ref)}*/}
                {/*/>*/}
              {/*</form>*/}
  
              <DatePicker
                selected={this.state.startDate}
                onChange={this.onDateChange}
                className="form-control"
              />
              
              
            </div>
          </form>
  
          <form>
            <div className="leftSideContainer">
              <label>{ lang.re_enter_account_number }</label>
              <label className="redLabel">*</label>
              <form onSubmit={this.handleSubmit}>
                <input
                  type="text"
                  className="form-control bankaddr"
                  id="usr"
                  // placeholder={ lang.re_enter_account_number_placeholder }
                  placeholder="000011112222"
                  ref={ref => (this._input_confirmaccountnumber = ref)}
                  value={ accountnum_re }
                  onChange={this.onChangeAccountNum_Re}
                />
              </form>
            </div>
            <div className="rightSideContainer">
              <label>{ lang.social_insurance_number }</label>
              <label className="redLabel">*</label>
              <form onSubmit={this.handleSubmit}>
                <input
                  type="text"
                  className="form-control bankaddr"
                  id="usr"
                  // placeholder={ lang.social_insurance_number_placeholder }
                  placeholder="130692544"
                  ref={ref => (this._input_insurance = ref)}
                  onChange={this.onChangeSIN}
                  value={sin}
                />
              </form>
            </div>
          </form>
  
          <form>
            <div className="leftSideContainer">
            </div>
            <div className="rightSideContainer">
              <label>{ lang.optional_long_string }</label>
            </div>
          </form>
          
        </div>
  
        <div className="col-sm-12 barContent">
          <div className="smallbar" />
        </div>
  
        <div className="col-sm-12 usernameContent">
          <div className="username">
            {lang.are_you_a_company}
          </div>
          <div className={ company ? "checkon" : "checkoff"} onClick={() => {this.toggleCompany();}} />
        </div>
  
        {
          company &&
          <div className="col-sm-12 usernameContent">
            <form>
              <div className="leftSideContainer">
                <label>{ lang.business_name }</label>
                <label className="redLabel">*</label>
                <form onSubmit={this.handleSubmit}>
                  <input
                    type="text"
                    className="form-control bankaddr"
                    id="usr"
                    placeholder={ lang.business_name_placeholder }
                    ref={ref => (this._input_businessname = ref)}
                  />
                </form>
              </div>
            </form>
          </div>
        }
        
        {
          company &&
          <div className="col-sm-12 usernameContent">
            <form>
              <div className="leftSideContainer">
                <div className="tax1">
                  <label>{ lang.gst_tax_id }</label>
                  <label className="redLabel">*</label>
                  <form onSubmit={this.handleSubmit}>
                    <input
                      type="text"
                      className="form-control bankaddr"
                      id="usr"
                      placeholder={ lang.gst_tax_id_placeholder }
                      ref={ref => (this._input_gstTax = ref)}
                      value={gst_tax}
                      onChange={this.onChangeGSTTAX}
                    />
                  </form>
                </div>
                <div className="tax2">
                  <label>{ lang.pst_tax_id }</label>
                  <label className="redLabel">*</label>
                  <form onSubmit={this.handleSubmit}>
                    <input
                      type="text"
                      className="form-control bankaddr"
                      id="usr"
                      placeholder={ lang.pst_tax_id_placeholder }
                      ref={ref => (this._input_pstTax = ref)}
                      value={pst_tax}
                      onChange={this.onChangePSTTAX}
                    />
                  </form>
                </div>
              </div>
            </form>
          </div>
        }
  
        {
          requiredBlanks &&
            <div className="col-sm-12 usernameContent">
              <Animated animationIn="shake" animationOut="fadeOut" isVisible={true}>
                <div className="username_red">
                  { lang.please_fill_in_the_required_blanks }
                </div>
              </Animated>
            </div>
        }
  
        <div className="col-sm-12 centerContent"/>
        
        <div className="col-sm-12 bottomContent">
          <form>
            <div className="clear" onClick={this.onClear}>Clear</div>
            <div className="next" onClick={() => {this.onNext();}}>Next</div>
          </form>
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

SignupStripe.propTypes = {
  updateHeader: PropTypes.func.isRequired
};
