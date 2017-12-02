import React, { Component, PropTypes } from 'react';
import './styles.css';

export default class TransportionSelector extends Component {
  
  constructor() {
    super();
    this.state = {
      transState1: false,
      transState2: false,
      transState3: false,
      transState4: false
    }
  }
  
  setItem(i) {
    const { transState1, transState2, transState3, transState4 } = this.state;
    let transState1_after = transState1;
    let transState2_after = transState2;
    let transState3_after = transState3;
    let transState4_after = transState4;
    switch (i) {
      case 1:
        transState1_after = !transState1;
        this.setState({ transState1: !transState1 });
        break;
      case 2:
        transState2_after = !transState2;
        this.setState({ transState2: !transState2 });
        break;
      case 3:
        transState3_after = !transState3;
        this.setState({ transState3: !transState3 });
        break;
      case 4:
        transState4_after = !transState4;
        this.setState({ transState4: !transState4 });
        break;
      default:
        break;
    }
    let list = [];
    if (transState1_after) {
      list.push("Car");
    }
    if (transState2_after) {
      list.push("Truck");
    }
    if (transState3_after) {
      list.push("Scooter");
    }
    if (transState4_after) {
      list.push("Bicycle");
    }
    this.props.updateTrans(list);
  }
  
  render() {
    const { transState1, transState2, transState3, transState4 } = this.state;
    return (
      <div className="typeContainer">
        <div className={ transState1 ? "item_tickon" : "item_tickoff"} onClick={() => { this.setItem(1); }}>
          Car
        </div>
        <div className={ transState2 ? "item_tickon" : "item_tickoff"} onClick={() => { this.setItem(2); }}>
          Truck
        </div>
        <div className={ transState3 ? "item_tickon" : "item_tickoff"} onClick={() => { this.setItem(3); }}>
          Scooter
        </div>
        <div className={ transState4 ? "item_tickon" : "item_tickoff"} onClick={() => { this.setItem(4); }}>
          Bicycle
        </div>
      </div>
    );
  }
}

TransportionSelector.propTypes = {
  updateTrans: PropTypes.func.isRequired
};
