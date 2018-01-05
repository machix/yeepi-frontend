import React, { Component, PropTypes } from 'react';
import './styles.css';

import Promise from 'promise';
import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';
let superagent = superagentPromise(_superagent, Promise);
import config from './../../../../config';

const base_url_public = config.baseUrl;

export default class LangSelector extends Component {
  
  constructor() {
    super();
    this.state = {
      langList: [],
      langSelectList: [],
    };
    this.requests = {
      fetchDatas: () =>
        superagent.post(base_url_public + '/frontend/langs/list', {}).then(res => {
          let data = JSON.parse(res.text);
          let langList = [];
          let langSelectList = [];
          for (let i = 0; i < data.langs.length; i++) {
            langList.push(data.langs[i].lang);
            langSelectList.push(false);
          }
          this.setState({ langList, langSelectList })
        }),
    };
  }
  
  componentDidMount() {
    // this.requests.fetchDatas()
    let langList = [
      "English",
      "French"
    ];
    let langSelectList = [];
    for (let i = 0; i < 2; i++) {
      langSelectList.push(false);
    }
    this.setState({ langList, langSelectList })
  }
  
  setItem(i) {
    let langList = this.state.langList;
    let langSelectList = this.state.langSelectList;
    langSelectList[i] = !langSelectList[i];
    this.setState({ langSelectList });
  
    let list = [];
    for (let i = 0; i < langSelectList.length; i++) {
      if (langSelectList[i]) {
        list.push(langList[i]);
      }
    }
    this.props.updateLang(list)
  }
  
  render() {
    const { langList, langSelectList } = this.state;
    let render_langs = [];
    for (let i = 0; i < langList.length; i++) {
      render_langs.push(
        <div className={ langSelectList[i] ? "item_tickon" : "item_tickoff"} onClick={() => { this.setItem(i); }}>
          { langList[i] }
        </div>
      )
    }
    return (
      <div className="typeContainer">
        { render_langs }
      </div>
    );
  }
}

LangSelector.propTypes = {
  updateLang: PropTypes.func.isRequired
};
