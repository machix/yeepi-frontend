import React, { PropTypes } from 'react';
import "./styles.css";
import {reactLocalStorage} from 'reactjs-localstorage';
import { Redirect } from 'react-router';

export default class Landing extends React.Component {
  
  constructor() {
    super();
    this.state = {
      redirect: 0,
    }
  }
  
  componentDidMount() {
    this.props.updateHeader(0);
  }

  render() {
    const { redirect } = this.state;
    return (
      <div>

        <div className="logo_section1">
          <div className="landing_header">
            <div className="landing_header_signupbtn">
              Create Account
            </div>
            <div className="landing_header_signupbtn">
              Login
            </div>
            <div className="landing_header_signupbtn">
              FAQ
            </div>
            <div className="landing_header_signupbtn">
              Download App
            </div>
            <div className="landing_header_signupbtn">
              How it Works
            </div>
            <div className="landing_header_signupbtn">
              English
            </div>
            <div className="landing_header_logo"/>
          </div>
        </div>

        <div className="logo_section2">
          <div className="logo_section2_left">
            <div className="logo_section2_left_startearningtxt1">
              Start Earning With Yeepi Today
            </div>
            <div className="logo_section2_left_startearningtxt2">
              Being your own boss and working for yourself is rewarding. Earn extra income while helping the people around you!  Get access to thousands of tasks posted by people in your own neighborhood.
            </div>
            <div className="logo_section2_left_startearningtxt3">
              Become a Tasker
            </div>
          </div>

          <div className="logo_section2_right">
            <div className="logo_section2_right1">
              <div className="logo_testimg1"/>
              <div className="logo_testimg2"/>
              <div className="logo_testimg3"/>
            </div>
            <div className="logo_section2_right2">
              <div className="logo_testtxt">Moving & Delivery</div>
              <div className="logo_testtxt">Assembly</div>
              <div className="logo_testtxt">House Cleaning</div>
            </div>
            <div className="logo_section2_right1">
              <div className="logo_testimg4"/>
              <div className="logo_testimg5"/>
              <div className="logo_testimg6"/>
            </div>
            <div className="logo_section2_right2">
              <div className="logo_testtxt">Painting</div>
              <div className="logo_testtxt">Beauty & Care</div>
              <div className="logo_testtxt">TV Mounting</div>
            </div>
            <div className="logo_section2_right3">
              And much more...
            </div>
          </div>
        </div>

        <div className="logo_section3">

          <div className="landing_section3_left_graphics"/>
          <div className="landing_section3_right">
            <div className="logo_section2_left_startearningtxt1">
              Start Earning With Yeepi Today
            </div>
            <div className="logo_section2_left_startearningtxt2">
              Being your own boss and working for yourself is rewarding. Earn extra income while helping the people around you!  Get access to thousands of tasks posted by people in your own neighborhood.
            </div>
            <div className="logo_section2_left_startearningtxt3">
              Learn More
            </div>
            <div className="logo_section2_left_startearningtxt1">
              $2 Millions of Insurance covered in Bolt only on Yeepi!
            </div>
          </div>

          <div className="logo_section3_bottom"/>

        </div>

        <div className="logo_section4"/>

        <div className="logo_section5">

          <div className="logo_section2_left">
            <div className="logo_section2_left_startearningtxt1">
              Hire Skilled Professionals within in minutes, to get al your work done.
            </div>
            <div className="logo_section2_left_startearningtxt2">
              Our skilled professionals go above and beyond on every job. Taskers are rated and reviewed after each task. Our trusted Yeepi Taskers are ready to complete your task today, just post it and we will do it.
            </div>
            <div className="logo_section2_left_startearningtxt3">
              Post a Task
            </div>
          </div>

          <div className="logo_section2_right">
            <div className="logo_section2_right1">
              <div className="logo_toprate_container">
                <div className="top_rated_avatar">
                  <div className="top_rated_badge"></div>
                </div>
                <div className="top_rated_txt1">Zack Snyder</div>
                <div className="top_rated_txt2">Handyman on Yeepi</div>
                <div className="top_rated_star">
                  <div className="top_rated_star1"/>
                  <div className="top_rated_star1"/>
                  <div className="top_rated_star1"/>
                  <div className="top_rated_star1"/>
                  <div className="top_rated_star1"/>
                </div>
                <div className="top_rated_txt2">657 Jobs Done</div>
              </div>
              <div className="logo_toprate_container">
                <div className="top_rated_avatar"/>
                <div className="top_rated_txt1">Zack Snyder</div>
                <div className="top_rated_txt2">Handyman on Yeepi</div>
                <div className="top_rated_star">
                  <div className="top_rated_star1"/>
                  <div className="top_rated_star1"/>
                  <div className="top_rated_star1"/>
                  <div className="top_rated_star1"/>
                  <div className="top_rated_star1"/>
                </div>
                <div className="top_rated_txt2">657 Jobs Done</div>
              </div>
              <div className="logo_toprate_container">
                <div className="top_rated_avatar"/>
                <div className="top_rated_txt1">Zack Snyder</div>
                <div className="top_rated_txt2">Handyman on Yeepi</div>
                <div className="top_rated_star">
                  <div className="top_rated_star1"/>
                  <div className="top_rated_star1"/>
                  <div className="top_rated_star1"/>
                  <div className="top_rated_star1"/>
                  <div className="top_rated_star1"/>
                </div>
                <div className="top_rated_txt2">657 Jobs Done</div>
              </div>
              <div className="logo_toprate_container lowopacity">
                <div className="top_rated_avatar"/>
                <div className="top_rated_txt1">Zack Snyder</div>
                <div className="top_rated_txt2">Handyman on Yeepi</div>
                <div className="top_rated_star">
                  <div className="top_rated_star1"/>
                  <div className="top_rated_star1"/>
                  <div className="top_rated_star1"/>
                  <div className="top_rated_star1"/>
                  <div className="top_rated_star1"/>
                </div>
                <div className="top_rated_txt2">657 Jobs Done</div>
              </div>
            </div>
          </div>

        </div>

        <div className="logo_section6">
          <div className="landing_appstore"/>
          <div className="landing_googleplay"/>
        </div>

        <div className="logo_section7">
          <div className="logo_section7_txt1">
            Join Yeepi, the only platform with 2 million bolt insurance
          </div>
          <div className="logo_section7_txt2">
            Get Yeepi free forever!
          </div>
          <div className="logo_section7_txt3">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
          </div>
          <div className="logo_section7_btncontainer">
            <div className="landing_wantpost_btn">
              I want to Post a Task
            </div>
            <div className="landing_wanttask_btn">
              I want to become a Tasker
            </div>
          </div>
        </div>

        <div className="logo_section8">
          <div className="logo_section8_content">

            <div className="logo_section8_content1">
              <div className="landing_logo1"/>
            </div>

            <div className="logo_section8_content2">
              <div className="logo_section8_content2_txt1">Discover</div>
              <div className="logo_section8_content2_txt2">How Yeepi Works</div>
              <div className="logo_section8_content2_txt3">Trust and Safety</div>
              <div className="logo_section8_content2_txt3">Invite Friends</div>
              <div className="logo_section8_content2_txt3">Carriers</div>
            </div>

            <div className="logo_section8_content3">
              <div className="logo_section8_content2_txt1">Company</div>
              <div className="logo_section8_content2_txt2">About</div>
              <div className="logo_section8_content2_txt3">Help</div>
              <div className="logo_section8_content2_txt3">Terms and Conditions</div>
              <div className="logo_section8_content2_txt3">Privacy Policy</div>
            </div>

            <div className="logo_section8_content4">
              <div className="logo_section8_content2_txt1">Social Media</div>
              <div className="logo_section8_content4_socialcontainer">
                <div className="socialmedia1"/>
                <div className="socialmedia2"/>
                <div className="socialmedia3"/>
              </div>
              <div className="logo_section8_content4_socialcontainer">
                <div className="socialmedia4"/>
                <div className="socialmedia5"/>
              </div>
            </div>

            <div className="logo_section8_content5">
              <div className="logo_section8_content5_lang">
                <div>English</div>
                <div className="black_downarrow"/>
              </div>
            </div>

          </div>
        </div>

        <div className="logo_section9">
          <div className="logo_section9_txt1">All rights reserved. Copyrighted by Yeepi Inc.</div>
          <div className="copyright"/>
          <div className="logo_section9_txt2">2018</div>
        </div>

      </div>
    );
  }
}

Landing.propTypes = {
  updateHeader: PropTypes.func.isRequired
};
