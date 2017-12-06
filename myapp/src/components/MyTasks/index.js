import React, { PropTypes } from 'react';
import { Animated } from "react-animated-css";
import { DateRange } from 'react-date-range';
import "./styles.css"
import TaskPosted from './TaskPosted';
import TasksAssigned from './TasksAssigned';
import TasksCancelled from './TasksCancelled';
import TasksCompleted from './TasksCompleted';
import MyOffers from './MyOffers';

export default class MyTasks extends React.Component {
  
  constructor() {
    super();
    this.state = {
      pageState: 0,
    };
  }
  
  componentDidMount() {
    setTimeout(() => {
      this.props.updateHeader(9);
    }, 100);
  }
  
  render() {
    const { pageState } = this.state;
    let render_page = [];
    if (pageState === 0) {
      render_page.push(
        <TaskPosted/>
      )
    } else if (pageState === 1) {
      render_page.push(
        <MyOffers/>
      )
    } else if (pageState === 2) {
      render_page.push(
        <TasksAssigned/>
      )
    } else if (pageState === 3) {
      render_page.push(
        <TasksCancelled/>
      )
    } else {
      render_page.push(
        <TasksCompleted/>
      )
    }
    return (
      <div>
        <div className="col-sm-12 centerContent">
          <div className="mytasks_top_selector">
            <div className={pageState === 0 ? "mytasks_top_selector1 borderbottom" : "mytasks_top_selector1"} onClick={() => { this.setState({ pageState: 0 }) }}>Tasks Posted</div>
            <div className={pageState === 1 ? "mytasks_top_selector1 borderbottom" : "mytasks_top_selector1"} onClick={() => { this.setState({ pageState: 1 }) }}>My Offers</div>
            <div className={pageState === 2 ? "mytasks_top_selector1 borderbottom" : "mytasks_top_selector1"} onClick={() => { this.setState({ pageState: 2 }) }}>Tasks Assigned</div>
            <div className={pageState === 3 ? "mytasks_top_selector1 borderbottom" : "mytasks_top_selector1"} onClick={() => { this.setState({ pageState: 3 }) }}>Tasks Cancelled</div>
            <div className={pageState === 4 ? "mytasks_top_selector1 borderbottom" : "mytasks_top_selector1"} onClick={() => { this.setState({ pageState: 4 }) }}>Tasks Completed</div>
          </div>
          { render_page }
        </div>
      </div>
    )
  }
}

MyTasks.propTypes = {
  updateHeader: PropTypes.func.isRequired
};
