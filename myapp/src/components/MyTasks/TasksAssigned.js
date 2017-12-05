import React, { Component, PropTypes } from 'react';
import { Animated } from "react-animated-css";
import './styles.css';

export default class TasksAssigned extends Component {
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
          No Tasks Are Assigned!
        </div>
        <div className="no_tasks_subtitle">
          Your journey started just now! Continue with Yeepi by posting a task and get as many offers from taskers aruOnd you to pick from to and assign the Task.
        </div>
        <div className="no_tasks_button_container">
          <div className="no_tasks_button">
            Post a Task
          </div>
        </div>
      </div>
    );
  }
}

TasksAssigned.propTypes = {
};
