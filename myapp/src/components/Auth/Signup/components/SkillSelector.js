import React, { Component, PropTypes } from 'react';
import './styles.css';

export default class SkillSelector extends Component {
  
  constructor() {
    super();
    this.state = {
      skillState1: false,
      skillState2: false,
      skillState3: false,
      skillState4: false,
      skillState5: false,
      skillState6: false,
      skillState7: false,
      skillState8: false,
      skillState9: false,
      skillState10: false
    }
  }
  
  setItem(i) {
    const {
      skillState1,
      skillState2,
      skillState3,
      skillState4,
      skillState5,
      skillState6,
      skillState7,
      skillState8,
      skillState9,
      skillState10
    } = this.state;
    let skillState1_after = skillState1;
    let skillState2_after = skillState2;
    let skillState3_after = skillState3;
    let skillState4_after = skillState4;
    let skillState5_after = skillState5;
    let skillState6_after = skillState6;
    let skillState7_after = skillState7;
    let skillState8_after = skillState8;
    let skillState9_after = skillState9;
    let skillState10_after = skillState10;
    switch (i) {
      case 1:
        skillState1_after = !skillState1;
        this.setState({ skillState1: !skillState1 });
        break;
      case 2:
        skillState2_after = !skillState2;
        this.setState({ skillState2: !skillState2 });
        break;
      case 3:
        skillState3_after = !skillState3;
        this.setState({ skillState3: !skillState3 });
        break;
      case 4:
        skillState4_after = !skillState4;
        this.setState({ skillState4: !skillState4 });
        break;
      case 5:
        skillState5_after = !skillState5;
        this.setState({ skillState5: !skillState5 });
        break;
      case 6:
        skillState6_after = !skillState6;
        this.setState({ skillState6: !skillState6 });
        break;
      case 7:
        skillState7_after = !skillState7;
        this.setState({ skillState7: !skillState7 });
        break;
      case 8:
        skillState8_after = !skillState8;
        this.setState({ skillState8: !skillState8 });
        break;
      case 9:
        skillState9_after = !skillState9;
        this.setState({ skillState9: !skillState9 });
        break;
      case 10:
        skillState10_after = !skillState10;
        this.setState({ skillState10: !skillState10 });
        break;
      default:
        break;
    }
  
    let list = [];
    if (skillState1_after) {
      list.push("House Cleaning");
    }
    if (skillState2_after) {
      list.push("Assembly Services");
    }
    if (skillState3_after) {
      list.push("Handyman");
    }
    if (skillState4_after) {
      list.push("Delivery");
    }
    if (skillState5_after) {
      list.push("Gardening");
    }
    if (skillState6_after) {
      list.push("Admin & IT Support");
    }
    if (skillState7_after) {
      list.push("Beauty & Care");
    }
    if (skillState8_after) {
      list.push("Photography");
    }
    if (skillState9_after) {
      list.push("Decoration");
    }
    if (skillState10_after) {
      list.push("Other Services");
    }
    this.props.updateSkills(list);
  
  }
  
  render() {
    const { skillState1, skillState2,skillState3,skillState4,skillState5,skillState6,skillState7,skillState8,skillState9,skillState10 } = this.state;
    
    return (
        <div className="typeContainer">
          <div className={ skillState1 ? "item_tickon_big" : "item_tickoff_big"} onClick={() => { this.setItem(1); }}>
            {/*House Cleaning*/}
            Cleaning
          </div>
          <div className={ skillState2 ? "item_tickon_big" : "item_tickoff_big"} onClick={() => { this.setItem(2); }}>
            {/*Assembly Services*/}
            Service
          </div>
          <div className={ skillState3 ? "item_tickon_big" : "item_tickoff_big"} onClick={() => { this.setItem(3); }}>
            Handyman
          </div>
          <div className={ skillState4 ? "item_tickon_big" : "item_tickoff_big"} onClick={() => { this.setItem(4); }}>
            Delivery
          </div>
          <div className={ skillState5 ? "item_tickon_big" : "item_tickoff_big"} onClick={() => { this.setItem(5); }}>
            Gardening
          </div>
          <div className={ skillState6 ? "item_tickon_big" : "item_tickoff_big"} onClick={() => { this.setItem(6); }}>
            {/*Admin & IT Support*/}
            Support
          </div>
          <div className={ skillState7 ? "item_tickon_big" : "item_tickoff_big"} onClick={() => { this.setItem(7); }}>
            {/*Beauty & Care*/}
            Care
          </div>
          <div className={ skillState8 ? "item_tickon_big" : "item_tickoff_big"} onClick={() => { this.setItem(8); }}>
            {/*Photography*/}
            Photo
          </div>
          <div className={ skillState9 ? "item_tickon_big" : "item_tickoff_big"} onClick={() => { this.setItem(9); }}>
            Decoration
          </div>
          <div className={ skillState10 ? "item_tickon_big" : "item_tickoff_big"} onClick={() => { this.setItem(10); }}>
            {/*Other Services*/}
            Other
          </div>
        </div>
    );
  }
}

SkillSelector.propTypes = {
  updateSkills: PropTypes.func.isRequired
};
