import React, { PropTypes } from 'react';
import { Animated } from "react-animated-css";
import { DateRange } from 'react-date-range';
import "./styles.css"
import TaskPosted from './TaskPosted';
import TasksAssigned from './TasksAssigned';
import TasksCancelled from './TasksCancelled';
import TasksCompleted from './TasksCompleted';
import MyOffers from './MyOffers';
import {eng, fre} from "../../lang";

export default class MyTasks extends React.Component {
  
  constructor() {
    super();
    this.state = {
      pageState: 0,
      lang: eng,
    };
  }
  
  componentDidMount() {
    this.props.updateHeader(9);
  }
  
  render() {
    const { pageState, lang } = this.state;
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
            <div className={pageState === 0 ? "mytasks_top_selector1 borderbottom" : "mytasks_top_selector1"} onClick={() => { this.setState({ pageState: 0 }) }}>{ lang.tasks_posted }</div>
            <div className={pageState === 1 ? "mytasks_top_selector1 borderbottom" : "mytasks_top_selector1"} onClick={() => { this.setState({ pageState: 1 }) }}>{ lang.my_offers }</div>
            <div className={pageState === 2 ? "mytasks_top_selector1 borderbottom" : "mytasks_top_selector1"} onClick={() => { this.setState({ pageState: 2 }) }}>{ lang.tasks_assigned }</div>
            <div className={pageState === 3 ? "mytasks_top_selector1 borderbottom" : "mytasks_top_selector1"} onClick={() => { this.setState({ pageState: 3 }) }}>{ lang.tasks_cancelled }</div>
            <div className={pageState === 4 ? "mytasks_top_selector1 borderbottom" : "mytasks_top_selector1"} onClick={() => { this.setState({ pageState: 4 }) }}>{ lang.tasks_completed }</div>
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
