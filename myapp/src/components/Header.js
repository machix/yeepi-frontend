import React from 'react';
import {reactLocalStorage} from 'reactjs-localstorage';
import {  Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { NavDropdown, MenuItem } from 'react-bootstrap';
import config from './../config';
import './styles.css';

import Promise from 'promise';
import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';
let superagent = superagentPromise(_superagent, Promise);

const base_url_public = config.baseUrl;

const MyProfileView = props => {
  return (
    <ul className="nav navbar-nav pull-xs-right rightbar">
      
      <li className="nav-item">
        <Link to="/post" className="nav-link">
          <div className="signup" onClick={props.onClickPost}>Post a task</div>
        </Link>
      </li>
      
      <li className="nav-item">
        <Link to="/dashboard" className="nav-link">
          <div className={ props.headerType === 13 ? "normal_white" : "normal"}>Dashboard</div>
        </Link>
      </li>
  
      <li className="nav-item">
        <Link to="/exploretasks" className="nav-link">
          <div className={ props.headerType === 10 ? "normal_white" : "normal"}>Explore Tasks</div>
        </Link>
      </li>
      
      <li className="nav-item">
        <Link to="/mytasks" className="nav-link">
          <div className={ props.headerType === 9 ? "normal_white" : "normal"}>My Tasks</div>
        </Link>
      </li>
      
      <li className="nav-item">
        <Link to="/payments" className="nav-link">
          <div className={ props.headerType === 11 ? "normal_white" : "normal"}>Payments</div>
        </Link>
      </li>
  
      <li className="nav-item">
        <Link to="/messages" className="nav-link">
          <div className={ props.headerType === 12 ? "normal_white" : "normal"}>Messages</div>
        </Link>
      </li>
  
      <li className="nav-item">
        <NavDropdown eventKey={3} title={props.langState === 0 ? "English" : "French"} id="basic-nav-dropdown" className="dropdownContainer">
          <MenuItem eventKey={3.1} onClick={() => {props.onMenu(0);}}>English</MenuItem>
          <MenuItem eventKey={3.2} onClick={() => {props.onMenu(1);}}>French</MenuItem>
        </NavDropdown>
      </li>
      
      <li className="nav-item">
        <Link to="/signin" className="nav-link">
          <div className="normal" onClick={() => {props.onSignOut();}}>Sign Out</div>
        </Link>
      </li>

    </ul>
  );
};

const StripeSignupView = props => {
  return (
    <ul className="nav navbar-nav pull-xs-right rightbar">
      
      <li className="nav-item">
        <NavDropdown eventKey={3} title={props.langState === 0 ? "English" : "French"} id="basic-nav-dropdown" className="dropdownContainer">
          <MenuItem eventKey={3.1} onClick={() => {props.onMenu(0);}}>English</MenuItem>
          <MenuItem eventKey={3.2} onClick={() => {props.onMenu(1);}}>French</MenuItem>
        </NavDropdown>
      </li>
  
      <li className="nav-item">
        <Link to="/signin" className="nav-link">
          <div className="normal" onClick={() => {props.onSignOut();}}>Sign Out</div>
        </Link>
      </li>

    </ul>
  );
};

const LoggedOutView = props => {
  if (!props.currentUser) {
    return (
      <ul className="nav navbar-nav pull-xs-right rightbar">

        <li className="nav-item">
          <Link to="/signin" className="nav-link">
            <div className="signup">Sign In</div>
          </Link>
        </li>

        <li className="nav-item">
          <Link to="/signup" className="nav-link">
            <div className="signup">Sign Up</div>
          </Link>
        </li>

      </ul>
    );
  }
  return null;
};

const CenterHeaderTitle = props => {
  if (props.title === "") {
    return null;
  }
  return (
    <h5 className="createProfile">
      Create Your Profile
    </h5>
  );
};


const LoggedInView = props => {
  if (props.currentUser) {
    return (
      <ul className="nav navbar-nav pull-xs-right">

        <li className="nav-item">
          <Link to="/" className="nav-link">
            Home
          </Link>
        </li>

        <li className="nav-item">
          <Link to="/editor" className="nav-link">
            <i className="ion-compose"></i>&nbsp;New Post
          </Link>
        </li>

        <li className="nav-item">
          <Link to="/settings" className="nav-link">
            <i className="ion-gear-a"></i>&nbsp;Settings
          </Link>
        </li>

        <li className="nav-item">
          <Link
            to={`/@${props.currentUser.username}`}
            className="nav-link">
            <img src={props.currentUser.image} className="user-pic" alt={props.currentUser.username} />
            {props.currentUser.username}
          </Link>
        </li>

      </ul>
    );
  }

  return null;
};

class Header extends React.Component {
  
  constructor() {
    super();
    this.state = {
      headerType: 0,
      langState: 0
    };
    this.requests = {
      updateLanguage: (i) =>
        superagent.post(base_url_public + '/frontend/user/updatelanguage', {
          token: reactLocalStorage.get('loggedToken'),
          language: i
        }).then(res => {
          if (!res.body.result) {
            alert(res.body.text);
          } else {
            this.setState({ langState: i }, () => {
              this.props.onUpdateLang(i);
            })
          }
        }),
    }
  }
  
  updateHeader = (i) => {
    this.setState({ headerType: i, langState: config.language });
  };
  
  onSignOut = () => {
    // alert('signed out 123')
  };
  
  onMenu = (i) => {
    if ( this.state.langState === i) {
      return;
    }
    if (confirm('are you sure to switch the language?')) {
      this.requests.updateLanguage(i);
    }
  };
  
  onClickPost = () => {
    this.props.onClickPost();
  };
  
  render() {
    const { headerType, langState } = this.state;
    if (headerType === 9 || headerType === 10 || headerType === 11 || headerType === 12 || headerType === 13) { // 9: my tasks, 10: explore tasks, 11: payments, 12: messages, 13: dashboard
      return (
        <nav className="navbar navbar-light">
          <div className="container">
          
            <Link to="/dashboard" className="navbar-brand">
              <div className="appheader-logo" />
            </Link>
          
            <MyProfileView onSignOut={this.onSignOut} onMenu={this.onMenu} langState={langState} onClickPost={this.onClickPost} headerType={headerType} />
        
          </div>
        </nav>
      );
    }
    if (headerType === 2) {
      return (
        <nav className="navbar navbar-light">
          <div className="container">
        
            <Link to="/dashboard" className="navbar-brand">
              <div className="appheader-logo" />
            </Link>
          
            <MyProfileView onSignOut={this.onSignOut} onMenu={this.onMenu} langState={langState} onClickPost={this.onClickPost} headerType={2} />
            
          </div>
        </nav>
      );
    }
    if (headerType === 3) {
      return (
        <nav className="navbar navbar-light">
          <div className="container">
        
            <Link to="/dashboard" className="navbar-brand">
              <div className="appheader-logo" />
            </Link>
        
            <StripeSignupView onSignOut={this.onSignOut} onMenu={this.onMenu} langState={langState}/>
            <CenterHeaderTitle title="X" />
          </div>
        </nav>
      );
    }
    return (
      <nav className="navbar navbar-light">
        <div className="container">

          <Link to="/dashboard" className="navbar-brand">
            <div className="appheader-logo" />
            {/*{this.props.appName.toLowerCase()}*/}
          </Link>
          
          {
            (headerType === 0 || headerType === 4) ? <CenterHeaderTitle title="" /> : <CenterHeaderTitle title="X" />
          }

          <LoggedOutView currentUser={this.props.currentUser} />
          <LoggedInView currentUser={this.props.currentUser} />
        </div>
      </nav>
    );
  }
}

export default Header;
