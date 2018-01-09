import React, { PropTypes } from 'react';
import "./styles.css";
import {reactLocalStorage} from 'reactjs-localstorage';
import { Redirect } from 'react-router';
import Scroll from "react-scroll";
import { eng, fre } from '../../lang';

export default class Landing extends React.Component {
  
  constructor() {
    super();
    this.state = {
      redirect: 0,
      lang_expand: false,
      lang: "english",
      device_lang: eng,
    }
  }
  
  componentDidMount() {
    this.props.updateHeader(0);
    if (reactLocalStorage.get("device_language") === undefined) {
      reactLocalStorage.set("device_language", "english");
      this.setState({ lang: "english" });
    } else {
      this.setState({ lang: reactLocalStorage.get("device_language") });
    }
  }

  getWidth = () => {
    return Math.max(
      document.body.scrollWidth,
      document.documentElement.scrollWidth,
      document.body.offsetWidth,
      document.documentElement.offsetWidth,
      document.documentElement.clientWidth
    );
  };

  goToHow = () => {
    let scroll = Scroll.animateScroll;
    let height = 0;
    height += this.getWidth() * 974 / 1700; // section1
    height += 20; // section2 top padding1
    height += 10; // section2 image top margin1
    height += this.getWidth() * 15 * 226 / 100 / 339; // section image height
    height += 5; // section2 padding bottom
    height += 20; // section2 image1 text height

    height += 20; // section2 top padding1
    height += 10; // section2 image top margin1
    height += this.getWidth() * 15 * 226 / 100 / 339; // section image height
    height += 5; // section2 padding bottom
    height += 20; // section2 image1 text height

    height += 54;

    height += 20; // section3 margin top
    height += this.getWidth() * 6 / 10 - 100; // section 3 height

    height -= 50;

    scroll.scrollTo(height);
  };

  goToDownload = () => {
    let scroll = Scroll.animateScroll;
    let height = 0;
    height += this.getWidth() * 974 / 1700; // section1
    height += 20; // section2 top padding1
    height += 10; // section2 image top margin1
    height += this.getWidth() * 15 * 226 / 100 / 339; // section image height
    height += 5; // section2 padding bottom
    height += 20; // section2 image1 text height

    height += 20; // section2 top padding1
    height += 10; // section2 image top margin1
    height += this.getWidth() * 15 * 226 / 100 / 339; // section image height
    height += 5; // section2 padding bottom
    height += 20; // section2 image1 text height

    height += 54;

    height += 20; // section3 margin top
    height += this.getWidth() * 6 / 10 - 100; // section 3 height

    height += (this.getWidth() - 500) * 524 / 1014; // section 4 height
    height += 50; // section4 bottom padding

    height += 40; //section5 top padding

    height += 10;
    height += this.getWidth() * 12 * 311 / 100 / 232;
    height += 30;
    height += 25;
    height += 21;
    height += 25;
    height += 40; //section5 bottom padding

    scroll.scrollTo(height);
  };

  onCreate = () => {
    this.setState({ redirect: 1 });
  };

  onLogin = () => {
    this.setState({ redirect: 2 });
  };

  exploreTasks = () => {
    reactLocalStorage.set("sign_state", "false");
    this.setState({ redirect: 3 });
  };

  onPost = () => {
    reactLocalStorage.set("sign_state", "false");
    this.setState({ redirect: 4 });
  };

  becomeTasker = () => {
    this.setState({ redirect: 1 });
  };

  changeLangExpand = () => {
    this.setState({ lang_expand: !this.state.lang_expand })
  };

  onEnglish = () => {
    this.setState({ lang: "english" });
    this.changeLangExpand();
    reactLocalStorage.set("device_language", "english");
  };

  onFrench = () => {
    this.setState({ lang: "french" });
    this.changeLangExpand();
    reactLocalStorage.set("device_language", "french");
  };

