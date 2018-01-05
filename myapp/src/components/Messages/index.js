/* eslint-disable */
import React, { PropTypes } from 'react';
import ReactList from 'react-list';
import "./styles.css";
import applozic from "applozic";
import config from "../../config";
import {reactLocalStorage} from "reactjs-localstorage";
import ChatUser1 from "./ChatUser1";

const base_url_public = config.baseUrl;
import Promise from 'promise';
import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';
let superagent = superagentPromise(_superagent, Promise);

export default class Messages extends React.Component {
  
  constructor() {
    super();
    this.state = {
      selected_index: 0,
      chat_users: [],
      chat_str: '',
      display_messages: [],
      message_links: [],
      message_links_avatars: [],
      my_avatar: "",
    };
    this.chat_timeout = window.setTimeout(() => {this.updateChatUsers()}, 300);
    this.requests = {
      fetchTaskInfo: (email1, email2) =>
        superagent.post(base_url_public + '/frontend/messagelinks/fetchfilter', { email1, email2 }).then(res => {
          if (!res.body.result) {
            this.setState({ showAlert: true, alertText: res.body.text })
          } else {
          }
        }),
      fetchMessageLinks: (email) =>
        superagent.post(base_url_public + '/frontend/messagelinks/fetchMessageLinks', { email }).then(res => {
          if (!res.body.result) {
            this.setState({ showAlert: true, alertText: res.body.text })
          } else {
            window.message_links = res.body.links;
            this.setState({ message_links: res.body.links, message_links_avatars: res.body.avatars, my_avatar: res.body.my_avatar });
          }
        }),
    };
  }
  
  componentDidMount() {
    
    window.chat_users = [];
    window.selected_index = 0;
    window.display_messages = [];

    this.updateChatUsers();
    
    let message_loaded = reactLocalStorage.get('message_loaded');

    if (message_loaded === "false") {
      reactLocalStorage.set('message_loaded', "true");
      location.reload();
    } else {
      reactLocalStorage.set('message_loaded', "false");
    }
    this.props.updateHeader(12);
    this.requests.fetchMessageLinks(reactLocalStorage.get('loggedEmail'));
  }
  
  handleSubmit = (e) => {
    e.preventDefault();
  };

  getDeltaFromLastSeen = (timestamp) => {
    let diffTimeStamp = (Date.now() - timestamp)/1000;
    let diffTimeStampSeconds = parseInt(diffTimeStamp.toFixed());
    if (diffTimeStampSeconds < 60) {
      return "Just Before";
    } else if (diffTimeStampSeconds < 3600) {
      let diffMin = diffTimeStampSeconds / 60;
      return diffMin.toFixed(0) + " Minutes Ago";
    } else if (diffTimeStampSeconds < 3600 * 24) {
      let diffHour = diffTimeStampSeconds / 3600;
      return diffHour.toFixed(0) + " Hours Ago";
    } else {
      let diffDay = diffTimeStampSeconds / 3600 / 24;
      return diffDay.toFixed(0) + " Days Ago";
    }
  };

  updateChatUsers = () => {
    this.setState({ chat_users: window.chat_users, display_messages: window.display_messages });
    window.applozic.init({
      appId: '2fde83d9c3e0d87d15b2373bbf99e6172',
      userId: reactLocalStorage.get('loggedEmail'),
      userName: reactLocalStorage.get('loggedUsername'),
      imageLink : '',
      email : '',
      contactNumber: '',
      accessToken: '',
      desktopNotification: false,
      notificationIconLink: '',
      onInit : function(response) {
        if (response === "success") {
          // send messages
          // $applozic.fn.applozic('sendMessage', {
          //   // 'to': 'emzo.emzo.chabo.1@gmail.com',
          //   'to': 'mihail.greb.bz@gmail.com',
          //   'message' : 'Hey, Mihail!',
          //   'type' : 0
          // });

          // get messages
          // $applozic.fn.applozic('messageList',
          //   {'id': 'alex.ignacz412@gmail.com',
          //     'isGroup': false,               		 // True in case of group
          //     'clientGroupId' : '', // use either groupId or clientGroupId
          //     'callback': function(response){
          //       // write your logic
          //       debugger;
          //     }
          //   });

          //response.data.users[0].lastSeenAtTime
          //response.data.users[0].connected

          // get contacts
          window.setInterval(function(){
            /// call your function here
            $applozic.fn.applozic('getUserDetail', {callback: function(response) {
                if(response.status === 'success') {
                  // write your logic
                  window.chat_users = response.data.users;
                }
              }
            });
            if (window.chat_users.length > 0) {

              let flag = false;
              let chat_user = {};

              for (let j = 0; j < chat_users.length; j++) {
                if (window.chat_users[j].userId === message_links[window.selected_index]) {
                  chat_user = window.chat_users[j];
                  flag = true;
                }
              }

              if (!flag) {
                window.display_messages = [];
              } else {
                $applozic.fn.applozic('messageList',
                  {'id': chat_user.userId,
                    'isGroup': false,               		 // True in case of group
                    'clientGroupId' : '', // use either groupId or clientGroupId
                    'callback': function(response){
                      // write your logic
                      window.display_messages = response.messages;
                    }
                  });
              }


            }
          }, 1000);

        } else {
          // error in user login/register (you can hide chat button or refresh page)
        }
      },
    });
    this.chat_timeout = window.setTimeout(() => {this.updateChatUsers()}, 1000);
  };
  
