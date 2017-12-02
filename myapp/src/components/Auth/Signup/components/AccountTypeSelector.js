import React, { Component, PropTypes } from 'react';
import './styles.css';

export default class AccountTypeSelector extends Component {
  
  constructor() {
    super();
    this.state = {
      itemState: 0
    }
  }
  
  setItem(i) {
    this.setState({ itemState: i });
    this.props.updateAccountType(i)
  }
  
  render() {
    const { itemState } = this.state;
    
    return (
      <div className="typeContainer">
        <div className={ itemState === 1 ? "item_tickon" : "item_tickoff"} onClick={() => { this.setItem(1); }}>
          Tasker
        </div>
        <div className={ itemState === 2 ? "item_tickon" : "item_tickoff"} onClick={() => { this.setItem(2); }}>
          Poster
        </div>
        <div className={ itemState === 3 ? "item_tickon" : "item_tickoff"} onClick={() => { this.setItem(3); }}>
          Both
        </div>
      </div>
    );
  }
}

AccountTypeSelector.propTypes = {
  updateAccountType: PropTypes.func.isRequired
};
