import React, { Component, PropTypes } from 'react';
import { Animated } from "react-animated-css";
import './styles.css';

export default class Robot extends Component {
  constructor() {
    super();
    this.state = {
    }
  }
  
  render() {
    const { displayText, animation } = this.props;
    return (
      <div className="robotContainer">
        <div className="avatar1" />
        {
          displayText === "..." ?
            <Animated animationIn="fadeIn" animationOut="fadeOut" isVisible={true} className="robotTextContainer">
              <div className="robotText">
                { displayText }
              </div>
            </Animated>
            :
            animation ?
              <Animated animationIn={displayText === "..." ? "fadeIn" : "fadeInRight"} animationOut="fadeOut" isVisible={true} className="robotTextContainer">
                <div className="robotText">
                  { displayText }
                </div>
              </Animated>
              :
              <div className="robotTextContainer">
                <div className="robotText">
                  { displayText }
                </div>
              </div>
        }
      </div>
    );
  }
}

Robot.propTypes = {
  displayText: PropTypes.string.isRequired,
  animation: PropTypes.bool.isRequired
};
