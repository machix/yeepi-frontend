import React, { PropTypes } from 'react';
import ReactList from 'react-list';
import "./styles.css"

export default class Dashboard extends React.Component {
  
  constructor() {
    super();
    this.state = {
      pageState: 0,
    };
  }
  
  componentDidMount() {
    setTimeout(() => {
      this.props.updateHeader(13);
    }, 100);
  }
  
  renderItem = (index, key) => {
    return (
      <div key={"react_list_key" + index} className="tasklist_item1">
        <div className="tasklist_item_real1">
          <div>
            <div className="boldtext">
              Very Helpful!
            </div>
            <div className="graytext">
              Description1 Description1 Description1 Description1 Description1 Description1 Description1 Description1 Description1 Description1 Description1 Description1 Description1 Description1.
            </div>
            <div className="starcontainer">
              <div className="star"/>
              <div className="star"/>
              <div className="star"/>
              <div className="star"/>
              <div className="star"/>
            </div>
            <div className="fromusercontainer"></div>
          </div>
        </div>
        <div className="tasklist_item_real_bar1"/>
      </div>
    );
  };
  
  render() {
    const { pageState } = this.state;
    return (
      <div>
        <div className="col-sm-12 centerContent">
          <div className="mytasks_top_selector">
            <div className={pageState === 0 ? "mytasks_top_selector1 borderbottom" : "mytasks_top_selector1"} onClick={() => { this.setState({ pageState: 0 }) }}>Tasker Profile</div>
            <div className={pageState === 1 ? "mytasks_top_selector1 borderbottom" : "mytasks_top_selector1"} onClick={() => { this.setState({ pageState: 1 }) }}>Poster Profile</div>
          </div>
          <div className="view1">
            <div className="view2">
              <div className="avatarContainer">
                <div className="avatar"/>
              </div>
              <div className="nameContainer">
                <div className="name">Alexander Ignacz</div>
              </div>
              <div className="restContainer1">
                <div className="restSub3">
                  <div className="weakright">OFFERS</div>
                  <div className="weakright1">MADE</div>
                </div>
                <div className="restSub4">
                  <div className="boldright">01</div>
                </div>
              </div>
              <div className="restContainer1">
                <div className="restSub1">
                  <div className="weakright">TASKS</div>
                  <div className="weakright1">ASSIGNED</div>
                </div>
                <div className="restSub2">
                  <div className="boldright">01</div>
                </div>
              </div>
              <div className="restContainer1">
                <div className="restSub1">
                  <div className="weakright">PENDING</div>
                  <div className="weakright1">PAYMENTS</div>
                </div>
                <div className="restSub2">
                  <div className="boldright">01</div>
                </div>
              </div>
            </div>
          </div>
          <div className="view1">
            <div className="view2">
              <div className="avatarContainer"/>
              <div className="nameContainer"/>
              <div className="restContainer1">
                <div className="restSub3">
                  <div className="weakright2">RATING</div>
                </div>
                <div className="restSub4">
                  <div className="boldright">4.5/5</div>
                </div>
              </div>
              <div className="restContainer1">
                <div className="restSub1">
                  <div className="weakright">CANCELLATION</div>
                  <div className="weakright1">RATE</div>
                </div>
                <div className="restSub2">
                  <div className="boldright">5%</div>
                </div>
              </div>
              <div className="restContainer1">
                <div className="restSub1">
                  <div className="weakright">TASKS</div>
                  <div className="weakright1">COMPLETED</div>
                </div>
                <div className="restSub2">
                  <div className="boldright">01</div>
                </div>
              </div>
            </div>
          </div>
          
          
          <div className="view3">
            <div className="view4">
              <div className="view5">
                <div className="reviewtext">
                  Reviews
                </div>
                <div className="reviewcontainer">
                  <ReactList
                    itemRenderer={this.renderItem}
                    length={10}
                  />
                </div>
              </div>
              <div className="view6">
  
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Dashboard.propTypes = {
  updateHeader: PropTypes.func.isRequired
};
