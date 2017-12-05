import React, { Component, PropTypes } from 'react';
import { Animated } from "react-animated-css";
import './styles.css';

export default class TasksCompleted extends Component {
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
          No Tasks Completed Yet!
        </div>
        <div className="no_tasks_subtitle">
          Seems like you have not completed any task. Continue with Yeepi by making an offer to any task under your proficiency and complete the task to earn money.
        </div>
        <div className="no_tasks_button_container">
          <div className="no_tasks_button">
            No Tasks
          </div>
        </div>
      </div>
    );
  }
}

TasksCompleted.propTypes = {
};
