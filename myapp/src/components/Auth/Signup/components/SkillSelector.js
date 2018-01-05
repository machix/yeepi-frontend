import React, { Component, PropTypes } from 'react';
import './styles.css';

import Promise from 'promise';
import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';
let superagent = superagentPromise(_superagent, Promise);
import config from './../../../../config';

const base_url_public = config.baseUrl;

export default class SkillSelector extends Component {
  
  constructor() {
    super();
    this.state = {
      skillList: [],
      skillSelectList: [],
    };
    this.requests = {
      fetchDatas: () =>
        superagent.post(base_url_public + '/frontend/services/list', {}).then(res => {
          let data = JSON.parse(res.text);
          let skillList = [];
          let skillSelectList = [];
          for (let i = 0; i < data.services.length; i++) {
            skillList.push(data.services[i].service);
            skillSelectList.push(false);
          }
          this.setState({ skillList, skillSelectList })
        }),
    };
  }
  
  componentDidMount() {
    // this.requests.fetchDatas();
    let skillList = [
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
    let skillSelectList = [];
    for (let i = 0; i < 10; i++) {
      skillSelectList.push(false);
    }
    this.setState({ skillList, skillSelectList })
  }
  
  setItem(i) {
    let skillList = this.state.skillList;
    let skillSelectList = this.state.skillSelectList;
    skillSelectList[i] = !skillSelectList[i];
    this.setState({ skillSelectList });
    
    let list = [];
    for (let i = 0; i < skillSelectList.length; i++) {
      if (skillSelectList[i]) {
        list.push(skillList[i]);
      }
    }
    this.props.updateSkills(list)
  }
  
  render() {
    const { skillList, skillSelectList } = this.state;
    let render_skills = [];
    for (let i = 0; i < skillList.length; i++) {
      let res = skillList[i].split(" ");
      render_skills.push(
        <div className={ skillSelectList[i] ? "item_tickon_big" : "item_tickoff_big"} onClick={() => { this.setItem(i); }}>
          { res[0] }
        </div>
      )
    }
    return (
        <div className="typeContainer">
          { render_skills }
        </div>
    );
  }
}

SkillSelector.propTypes = {
  updateSkills: PropTypes.func.isRequired
};
