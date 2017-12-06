import React, { PropTypes } from 'react';
import "./styles.css"

export default class ExploreTasks extends React.Component {
  
  constructor() {
    super();
    this.state = {
    };
  }
  
  componentDidMount() {
    setTimeout(() => {
      this.props.updateHeader(10);
    }, 100);
  }
  
  render() {
    return (
      <div>
        <div className="col-sm-12 centerContent">
          <div className="mytasks_top_selector">
            X
          </div>
        </div>
      </div>
    )
  }
}

ExploreTasks.propTypes = {
  updateHeader: PropTypes.func.isRequired
};
