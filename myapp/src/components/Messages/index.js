import React, { PropTypes } from 'react';
import "./styles.css"

export default class Messages extends React.Component {
  
  constructor() {
    super();
    this.state = {
    };
  }
  
  componentDidMount() {
    setTimeout(() => {
      this.props.updateHeader(12);
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

Messages.propTypes = {
  updateHeader: PropTypes.func.isRequired
};
