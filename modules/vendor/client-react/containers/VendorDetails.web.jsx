import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { compose } from '@gqlapp/core-common';

import VendorDetailsView from '../components/VendorDetailsView';

import VENDOR_QUERY from '../graphql/VendorQuery.graphql';

const VendorDetails = props => {
  return <VendorDetailsView {...props} />;
};

VendorDetails.propTypes = {
  loading: PropTypes.bool.isRequired,
  vendor: PropTypes.object,
  subscribeToMore: PropTypes.func.isRequired,
  history: PropTypes.object,
  navigation: PropTypes.object
};

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
