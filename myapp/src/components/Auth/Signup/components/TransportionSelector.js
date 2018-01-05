import React, { Component, PropTypes } from 'react';
import './styles.css';

import Promise from 'promise';
import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';
let superagent = superagentPromise(_superagent, Promise);
import config from './../../../../config';

const base_url_public = config.baseUrl;

export default class TransportionSelector extends Component {
  
  constructor() {
    super();
    this.state = {
      transList: [],
      transSelectList: [],
    };
    this.requests = {
      fetchDatas: () =>
        superagent.post(base_url_public + '/frontend/trans/list', {}).then(res => {
          let data = JSON.parse(res.text);
          let transList = [];
          let transSelectList = [];
          for (let i = 0; i < data.trans.length; i++) {
            transList.push(data.trans[i].vehiclename);
            transSelectList.push(false);
          }
          this.setState({ transList, transSelectList })
        }),
    };
  }
  
  componentDidMount() {
    // this.requests.fetchDatas()
    const transList = [
      "Car",
      "Truck",
      "Scooter",
      "Bicycle"
    ];
    let transSelectList = [];
    for (let i = 0; i < 4; i++) {
      transSelectList.push(false);
    }
    this.setState({ transList, transSelectList })
  }
  
  setItem(i) {
    let transList = this.state.transList;
    let transSelectList = this.state.transSelectList;
    transSelectList[i] = !transSelectList[i];
    this.setState({ transSelectList });
    
    let list = [];
    for (let i = 0; i < transSelectList.length; i++) {
      if (transSelectList[i]) {
        list.push(transList[i]);
      }
    }
    this.props.updateTrans(list)
  }
  
  render() {
    const { transList, transSelectList } = this.state;
    let render_trans = [];
    for (let i = 0; i < transList.length; i++) {
      render_trans.push(
        <div className={ transSelectList[i] ? "item_tickon" : "item_tickoff"} onClick={() => { this.setItem(i); }}>
          { transList[i] }
        </div>
      )
    }
    return (
      <div className="typeContainer">
        { render_trans }
      </div>
    );
  }
}

TransportionSelector.propTypes = {
  updateTrans: PropTypes.func.isRequired
};
