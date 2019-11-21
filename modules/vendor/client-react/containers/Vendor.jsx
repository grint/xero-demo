import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import update from 'immutability-helper';

import { compose, PLATFORM } from '@gqlapp/core-common';
import settings from '@gqlapp/config';

import VendorList from '../components/VendorList';

import VENDORS_QUERY from '../graphql/VendorsQuery.graphql';
import VENDORS_SUBSCRIPTION from '../graphql/VendorsSubscription.graphql';

const limit =
  PLATFORM === 'web' || PLATFORM === 'server'
    ? settings.pagination.web.itemsNumber
    : settings.pagination.mobile.itemsNumber;

class Vendor extends React.Component {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    vendors: PropTypes.object,
    // subscribeToMore: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.subscription = null;
  }

  componentDidUpdate(prevProps) {
    if (!this.props.loading) {
      const endCursor = this.props.vendors ? this.props.vendors.pageInfo.endCursor : 0;
      const prevEndCursor = prevProps.vendors ? prevProps.vendors.pageInfo.endCursor : null;
      // Check if props have changed and, if necessary, stop the subscription
      if (this.subscription && prevEndCursor !== endCursor) {
        this.subscription();
        this.subscription = null;
      }
      if (!this.subscription) {
        this.subscribeToVendorList(endCursor);
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

  subscribeToVendorList = endCursor => {
    const { subscribeToMore } = this.props;

    this.subscription = subscribeToMore({
      document: VENDORS_SUBSCRIPTION,
      variables: { endCursor },
      updateQuery: (
        prev,
        {
          subscriptionData: {
            data: {
              vendorsUpdated: { mutation, node }
            }
          }
        }
      ) => {
        let newResult = prev;

        return newResult;
      }
    });
  };

  render() {
    return <VendorList {...this.props} />;
  }
}

export default compose(
  graphql(VENDORS_QUERY, {
    options: () => {
      return {
        variables: { limit: limit, after: 0 },
        fetchPolicy: 'network-only'
      };
    },
    props: ({ data }) => {
      const { loading, error, vendors, fetchMore, subscribeToMore } = data;
      const loadData = (after, dataDelivery) => {
        return fetchMore({
          variables: {
            after: after
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            const totalCount = fetchMoreResult.vendors.totalCount;
            const newEdges = fetchMoreResult.vendors.edges;
            const pageInfo = fetchMoreResult.vendors.pageInfo;
            const displayedEdges = dataDelivery === 'add' ? [...previousResult.vendors.edges, ...newEdges] : newEdges;

            return {
              // By returning `cursor` here, we update the `fetchMore` function
              // to the new cursor.
              vendors: {
                totalCount,
                edges: displayedEdges,
                pageInfo,
                __typename: 'Vendors'
              }
            };
          }
        });
      };
      if (error) throw new Error(error);
      return { loading, vendors, subscribeToMore, loadData };
    }
  })
)(Vendor);
