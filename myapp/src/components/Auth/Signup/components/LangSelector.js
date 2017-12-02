import React, { Component, PropTypes } from 'react';
import './styles.css';

export default class LangSelector extends Component {
  
  constructor() {
    super();
    this.state = {
      lang1State: false,
      lang2State: false,
    }
  }
  
  setItem(i) {
    const { lang1State, lang2State } = this.state;
    let langState1_after = lang1State;
    let langState2_after = lang2State;
    switch (i) {
      case 1:
        langState1_after = !lang1State;
        this.setState({ lang1State: !lang1State });
        break;
      case 2:
        langState2_after = !lang2State;
        this.setState({ lang2State: !lang2State });
        break;
      default:
        break;
    }
    
    if (langState1_after && langState2_after) {
      this.props.updateLang(["English", "French"]);
    } else if (!langState1_after && langState2_after) {
      this.props.updateLang(["French"]);
    } else if (langState1_after && !langState2_after) {
      this.props.updateLang(["English"]);
    } else {
      this.props.updateLang([]);
    }
  }
  
  render() {
    const { lang1State, lang2State } = this.state;
    
    return (
      <div className="typeContainer">
        <div className={ lang1State ? "item_tickon" : "item_tickoff"} onClick={() => { this.setItem(1); }}>
          English
        </div>
        <div className={ lang2State ? "item_tickon" : "item_tickoff"} onClick={() => { this.setItem(2); }}>
          French
        </div>
      </div>
    );
  }
}

LangSelector.propTypes = {
  updateLang: PropTypes.func.isRequired
};
