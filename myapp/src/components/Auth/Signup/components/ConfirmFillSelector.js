import React, { Component, PropTypes } from 'react';
import './styles.css';

export default class ConfirmFillSelector extends Component {
  
  constructor() {
    super();
    this.state = {
      itemState: 0
    }
  }
  
  setItem(i) {
    this.setState({ itemState: i });
    this.props.updateFill(i);
  }
  
  render() {
    const { itemState } = this.state;
    
    return (
      <div className="typeContainer">
        <div className={ itemState === 1 ? "item_tickon" : "item_tickoff"} onClick={() => { this.setItem(1); }}>
          No
        </div>
        <div className={ itemState === 2 ? "item_tickon" : "item_tickoff"} onClick={() => { this.setItem(2); }}>
          Yes
        </div>
      </div>
    );
  }
}

ConfirmFillSelector.propTypes = {
  updateFill: PropTypes.func.isRequired
};
