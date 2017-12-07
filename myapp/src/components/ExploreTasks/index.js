import React, { PropTypes } from 'react';
import "./styles.css"

export default class ExploreTasks extends React.Component {
  
  constructor() {
    super();
    this.state = {
      pageState: 0,
    };
  }
  
  componentDidMount() {
    setTimeout(() => {
      this.props.updateHeader(10);
    }, 100);
  }
  
  render() {
    const { pageState } = this.state;
    return (
      <div>
        <div className="col-sm-12 centerContent">
          <div className="exploretasks_top_selector">
            <div className={pageState === 0 ? "exploretasks_top_selector1 borderbottom" : "exploretasks_top_selector1"} onClick={() => { this.setState({ pageState: 0 }) }}>ListView</div>
            <div className={pageState === 1 ? "exploretasks_top_selector1 borderbottom" : "exploretasks_top_selector1"} onClick={() => { this.setState({ pageState: 1 }) }}>MapView</div>
          </div>
        </div>
      </div>
    )
  }
}

ExploreTasks.propTypes = {
  updateHeader: PropTypes.func.isRequired
};
