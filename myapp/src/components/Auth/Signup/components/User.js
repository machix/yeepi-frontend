import React, { Component, PropTypes } from 'react';
import { Animated } from "react-animated-css";
import './styles.css';

export default class User extends Component {
  constructor() {
    super();
  }
  
  render() {
    const { displayText, animation } = this.props;
    return (
      <div className="userContainer">
        {
          displayText === "..." ?
            <Animated animationIn="fadeIn" animationOut="fadeOut" isVisible={true} className="userTextContainer">
              <div className="userText">
                { displayText }
              </div>
            </Animated>
            :
            animation ?
              <Animated animationIn="fadeInLeft" animationOut="fadeOut" isVisible={true} className="userTextContainer">
                <div className="userText">
                  { displayText }
                </div>
              </Animated>
              :
              <div className="userTextContainer">
                <div className="userText">{ displayText }</div>
              </div>
        }
        <div className="avatar2" />
      </div>
    );
  }
}

User.propTypes = {
  displayText: PropTypes.string.isRequired,
  animation: PropTypes.bool.isRequired
};
