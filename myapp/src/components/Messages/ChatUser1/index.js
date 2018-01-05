import React, { Component, PropTypes } from 'react';
import dateformat from "dateformat";
import './styles.css';

export default class ChatUser1 extends Component {
  constructor() {
    super();
    this.state = {
    }
  }

  getDateFromTimestamp = (timestamp) => {
    let date = new Date(timestamp);
    return dateformat(date, "dddd, mmmm dS, yyyy, h:MM:ss TT");
  };
  
  render() {
    return (
      <div className="chat_test">
        <div className="chat_user1_avatarcontainer">
          {
            this.props.avatar === '' ? <div className="chat_user1_avatar_no"/> : <img className="chat_user1_avatar_yes" src={this.props.avatar}/>
          }
        </div>
        <div className="chat_user1_chatcontainer">
          {
            this.props.role === "Me" ?
              <div className="chat_user1_chat_role">
                Me
              </div>
              :
              <div className="chat_user1_chat_role greentext">
                { this.props.role }
              </div>
          }
          <div className="chat_user1_chat_content">
            {this.props.displayText}
          </div>
          <div className="chat_user1_chat_time">
            { this.getDateFromTimestamp(this.props.timestamp) }
          </div>
        </div>
      </div>
    );
  }
}

ChatUser1.propTypes = {
  displayText: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  timestamp: PropTypes.number,
  avatar: PropTypes.string,
};
