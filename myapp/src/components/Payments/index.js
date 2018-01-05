import React, { PropTypes } from 'react';
import "./styles.css"

export default class Payments extends React.Component {
  
  constructor() {
    super();
    this.state = {
    };
  }
  
  componentDidMount() {
    this.props.updateHeader(11);
  }
  
  render() {
    return (
      <div>
        <div className="col-sm-12 centerContent">
          <div className="mytasks_top_selector">
          </div>
        </div>
      </div>
    )
  }
}

Payments.propTypes = {
  updateHeader: PropTypes.func.isRequired
};
