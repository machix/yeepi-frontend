import React, { PropTypes } from 'react';
import config from "./../../../config";
import { reactLocalStorage } from 'reactjs-localstorage';
import { eng, fre } from './../../../lang';
import { Redirect } from 'react-router';
import { Modal, Button } from 'react-bootstrap';
import "./../EditProfile/styles.css"
import "./styles.css"

import Promise from 'promise';
import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';
let superagent = superagentPromise(_superagent, Promise);

const base_url_public = config.baseUrl;

const skillList = [
  "House Cleaning",
  "Assembly Services",
  "Handyman",
  "Delivery",
  "Gardening",
  "Support",
  "Beauty & Care",
  "Photography",
  "Decoration",
  "Other Services"
];

const transList = [
  "Car",
  "Truck",
  "Scooter",
  "Bicycle"
];

export default class EditProfile2 extends React.Component {
  
  constructor() {
    super();
    this.state = {
      file: '',
      imagePreviewUrl: '',
      personal_datas: {},
      lang: eng,
      showModal: false,
      showAlert: false,
      alertText: "",
      redirect: 0,
      userType: 0,
      username: "",
      skill: [],
      trans: [],
      policecheck: false,
    };
    this.requests = {
      fetchDatas: () =>
        superagent.post(base_url_public + '/frontend/user/fetchpersonalinfos', { token: reactLocalStorage.get('loggedToken') }).then(res => {
          if (!res.body.result) {
            this.setState({ showAlert: true, alertText: res.body.text })
          } else {
            if (res.body.personal_datas.language === "English") {
              config.language = 0;
              this.props.updateHeader(2);
              this.setState({ personal_datas: res.body.personal_datas, lang: eng,
                username: res.body.personal_datas.username,
                skill: res.body.personal_datas.skill,
                trans: res.body.personal_datas.transportation,
                policecheck: res.body.personal_datas.policecheck,
              })
            } else {
              config.language = 1;
              this.props.updateHeader(2);
              this.setState({ personal_datas: res.body.personal_datas, lang: fre,
                username: res.body.personal_datas.username,
                skill: res.body.personal_datas.skill,
                trans: res.body.personal_datas.transportation,
                policecheck: res.body.personal_datas.policecheck,
              })
            }
          }
        }),
      updateProfile: () => {
        debugger;
        superagent.post(base_url_public + '/frontend/user/editSave2', {
          token: reactLocalStorage.get('loggedToken'),
          skill: this.state.skill,
          trans: this.state.trans,
          rbq: this._ref_rbq.value,
          policecheck: this.state.policecheck
        }).then(res => {
          if (!res.body.result) {
            this.setState({ showAlert: true, alertText: res.body.text })
          } else {
            this.setState({ redirect: 1 });
          }
        })
      }
    }
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
  
  closeAlert = () => {
    this.setState({ showAlert: false })
  };
  
  onDone = () => {
    this.requests.updateProfile();
  };
  
  onRemoveSkill = i => {
    let skill = this.state.skill;
    let afterskill = [];
    for (let j = 0; j < skill.length; j++) {
      if (i !== j) {
        afterskill.push(skill[j])
      }
    }
    this.setState({ skill: afterskill })
  };
  
  checkInList = (str, ary) => {
    for (let i = 0; i < ary.length; i++) {
      if (str === ary[i]) {
        return true;
      }
    }
    return false;
  };
  
  onChangeSkill = (e) => {
    if (e.target.value === "DoNothing") {
      return;
    }
    let skill = this.state.skill;
    skill.push(e.target.value);
    this.setState({ skill: skill });
    this._ref_select1.value = "DoNothing";
  };
  
  
  onRemoveTrans = i => {
    let trans = this.state.trans;
    let aftertrans = [];
    for (let j = 0; j < trans.length; j++) {
      if (i !== j) {
        aftertrans.push(trans[j])
      }
    }
    this.setState({ trans: aftertrans })
  };
  
  onChangeTrans = (e) => {
    if (e.target.value === "DoNothing") {
      return;
    }
    let trans = this.state.trans;
    trans.push(e.target.value);
    this.setState({ trans: trans });
    this._ref_select2.value = "DoNothing";
  };
  
  onPoliceCheck = () => {
    let policecheck = this.state.policecheck;
    this.setState({ policecheck: !policecheck })
  };
  
  render() {
    let { showAlert, alertText, personal_datas, redirect, skill, trans, policecheck } = this.state;
    
    let render_skills = [];
    for (let i = 0; i < skill.length; i++) {
      render_skills.push(
        <div className="item1" onClick={() => {this.onRemoveSkill(i)}}>
          { skill[i] }
          {/*<div className="item1_X">X</div>*/}
        </div>
      )
    }
    
    let render_restskills = [];
    for (let i = 0; i < skillList.length; i++) {
      if (!this.checkInList(skillList[i], skill)) {
        render_restskills.push(
          <option value={skillList[i]}>{skillList[i]}</option>
        )
      }
    }
  
    let render_trans = [];
    for (let i = 0; i < trans.length; i++) {
      render_trans.push(
        <div className="item1" onClick={() => {this.onRemoveTrans(i)}}>
          { trans[i] }
        </div>
      )
    }
  
    let render_resttrans = [];
    for (let i = 0; i < transList.length; i++) {
      if (!this.checkInList(transList[i], trans)) {
        render_resttrans.push(
          <option value={transList[i]}>{transList[i]}</option>
        )
      }
    }
    
    if (redirect === 1) {
      return <Redirect push to="/myprofile"/>;
    }
    return (
      <div className="row myprofileContent">
  
        <div className="col-sm-12 centerContent">
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
        </div>
  
        <div className="col-sm-12 usernameContent">
          <div className="username">
            Alex
          </div>
        </div>
  
  
        <div className="col-sm-12 editprofile2_centerContent">
          <div className="editprofile2_addskills">
            ADD SKILLS
          </div>
        </div>
        
        <div className="col-sm-12 editprofile2_centerContent">
          <select className="form-control editprofile2_addskills" onChange={this.onChangeSkill} ref={ref=>{this._ref_select1 = ref;}}>
            <option value="DoNothing">Choose...</option>
            { render_restskills }
          </select>
        </div>
  
        <div className="editprofile2_centerContent1">
          { render_skills }
        </div>
  
        <div className="col-sm-12 editprofile2_centerContent">
          <div className="editprofile2_addskills">
            ADD TRANS
          </div>
        </div>
  
        <div className="col-sm-12 editprofile2_centerContent">
          <select className="form-control editprofile2_addskills" onChange={this.onChangeTrans} ref={ref=>{this._ref_select2 = ref;}}>
            <option value="DoNothing">Choose...</option>
            { render_resttrans }
          </select>
        </div>
  
        <div className="editprofile2_centerContent1">
          {render_trans}
        </div>
  
  
        <div className="col-sm-12 editprofile2_centerContent">
          <div className="editprofile2_addskills">
            RBQ LICENSE NUMBER
          </div>
        </div>
  
        <div className="col-sm-12 editprofile2_centerContent">
          <input className="form-control editprofile2_addskills" ref={ref=>{this._ref_rbq = ref;}}>
          </input>
        </div>
  
        <div className="col-sm-12 editprofile2_centerContent">
          <div className="editprofile2_divider"/>
        </div>
  
        <div className="col-sm-12 editprofile2_centerContent">
          <div className={policecheck ? "policecheck_editprofile2" : "policecheck_editprofile2_off"} onClick={this.onPoliceCheck}/>
          <div className="editprofile2_policecheck">
            POLICE CHECK REQUIRED?
          </div>
        </div>
  
        <div className="col-sm-12 editprofile2_centerContent">
          <div className="editprofile2_policecheck">
            Check discription...
          </div>
        </div>
        
        
        <div className="bottomContent_editProfile">
          <div className="clear" onClick={this.onClear}>Clear</div>
          <div className="next" onClick={() => {this.onDone();}}>Done</div>
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

EditProfile2.propTypes = {
  updateHeader: PropTypes.func.isRequired
};
