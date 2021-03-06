/* eslint-disable */
import agent from '../agent';
import Header from './Header';
import React from 'react';
import { connect } from 'react-redux';
import { APP_LOAD, REDIRECT } from '../constants/actionTypes';
import { Route, Switch } from 'react-router-dom';
import Article from '../components/Article';
import Editor from '../components/Editor';
import Home from '../components/Home';
import Login from '../components/Login';
import Profile from '../components/Profile';
import ProfileFavorites from '../components/ProfileFavorites';
import Register from '../components/Register';
import Settings from '../components/Settings';
import { store } from '../store';
import { push } from 'react-router-redux';
import Landing from "./Landing/index";
import Signup from "./Auth/Signup";
import SignupStripe from "./Auth/SignupStripe";
import Signin from "./Auth/Signin";
import Post from "./Post";
import MyProfile from "./Profile/MyProfile";
import EditProfile from "./Profile/EditProfile";
import EditProfile2 from "./Profile/EditProfile2";
import MyTasks from "./MyTasks";
import ExploreTasks from "./ExploreTasks";
import Payments from "./Payments";
import Messages from "./Messages";
import Dashboard from "./Dashboard";
import TaskSummary from "./TaskSummary";

const mapStateToProps = state => {
  return {
    appLoaded: state.common.appLoaded,
    appName: state.common.appName,
    currentUser: state.common.currentUser,
    redirectTo: state.common.redirectTo
  }};

const mapDispatchToProps = dispatch => ({
  onLoad: (payload, token) =>
    dispatch({ type: APP_LOAD, payload, token, skipTracking: true }),
  onRedirect: () =>
    dispatch({ type: REDIRECT })
});

class App extends React.Component {
  
  constructor() {
    super();
    this.state = {
      displayHeader: true,
    }
  }
  
  componentWillReceiveProps(nextProps) {
    if (nextProps.redirectTo) {
      // this.context.router.replace(nextProps.redirectTo);
      store.dispatch(push(nextProps.redirectTo));
      this.props.onRedirect();
    }
  }

  componentWillMount() {
    const token = window.localStorage.getItem('jwt');
    if (token) {
      agent.setToken(token);
    }

    this.props.onLoad(token ? agent.Auth.current() : null, token);
  }
  
  updateHeader = i => {
    if (i === 0) {
      this.setState({ displayHeader: false })
    } else {
      this.setState({ displayHeader: true });
      this._refHeader.updateHeader(i);
    }
  };
  
  onUpdateLang = (i) => {
    if (this._ref_signupstripe)
      this._ref_signupstripe.onUpdateLang(i);
    if (this._ref_myprofile)
      this._ref_myprofile.onUpdateLang(i);
  };
  
  onClickPost = () => {
    this._ref_post.update();
  };
  
  render() {
    if (this.props.appLoaded) {
      return (
        <div className="fitContent">
          {
            this.state.displayHeader &&
              <Header
                appName={this.props.appName}
                currentUser={this.props.currentUser}
                ref={(r) => { this._refHeader = r; }}
                onUpdateLang={this.onUpdateLang}
                onClickPost={this.onClickPost}
              />
          }
          <Switch>
            <Route exact path="/" render={() => <Landing updateHeader={this.updateHeader} /> } />
            <Route exact path="/signup" render={() => <Signup updateHeader={this.updateHeader} /> } />
            <Route exact path="/signup/stripe" render={() => <SignupStripe updateHeader={this.updateHeader}  ref={(ref) => {this._ref_signupstripe = ref;}}/> }/>
            <Route exact path="/signin" render={() => <Signin updateHeader={this.updateHeader} /> } />
            <Route exact path="/post" render={() => <Post updateHeader={this.updateHeader} ref={(ref) => {this._ref_post = ref;}}/> }/>
            <Route exact path="/myprofile" render={() => <MyProfile updateHeader={this.updateHeader} ref={(ref) => {this._ref_myprofile = ref;}}/> }/>
            <Route exact path="/editprofile/1" render={() => <EditProfile updateHeader={this.updateHeader} ref={(ref) => {this._ref_editprofile = ref;}}/> }/>
            <Route exact path="/editprofile/2" render={() => <EditProfile2 updateHeader={this.updateHeader} ref={(ref) => {this._ref_editprofile2 = ref;}}/> }/>
            <Route exact path="/mytasks" render={() => <MyTasks updateHeader={this.updateHeader} ref={(ref) => {this._ref_mytasks = ref;}}/> }/>
            <Route exact path="/exploretasks" render={() => <ExploreTasks updateHeader={this.updateHeader} ref={(ref) => {this._ref_exploretasks = ref;}}/> }/>
            <Route exact path="/payments" render={() => <Payments updateHeader={this.updateHeader} ref={(ref) => {this._ref_payments = ref;}}/> }/>
            <Route exact path="/messages" render={() => <Messages updateHeader={this.updateHeader} ref={(ref) => {this._ref_messages = ref;}}/> }/>
            <Route exact path="/dashboard" render={() => <Dashboard updateHeader={this.updateHeader} ref={(ref) => {this._ref_dashboard = ref;}}/> }/>
            <Route exact path="/tasksummary" render={() => <TaskSummary updateHeader={this.updateHeader} ref={(ref) => {this._ref_tasksummary = ref;}}/> }/>
          </Switch>
        </div>
      );
    }
    return (
      <div>
        <Header
          appName={this.props.appName}
          currentUser={this.props.currentUser}
        />
      </div>
    );
  }
}

// App.contextTypes = {
//   router: PropTypes.object.isRequired
// };

export default connect(mapStateToProps, mapDispatchToProps)(App);
