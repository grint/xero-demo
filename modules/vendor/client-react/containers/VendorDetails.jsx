import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';

import { compose } from '@gqlapp/core-common';

import VendorDetailsView from '../components/VendorDetailsView';

import VENDOR_QUERY from '../graphql/VendorQuery.graphql';
import VENDOR_SUBSCRIPTION from '../graphql/VendorSubscription.graphql';

class VendorDetails extends React.Component {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    vendor: PropTypes.object,
    subscribeToMore: PropTypes.func.isRequired,
    history: PropTypes.object,
    navigation: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.subscription = null;
  }

  componentDidMount() {
    if (!this.props.loading) {
      this.initVendorDetailsSubscription();
    }
  }

  componentDidUpdate(prevProps) {
    if (!this.props.loading) {
      let prevVendorId = prevProps.vendor ? prevProps.vendor.id : null;
      // Check if props have changed and, if necessary, stop the subscription
      if (this.subscription && prevVendorId !== this.props.vendor.id) {
        this.subscription();
        this.subscription = null;
      }
    }
  }

  componentWillUnmount() {
    if (this.subscription) {
      // unsubscribe
      this.subscription();
      this.subscription = null;
    }
  }

  render() {
    return <VendorDetailsView {...this.props} />;
  }
}

export default compose(
  graphql(VENDOR_QUERY, {
    options: props => {
      let id = 0;
      if (props.match) {
        id = props.match.params.id;
      } else if (props.navigation) {
        id = props.navigation.state.params.id;
      }

      return {
        variables: { id: Number(id) }
      };
    },
    props({ data: { loading, error, vendor, subscribeToMore } }) {
      if (error) throw new Error(error);
      return { loading, vendor, subscribeToMore };
    }
  })
)(VendorDetails);
