import React, { Component, PropTypes } from 'react';
import { Animated } from "react-animated-css";
import './styles.css';

export default class TasksCancelled extends Component {
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
          Great Going!
        </div>
        <div className="no_tasks_subtitle">
          You are doing great! Great Record of not cancelling any Task.  Continue the winning streak and let us know how to improve via the Contact us.
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

TasksCancelled.propTypes = {
};