  render() {
    const { redirect, lang_expand, device_lang } = this.state;
    if (redirect === 1) {
      return <Redirect push to="/signup"/>;
    }
    if (redirect === 2) {
      return <Redirect push to="/signin"/>;
    }
    if (redirect === 3) {
      return <Redirect push to="/exploretasks"/>;
    }
    if (redirect === 4) {
      return <Redirect push to="/post"/>;
    }
    return (
      <div className="scroll">

        <div className="logo_section1">
          <div className="landing_header">
            <div className="landing_header_signupbtn" onClick={this.onCreate}>
              {device_lang.create_account}
            </div>
            <div className="landing_header_signupbtn" onClick={this.onLogin}>
              {device_lang.login}
            </div>
            <div className="landing_header_signupbtn">
              {device_lang.faq}
            </div>
            <div className="landing_header_signupbtn" onClick={this.goToDownload}>
              {device_lang.download_app}
            </div>
            <div className="landing_header_signupbtn" onClick={this.goToHow}>
              {device_lang.how_it_works}
            </div>
            <div className="landing_header_signupbtn">
              <div className="landing_www" onClick={this.changeLangExpand}/>
              <div className="landing_langtxt" onClick={this.changeLangExpand}>
                {
                  this.state.lang === "english" ? device_lang.english : device_lang.french
                }
              </div>
              <div className="lang_downarrow"/>
              {
                lang_expand &&
                  <div className="landing_lang_expand">
                    <div className="landing_lang_expand_txt1">
                      {device_lang.change_language}
                    </div>
                    <div className="landing_lang_expand_txt1_bar"/>
                    {
                      this.state.lang === "english" ?
                        <div className="landing_lang_expand_1_lightgray" onClick={this.onEnglish}>
                          <div className="landing_lang_expand_txt2">
                            {device_lang.english}
                          </div>
                          {
                            this.state.lang === "english" ? <div className="landing_lang_expand_check_on"/> : <div className="landing_lang_expand_check_off"/>
                          }
                        </div>
                        :
                        <div className="landing_lang_expand_1" onClick={this.onEnglish}>
                          <div className="landing_lang_expand_txt2">
                            {device_lang.english}
                          </div>
                          {
                            this.state.lang === "english" ? <div className="landing_lang_expand_check_on"/> : <div className="landing_lang_expand_check_off"/>
                          }
                        </div>
                    }

                    {
                      this.state.lang === "french" ?
                        <div className="landing_lang_expand_1_lightgray" onClick={this.onFrench}>
                          <div className="landing_lang_expand_txt2">
                            {device_lang.french}
                          </div>
                          {
                            this.state.lang === "french" ? <div className="landing_lang_expand_check_on"/> : <div className="landing_lang_expand_check_off"/>
                          }
                        </div>
                        :
                        <div className="landing_lang_expand_1" onClick={this.onFrench}>
                          <div className="landing_lang_expand_txt2">
                            {device_lang.french}
                          </div>
                          {
                            this.state.lang === "french" ? <div className="landing_lang_expand_check_on"/> : <div className="landing_lang_expand_check_off"/>
                          }
                        </div>
                    }
                  </div>
              }
            </div>
            <div className="landing_header_logo"/>
          </div>
          <div className="landing_section1_btncontain">
            <div className="landing_section1_explore" onClick={this.exploreTasks}>
              {device_lang.explore_tasks}
            </div>
          </div>
          <div className="landing_section1_btncontain">
            <div className="landing_section1_post" onClick={this.onPost}>
              {device_lang.post_a_task}
            </div>
          </div>
        </div>

        <div className="logo_section2">
          <div className="logo_section2_left">
            <div className="logo_section2_left_startearningtxt1">
              {device_lang.start_earning_with_yeepi_today}
            </div>
            <div className="logo_section2_left_startearningtxt2">
              {device_lang.being_your_own_boss_and_working__}
            </div>
            <div className="logo_section2_left_startearningtxt3" onClick={this.becomeTasker}>
              {device_lang.become_a_tasker}
            </div>
          </div>

          <div className="logo_section2_right">
            <div className="logo_section2_right1">
              <div className="logo_testimg1" onClick={this.onPost}/>
              <div className="logo_testimg2" onClick={this.onPost}/>
              <div className="logo_testimg3" onClick={this.onPost}/>
            </div>
            <div className="logo_section2_right2">
              <div className="logo_testtxt">{device_lang.moving_and_delivery}</div>
              <div className="logo_testtxt">{device_lang.assembly}</div>
              <div className="logo_testtxt">{device_lang.house_cleaning}</div>
            </div>
            <div className="logo_section2_right1">
              <div className="logo_testimg4" onClick={this.onPost}/>
              <div className="logo_testimg5" onClick={this.onPost}/>
              <div className="logo_testimg6" onClick={this.onPost}/>
            </div>
            <div className="logo_section2_right2">
              <div className="logo_testtxt">{device_lang.painting}</div>
              <div className="logo_testtxt">{device_lang.beauty_and_care}</div>
              <div className="logo_testtxt">{device_lang.tvmoving}</div>
            </div>
            <div className="logo_section2_right3">
              {device_lang.and_much_more__}...
            </div>
          </div>
        </div>

        <div className="logo_section3">

          <div className="landing_section3_left_graphics"/>
          <div className="landing_section3_right">
            <div className="logo_section2_left_startearningtxt1">
              {device_lang.landing_section3_desc1}
            </div>
            <div className="logo_section2_left_startearningtxt2">
              {device_lang.landing_section3_desc2}
            </div>
            <div className="logo_section2_left_startearningtxt3">
              {device_lang.learn_more}
            </div>
            <div className="logo_section2_left_startearningtxt1">
              {device_lang.landing_section3_desc3}
            </div>
          </div>

          <div className="logo_section3_bottom"/>

        </div>

        <div className="logo_section4"/>

        <div className="logo_section5">

          <div className="logo_section2_left">
            <div className="logo_section2_left_startearningtxt1">
              {device_lang.landing_section4_desc1}
            </div>
            <div className="logo_section2_left_startearningtxt2">
              {device_lang.landing_section4_desc2}
            </div>
            <div className="logo_section2_left_startearningtxt3" onClick={this.onPost}>
              {device_lang.post_a_task}
            </div>
          </div>

          <div className="logo_section2_right">
            <div className="logo_section2_right1">
              <div className="logo_toprate_container">
                <div className="top_rated_avatar">
                  <div className="top_rated_badge">
                    <div className="whitestar"/>
                    <div className="toprated">
                      {device_lang.top_rated}
                    </div>
                  </div>
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
                <div className="top_rated_avatar">
                  <div className="top_rated_badge">
                    <div className="whitestar"/>
                    <div className="toprated">
                      Top Rated
                    </div>
                  </div>
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
                <div className="top_rated_avatar">
                  <div className="top_rated_badge">
                    <div className="whitestar"/>
                    <div className="toprated">
                      Top Rated
                    </div>
                  </div>
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
              <div className="logo_toprate_container lowopacity">
                <div className="top_rated_avatar">
                  <div className="top_rated_badge">
                    <div className="whitestar"/>
                    <div className="toprated">
                      Top Rated
                    </div>
                  </div>
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
            </div>
          </div>

        </div>

        <div className="logo_section6">
          <div className="landing_appstore"/>
          <div className="landing_googleplay"/>
        </div>

        <div className="logo_section7">
          <div className="logo_section7_txt1">
            {device_lang.landing_section7_desc1}
          </div>
          <div className="logo_section7_txt2">
            {device_lang.landing_section7_desc2}
          </div>
          <div className="logo_section7_txt3">
            {device_lang.landing_section7_desc3}
          </div>
          <div className="logo_section7_btncontainer">
            <div className="landing_wantpost_btn" onClick={this.onPost}>
              {device_lang.i_want_to_post_a_task}
            </div>
            <div className="landing_wanttask_btn" onClick={this.exploreTasks}>
              {device_lang.i_want_to_become_a_tasker}
            </div>
          </div>
        </div>

        <div className="logo_section8">
          <div className="logo_section8_content">

            <div className="logo_section8_content1">
              <div className="landing_logo1"/>
            </div>

            <div className="logo_section8_content2">
              <div className="logo_section8_content2_txt1">{device_lang.discover}</div>
              <div className="logo_section8_content2_txt2">{device_lang.how_yeepi_works}</div>
              <div className="logo_section8_content2_txt3">{device_lang.trust_and_safety}</div>
              <div className="logo_section8_content2_txt3">{device_lang.invite_friends}</div>
              <div className="logo_section8_content2_txt3">{device_lang.carriers}</div>
            </div>

            <div className="logo_section8_content3">
              <div className="logo_section8_content2_txt1">{device_lang.company}</div>
              <div className="logo_section8_content2_txt2">{device_lang.about}</div>
              <div className="logo_section8_content2_txt3">{device_lang.help}</div>
              <div className="logo_section8_content2_txt3">{device_lang.terms_and_conditions}</div>
              <div className="logo_section8_content2_txt3">{device_lang.privacy_policy}</div>
            </div>

            <div className="logo_section8_content4">
              <div className="logo_section8_content2_txt1">{device_lang.social_media}</div>
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
              <div className="logo_section8_content5_lang" onClick={this.changeLangExpand}>
                <div>{ this.state.lang === "english" ? device_lang.english : device_lang.french }</div>
                <div className="black_downarrow"/>
              </div>
              {
                lang_expand &&
                <div className="landing_lang_expand">
                  <div className="landing_lang_expand_txt1">
                    {device_lang.change_language}
                  </div>
                  <div className="landing_lang_expand_txt1_bar"/>
                  {
                    this.state.lang === "english" ?
                      <div className="landing_lang_expand_1_lightgray" onClick={this.onEnglish}>
                        <div className="landing_lang_expand_txt2">
                          {device_lang.english}
                        </div>
                        {
                          this.state.lang === "english" ? <div className="landing_lang_expand_check_on"/> : <div className="landing_lang_expand_check_off"/>
                        }
                      </div>
                      :
                      <div className="landing_lang_expand_1" onClick={this.onEnglish}>
                        <div className="landing_lang_expand_txt2">
                          {device_lang.english}
                        </div>
                        {
                          this.state.lang === "english" ? <div className="landing_lang_expand_check_on"/> : <div className="landing_lang_expand_check_off"/>
                        }
                      </div>
                  }

                  {
                    this.state.lang === "french" ?
                      <div className="landing_lang_expand_1_lightgray" onClick={this.onFrench}>
                        <div className="landing_lang_expand_txt2">
                          {device_lang.french}
                        </div>
                        {
                          this.state.lang === "french" ? <div className="landing_lang_expand_check_on"/> : <div className="landing_lang_expand_check_off"/>
                        }
                      </div>
                      :
                      <div className="landing_lang_expand_1" onClick={this.onFrench}>
                        <div className="landing_lang_expand_txt2">
                          {device_lang.french}
                        </div>
                        {
                          this.state.lang === "french" ? <div className="landing_lang_expand_check_on"/> : <div className="landing_lang_expand_check_off"/>
                        }
                      </div>
                  }
                </div>
              }

            </div>

          </div>
        </div>

        <div className="logo_section9">
          <div className="logo_section9_txt1">{device_lang.copyright}</div>
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
