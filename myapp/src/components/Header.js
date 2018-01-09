import React from 'react';
import {reactLocalStorage} from 'reactjs-localstorage';
import {  Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { NavDropdown, MenuItem } from 'react-bootstrap';
import config from './../config';
import { eng, fre } from './../lang';
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
        <Link to="/signin" className="nav-link">
          <div className="normal" onClick={() => {props.onSignOut();}}>Sign Out</div>
        </Link>
      </li>

    </ul>
  );
};


const MyProfileView_Temp = props => {
  return (
    <div className="new_headeritems_5itemcontainer">
      
      <Link to="/post">
        <div className="signup" onClick={props.onClickPost}>Post a task</div>
      </Link>
    
      <Link to="/dashboard">
        <div className={ props.headerType === 13 ? "normal_white" : "normal"} onClick={props.headerUpdated}>{props.lang.dashboard}</div>
      </Link>
    
      <Link to="/exploretasks">
        <div className={ props.headerType === 10 ? "normal_white" : "normal"} onClick={props.headerUpdated}>{props.lang.explore_tasks}</div>
      </Link>
    
      <Link to="/mytasks">
        <div className={ props.headerType === 9 ? "normal_white" : "normal"} onClick={props.headerUpdated}>{props.lang.my_tasks}</div>
      </Link>
    
      <Link to="/payments">
        <div className={ props.headerType === 11 ? "normal_white" : "normal"} onClick={props.headerUpdated}>{props.lang.payments}</div>
      </Link>
    
      <Link to="/messages">
        <div className={ props.headerType === 12 ? "normal_white" : "normal"} onClick={props.headerUpdated}>{props.lang.messages}</div>
      </Link>
      
    </div>
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
      <div>
        <Link to="/signup">
          <div className="landig_signup">Sign Up</div>
        </Link>
        
        <Link to="/signin">
          <div className="landig_signup">Sign In</div>
        </Link>

      </div>
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


class Header extends React.Component {
  
  constructor() {
    super();
    this.state = {
      headerType: 0,
      langState: 0,
      profileClicked: false,
      langClicked: false,
      username: '',
      lang: eng,
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
      getLanguage: () =>
        superagent.post(base_url_public + '/frontend/user/getlanguage', {
          token: reactLocalStorage.get('loggedToken'),
        }).then(res => {
          if (!res.body.result) {
            alert(res.body.text);
          } else {
            if (res.body.language === "0") {
              this.setState({ langState: 0 })
            } else {
              this.setState({ langState: 1 })
            }
          }
        }),
    }
  }
  
  updateHeader = (i) => {
    this.setState({ headerType: i });
    this.requests.getLanguage();
    this.setState({ username: reactLocalStorage.get('username') })
  };
  
  onSignOut = () => {
    // alert('signed out 123')
  };
  
  onMenu = (i) => {
    if ( this.state.langState === i) {
      return;
    }
    this.requests.updateLanguage(i);
  };
  
  onClickPost = () => {
    this.setState({ langClicked: false, profileClicked: false });
    this.props.onClickPost();
  };
  
  headerUpdated = () => {
    this.setState({ langClicked: false, profileClicked: false });
  };
  
  onToggleProfile = () => {
    this.setState({ profileClicked: !this.state.profileClicked, langClicked: false });
  };
  
  onToggleLang = () => {
    this.setState({ langClicked: !this.state.langClicked, profileClicked: false });
  };
  
  onToggleBell = () => {
    this.setState({ langClicked: false, profileClicked: false });
  };
  
  onToggleHeart = () => {
    this.setState({ langClicked: false, profileClicked: false });
  };
  
  onEng = () => {
    this.setState({ langClicked: false, profileClicked: false });
    this.onMenu(0);
  };
  
  onFre = () => {
    this.setState({ langClicked: false, profileClicked: false });
    this.onMenu(1);
  };
  
  onMyProfile = () => {
    this.setState({ langClicked: false, profileClicked: false });
  };
  
  onSettings = () => {
    this.setState({ langClicked: false, profileClicked: false });
  };
  
  onLogOut = () => {
    this.setState({ langClicked: false, profileClicked: false });
    this.onSignOut();
  };
  
  render() {
    const { headerType, langState, profileClicked, langClicked, username, lang } = this.state;
    if (headerType === 2 || headerType === 9 || headerType === 10 || headerType === 11 || headerType === 12 || headerType === 13) { // 9: my tasks, 10: explore tasks, 11: payments, 12: messages, 13: dashboard , 2: my profile
      return (
        <div className="new_navbar_container">
          <div className="new_navbar_inline">
            <Link to="/dashboard">
              <div className="appheader-logo" onClick={this.headerUpdated} />
            </Link>
            <MyProfileView_Temp onSignOut={this.onSignOut} onMenu={this.onMenu} onClickPost={this.onClickPost} headerUpdated={this.headerUpdated} headerType={headerType} lang={lang} />
            <div className="new_header_rightcontainer">
              <div className="header_profile" onClick={this.onToggleProfile}/>
              <div className="bell" onClick={this.onToggleBell}/>
              <div className="heart_off" onClick={this.onToggleHeart}/>
              {
                langState === 0 ? <div className="lang_eng" onClick={this.onToggleLang}/> : <div className="lang_fre" onClick={this.onToggleLang}/>
              }
              
            </div>
            
            {
              langClicked &&
                <div className="expandview1">
                  <div className="triangle"/>
                  <div className="changelanguage">
                    {lang.change_language}
                  </div>
                  <div className="changelangbar"/>
                  <div>
                    <div className={langState === 0 ? "changelanguage1 grayback" : "changelanguage1"} onClick={this.onEng}>
                      {lang.english}
                    </div>
                    {
                      langState === 0 &&
                        <div className="checkmark"/>
                    }
                  </div>
                  <div>
                    <div className={langState === 1 ? "changelanguage1 grayback" : "changelanguage1"} onClick={this.onFre}>
                      {lang.french}
                    </div>
                    {
                      langState === 1 &&
                      <div className="checkmark"/>
                    }
                  </div>
                </div>
            }
            
            {
              profileClicked &&
                <div className="expandview2">
                  <div className="triangle2"/>
                  
                  <div className="hitxt redtext">
                    {lang.hi}, { username }
                  </div>
                  
                  <div className="hitxtbar"/>
  
                  <Link to="/myprofile">
                    <div className="hitxt1" onClick={this.onMyProfile}>
                      {lang.my_profile}
                    </div>
                  </Link>
                  
                  <div className="hitxtbar"/>
  
                  <div className="hitxt1" onClick={this.onSettings}>
                    {lang.settings}
                  </div>
                  
                  <div className="hitxtbar"/>
                  
                  <Link to="/signin">
                    <div className="hitxt1" onClick={this.onLogOut}>
                      {lang.logout1}
                    </div>
                  </Link>
                  
                </div>
            }
            
            
          </div>
        </div>
      );
    }
    if (headerType === 3) {
      return (
        <div className="new_navbar_container">
          <div className="new_navbar_inline">
            <Link to="/dashboard">
              <div className="appheader-logo" onClick={this.headerUpdated} />
            </Link>
            
            <div className="landing_signup_container">
              <div className="header_profile" onClick={this.onToggleProfile}/>
              <div className="bell" onClick={this.onToggleBell}/>
              <div className="heart_off" onClick={this.onToggleHeart}/>
              {
                langState === 0 ? <div className="lang_eng" onClick={this.onToggleLang}/> : <div className="lang_fre" onClick={this.onToggleLang}/>
              }

            </div>
  
            {
              langClicked &&
              <div className="expandview1">
                <div className="triangle"/>
                <div className="changelanguage">
                  {lang.change_language}
                </div>
                <div className="changelangbar"/>
                <div>
                  <div className={langState === 0 ? "changelanguage1 grayback" : "changelanguage1"} onClick={this.onEng}>
                    {lang.english}
                  </div>
                  {
                    langState === 0 &&
                    <div className="checkmark"/>
                  }
                </div>
                <div>
                  <div className={langState === 1 ? "changelanguage1 grayback" : "changelanguage1"} onClick={this.onFre}>
                    {lang.french}
                  </div>
                  {
                    langState === 1 &&
                    <div className="checkmark"/>
                  }
                </div>
              </div>
            }
  
            {
              profileClicked &&
              <div className="expandview2">
                <div className="triangle2"/>
      
                <div className="hitxt redtext">
                  {lang.hi}, Alexander Ignacz!
                </div>
      
                <div className="hitxtbar"/>
      
                <Link to="/myprofile">
                  <div className="hitxt1" onClick={this.onMyProfile}>
                    {lang.my_profile}
                  </div>
                </Link>
      
                <div className="hitxtbar"/>
      
                <div className="hitxt1" onClick={this.onSettings}>
                  {lang.settings}
                </div>
      
                <div className="hitxtbar"/>
      
                <Link to="/signin">
                  <div className="hitxt1" onClick={this.onLogOut}>
                    {lang.logout1}
                  </div>
                </Link>
    
              </div>
            }
            
            <div className="createyourprofiletxt">
              {lang.create_your_profile}
            </div>

          </div>
        </div>
      );
    }
    return ( // landing page
      <div className="new_navbar_container">
        <div className="new_navbar_inline">
          
          <Link to="/dashboard">
            <div className="appheader-logo" onClick={this.headerUpdated} />
          </Link>
          
          <div className="landing_signup_container">
            <Link to="/signup">
              <div className="landig_signup">{lang.sign_up}</div>
            </Link>
            
            <Link to="/signin">
              <div className="landig_signup">{lang.sign_in}</div>
            </Link>
          </div>
  
        </div>
      </div>
    );
  }
}

export default Header;