  componentWillUnmount() {
    reactLocalStorage.set('message_loaded', "false");
    window.clearTimeout(this.chat_timeout);
    this.chat_timeout = null;
  }
  
  onClickLeftItem = index => {
    window.selected_index = index;
    this.setState({ selected_index: index });
    // this.requests.fetchTaskInfo(reactLocalStorage.get("loggedEmail"), this.state.message_links[index]);
  };
  
  testSendMsg = () => {
    let el = this._refChatContent;
    el.scrollTop = el.scrollHeight;

    let chat_str = this.state.chat_str;
    this.setState({ chat_str: '' });


    let flag = false;
    let chat_user = {};

    for (let j = 0; j < this.state.chat_users.length; j++) {
      if (this.state.chat_users[j].userId === this.state.message_links[this.state.selected_index]) {
        chat_user = this.state.chat_users[j];
        flag = true;
      }
    }

    if (flag) {
      $applozic.fn.applozic('sendMessage', {
        'to': chat_user.userId,
        'message' : chat_str,
        'type' : 0
      });
    }

  };
  
  renderItem = (index, key) => {
    const { selected_index, chat_users, message_links, message_links_avatars } = this.state;
    let chat_user = {};

    let flag = false;
    for (let j = 0; j < chat_users.length; j++) {
      if (chat_users[j].userId === message_links[index]) {
        chat_user = chat_users[j];
        flag = true;
      }
    }

    if (!flag) {
      chat_user = {
        "connected": false,
        "userName": message_links[index],
        "lastSeenAtTime": "",
        "unreadCount": 0,
      }
    }

    return (
      <div key={key} className={selected_index === index ? "message_left_listview_item selected" : "message_left_listview_item"} onClick={() => { this.onClickLeftItem(index); }}>
        <div className="left_item_avatar_container">
          {
            message_links_avatars[index] === "" ? <div className="no_avatar"/> : <img className="yes_avatar" src={message_links_avatars[index]} />
          }

          {
            chat_user.connected ? <div className="avatar_status_online"/> : <div className="avatar_status_offline"/>
          }
        </div>
        <div className="left_item_txt_container">
          <div className="flex">
            <div className="left_item_txt1">{ chat_user.userName }</div>
            {
              chat_user.unreadCount !== 0 &&
                <div className="left_item_txt1_r">{ chat_user.unreadCount }</div>
            }
          </div>
          <div className="left_item_txt2">Provin Gravida nibh vell velit</div>
          <div className="left_item_txt3">{ this.getDeltaFromLastSeen(chat_user.lastSeenAtTime) }</div>
        </div>
        <div className="left_item_ra_container">
          {
            selected_index === index &&
              <div className="ra"/>
          }
        </div>
      </div>
    );
  };
  
