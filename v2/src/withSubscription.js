import React, { Component } from 'react';

const API_BASE_URL = 'https://api-v3.mbta.com/';

// Handles logic of connecting to MBTA API and requesting updates periodically. Returns passed in component with data from subscription passed as props
function withSubscription(WrappedComponent, apiUrl = API_BASE_URL) {
  return class WithSubscription extends Component {
    constructor(props) {
      super(props);

      this.state = {
        data: '',
      };
    }

    componentDidMount() {}

    render() {
      return <WrappedComponent {...this.props} />; // eslint-disable-line
    }
  };
}

export default withSubscription;
