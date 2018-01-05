import React, { Component, PropTypes } from 'react';
import { Animated } from "react-animated-css";
import { Link } from 'react-router-dom';
import './styles.css';
import moment from 'moment';
import {reactLocalStorage} from "reactjs-localstorage";
import ReactList from 'react-list';
import config from "../../config";
import Promise from 'promise';
import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';
let superagent = superagentPromise(_superagent, Promise);

const base_url_public = config.baseUrl;

export default class TasksCompleted extends Component {
  constructor() {
    super();
    this.state = {
      tasks_datas: [],
    };
    this.requests = {
      fetchTasksFilteredByCompleted: () =>
        superagent.post(base_url_public + '/tasks/fetchtasks/filterbycompleted', { user_token: reactLocalStorage.get('loggedToken') }).then(res => {
          if (!res.body.result) {
            this.setState({ showAlert: true, alertText: res.body.text })
          } else {
            this.setState({ tasks_datas: res.body.tasks_datas })
          }
        }),
    };
  }
  
  componentDidMount() {
    this.requests.fetchTasksFilteredByCompleted();
  }
  
  renderItem = (index, key) => {
    const { tasks_datas } = this.state;
    let today = moment();
    let deadline = moment(tasks_datas[index].task_postline);
    let duration1 = moment.duration(today.diff(deadline));
    
    let dead = moment(tasks_datas[index].task_deadline).format("MM-DD-YYYY");
    
    let duration = duration1.asMinutes().toFixed(0); // as minute
    let duration_subfix = " Minutes Ago";
    if (duration === '0' || duration === 0) {
      duration = "Just Before";
      duration_subfix = "";
    } else {
      if (duration > 59) { // as hour
        duration = duration1.asHours().toFixed(0);
        duration_subfix = " Hours Ago";
        if (duration > 23) { // as Day
          duration = duration1.asDays().toFixed(0);
          duration_subfix = " Days Ago";
        }
      }
    }
    
    let offer_state = 0;
    let prev_offer = 0;
    for (let i = 0; i < tasks_datas[index].offerarray.length; i++) {
      if (tasks_datas[index].offerarray[i].user_token === reactLocalStorage.get('loggedToken')) {
        prev_offer = tasks_datas[index].offerarray[i].offer_amount;
        offer_state = 1;
        break;
      }
    }
    
    return (
      <div key={"react_list_key" + index} className="tasklist_item">
        <div className="tasklist_item_real">
          <div className="tasklist_item_avatarcontainer">
            {
              tasks_datas[index].user_avatar === '' ?
                <div className="tasklist_item_avatar"/>
                :
                <img className="tasklist_item_avatar1" src={tasks_datas[index].user_avatar}/>
            }
          </div>
          <div className="tasklist_item_desccontainer_taskposted">
            <div className="task_title1">
              { tasks_datas[index].task_title }
            </div>
            <div className="task_title2">
              { tasks_datas[index].task_description }
            </div>
            <div className="task_title3">
              POSTED:
            </div>
            <div className="task_title4">
              { duration }{ duration_subfix }
            </div>
            <div className="task_title5">
              DEADLINE:
            </div>
            <div className="task_title6">
              { dead }
            </div>
            <div className="task_title5">
              STATUS:
            </div>
            <div className="task_title6">
              Cancelled
            </div>
          </div>
          <div className="tasklist_item_budgetcontainer">
            <div className="offercount1">
              ${tasks_datas[index].task_budget}
            </div>
            <div className="offercount2">
              Budget Amount
            </div>
          </div>
          <div className="taskposted_bar"/>
          <div className="tasklist_item_offerscontainer">
            <div className="offercount1">
              {tasks_datas[index].offerarray.length}
            </div>
            <div className="offercount2">
              All Offers
            </div>
          </div>
        </div>
        <div className="tasklist_item_real_bar"/>
      </div>
    );
  };
  
  render() {
    const { tasks_datas } = this.state;
    return (
      <div>
        {
          tasks_datas.length === 0 ?
            <div>
              <div className="no_tasks_img"/>
              <div className="no_tasks_title">
                No Tasks Completed Yet!
              </div>
              <div className="no_tasks_subtitle">
                Seems like you have not completed any task. Continue with Yeepi by making an offer to any task under your proficiency and complete the task to earn money.
              </div>
              <div className="no_tasks_button_container">
                <Link to="/post">
                  <div className="no_tasks_button">
                    Post a Task
                  </div>
                </Link>
              </div>
            </div>
            :
            <div>
              <div className="totaltext">Total {tasks_datas.length} tasks are active</div>
              <div className="react_list_container1_state1">
                <ReactList
                  itemRenderer={this.renderItem}
                  length={tasks_datas.length}
                />
              </div>
            </div>
        }
      </div>
    );
  }
}

TasksCompleted.propTypes = {
};