  render() {
    const {
      chat_users,
      selected_index,
      chat_str,
      display_messages,
      message_links,
    } = this.state;
    if (chat_users.length === 0) {
      return(null);
    }

    // display no customer
    let header_str = "";
    let customer_username = "";

    if (message_links.length === 0) {
      header_str = "You don't have any customer";
    } else {
      let flag = false;
      for (let j = 0; j < chat_users.length; j++) {
        if (chat_users[j].userId === message_links[selected_index]) {
          header_str = "Conversation with " + chat_users[j].userName;
          customer_username = chat_users[j].userName;
          flag = true;
        }
      }

      if (!flag) {
        header_str = "Conversation with new user";
        customer_username = "";
      }
    }


    // display messages
    let render_display_messages = [];
    //display_messages.timeStamp
    //display_messages.from
    for (let i = display_messages.length - 1; i >= 0 ; i--) {
      let key = "render_display_messages" + i;

      let role = '';
      let avatar = '';
      if (display_messages[i].from === reactLocalStorage.get("loggedEmail")) {
        role = 'Me';
        avatar = this.state.my_avatar;
      } else {
        role = customer_username;
        avatar = this.state.message_links_avatars[this.state.selected_index];
      }

      render_display_messages.push(
        <ChatUser1 key={key} displayText={display_messages[i].message} role={role} timestamp={display_messages[i].timeStamp} avatar={avatar} />
      );
    }

    // display left side
    let render_left_side_list = [];
    if (chat_users.length > 0) {
      render_left_side_list = (
        <ReactList
          itemRenderer={this.renderItem}
          length={message_links.length}
        />
      );
    } else {
      render_left_side_list = (
        <div className="ringcontainer">
          <div className="ring"/>
        </div>
      );
    }

    return (
      <div>
        <div className="col-sm-12 centerContent">
          <div className="messages_top_selector">
            <div className="tasks_messages_txt">
              Tasks Messages
            </div>
          </div>
          <div className="message_container">
            <div className="message_container_flex">
              <div className="message_left_side">
                {
                  render_left_side_list
                }
              </div>
              <div className="message_medium_bar"/>
              <div className="message_right_side">
                {/*TaskInfo*/}
                {/*<div className="message_right_taskinfo">*/}
                  {/*<div className="message_right_taskinfo_top">*/}
                    {/*<div className="message_right_taskinfo_top_avatarcontainer">*/}
                      {/*<div className="task_info_no_avatar"/>*/}
                    {/*</div>*/}
                    {/*<div className="message_right_taskinfo_top_desccontainer">*/}
                      {/*<div className="message_right_taskinfo_top_desc">X</div>*/}
                    {/*</div>*/}
                    {/*<div className="message_right_taskinfo_top_budgetcontainer">*/}
                      {/*<div className="message_right_taskinfo_top_budget">$142</div>*/}
                      {/*<div className="message_right_taskinfo_top_budgetdesc">Budget</div>*/}
                    {/*</div>*/}
                  {/*</div>*/}
                  {/*<div className="message_right_taskinfo_bottom">*/}
                    {/*<div className="message_right_taskinfo_bottom_left">*/}
                      {/*<div className="message_taskinfo_clock"/>*/}
                      {/*<div className="marginLeft_5px">POSTED :</div>*/}
                      {/*<div className="marginLeft_5px">2 Mins ago</div>*/}
                    {/*</div>*/}
                    {/*<div className="taskinfo_bar"/>*/}
                    {/*<div className="message_right_taskinfo_bottom_medium">*/}
                      {/*<div className="message_taskinfo_stopwatch"/>*/}
                      {/*<div className="marginLeft_5px">DEADLINE :</div>*/}
                      {/*<div className="marginLeft_5px">Monday 21th Jan</div>*/}
                    {/*</div>*/}
                    {/*<div className="taskinfo_bar"/>*/}
                    {/*<div className="message_right_taskinfo_bottom_right">*/}
                      {/*<div>STATUS :</div>*/}
                      {/*<div className="marginLeft_5px">OPEN</div>*/}
                    {/*</div>*/}
                  {/*</div>*/}
                {/*</div>*/}
  
                <div className="message_right_conversation_with">
                  { header_str }
                </div>
                
                <div className="scroll chat_content" ref={ref => {this._refChatContent = ref;}}>
                  {
                    render_display_messages
                  }
                </div>

                {
                  message_links.length === 0 ?
                    <div/>
                    :
                    <div className="chat_btns">
                      <form onSubmit={this.handleSubmit}>
                        <input
                          className="form-control chat_btns_input"
                          ref={ref => (this._input_chat = ref)}
                          value={chat_str}
                          onChange={(text) => { this.setState({ chat_str: this._input_chat.value }) }}
                        />
                      </form>
                      <div className="sendbtncontainer">
                        <div className="addattachments">
                          <div className="paperclip"/>
                          <div className="marginLeft_5px">Add Attachments</div>
                        </div>
                        <div className="reply" onClick={this.testSendMsg}>Reply</div>
                      </div>
                    </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Messages.propTypes = {
  updateHeader: PropTypes.func.isRequired
};
