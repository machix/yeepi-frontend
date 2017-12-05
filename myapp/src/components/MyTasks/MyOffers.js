import React, { Component, PropTypes } from 'react';
import { Animated } from "react-animated-css";
import './styles.css';

export default class MyOffers extends Component {
  constructor() {
    super();
    this.state = {
    }
  }
  
  render() {
    // const { displayText, animation } = this.props;
    return (
      <div>
        <div className="no_tasks_img"/>
        <div className="no_tasks_title">
          No Offers Made!
        </div>
        <div className="no_tasks_subtitle">
          Your journey started just now! Continue with Yeepi by Exploring hundereds of  tasks and earn money by completing the task.
        </div>
        <div className="no_tasks_button_container">
          <div className="no_tasks_button">
            Explore Tasks
          </div>
        </div>
      </div>
    );
  }
}

MyOffers.propTypes = {
};
