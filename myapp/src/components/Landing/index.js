import React, { PropTypes } from 'react';
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
  
  maskedPhoneNumber = v => {
    let r = v.replace(/\D/g,"");
    if (r.length === 15) {
      r = r.replace(/^(\d{5})(\d{3})(\d{3})(\d{4}).*/,"+$1 ($2) $3-$4");
    } else if (r.length === 14) {
      r = r.replace(/^(\d{4})(\d{3})(\d{3})(\d{4}).*/,"+$1 ($2) $3-$4");
    } else if (r.length === 13) {
      r = r.replace(/^(\d{3})(\d{3})(\d{3})(\d{4}).*/,"+$1 ($2) $3-$4");
    } else if (r.length === 12) {
      r = r.replace(/^(\d{2})(\d{3})(\d{3})(\d{4}).*/,"+$1 ($2) $3-$4");
    } else if (r.length === 11) {
      r = r.replace(/^(\d{1})(\d{3})(\d{3})(\d{4}).*/,"+$1 ($2) $3-$4");
    } else if (r.length === 10) {
      r = r.replace(/^(\d{3})(\d{3})(\d{4}).*/,"($1) $2-$3");
    } else if (r.length === 9) {
      r = r.replace(/^(\d{2})(\d{3})(\d{4}).*/,"($1) $2-$3");
    }
    return r;
  };
  
  render() {
    const { redirect } = this.state;
    // let value = "123123123120"
    // let formatted = value.replace(/^(\d{3})(\d{3})(\d{4}).*/, '($1) $2-$3');
    let formatted = this.mphone("234 567 8989");
    return (
      <div className="home-page">
        Landing Page (Coming Soon) {formatted}
      </div>
    );
  }
}

Landing.propTypes = {
  updateHeader: PropTypes.func.isRequired
};
