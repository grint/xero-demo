import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesome } from '@expo/vector-icons';
import { StyleSheet, Text, Platform, TouchableOpacity, View, FlatList } from 'react-native';
import { translate } from '@gqlapp/i18n-client-react';
import { SwipeAction, Loading } from '@gqlapp/look-client-react-native';

class VendorList extends React.PureComponent {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    vendors: PropTypes.object,
    navigation: PropTypes.object,
    viewVendor: PropTypes.func.isRequired,
    loadData: PropTypes.func.isRequired,
    t: PropTypes.func
  };

  renderItemIOS = ({
    item: {
      node: { id, name }
    }
  }) => {
    const { viewVendor, navigation, t } = this.props;
    return (
      <SwipeAction
        onPress={() => navigation.navigate('VendorView', { id })}
        right={{
          text: t('list.btn.view'),
          onPress: () => viewVendor(id)
        }}
      >
        {name}
      </SwipeAction>
    );
  };

  renderItemAndroid = ({
    item: {
      node: { id, name }
    }
  }) => {
    const { viewVendor, navigation } = this.props;
    return (
      <TouchableOpacity style={styles.vendorWrapper} onPress={() => navigation.navigate('VendorView', { id })}>
        <Text style={styles.text}>{name}</Text>
        <TouchableOpacity style={styles.iconWrapper} onPress={() => viewVendor(id)}>
          <FontAwesome name="list" size={20} style={{ color: '#3B5998' }} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  handleScrollEvent = () => {
    const {
      vendors: {
        pageInfo: { endCursor, hasNextPage }
      },
      loading,
      loadData
    } = this.props;

    if (this.allowDataLoad && !loading && hasNextPage) {
      this.allowDataLoad = false;
      return loadData(endCursor + 1, 'add');
    }
  };

  render() {
    const { loading, vendors, t } = this.props;
    if (loading) {
      return <Loading text={t('vendor.loadMsg')} />;
    } else if (vendors && !vendors.totalCount) {
      return <Loading text={t('vendor.noVendorsMsg')} />;
    } else {
      this.allowDataLoad = true;
      return (
        <View style={styles.container}>
          <FlatList
            data={vendors.edges}
            ref={ref => (this.listRef = ref)}
            style={styles.list}
            keyExtractor={item => `${item.node.id}`}
            renderItem={Platform.OS === 'android' ? this.renderItemAndroid : this.renderItemIOS}
            onEndReachedThreshold={0.5}
            onEndReached={this.handleScrollEvent}
          />
        </View>
      );
    }
  }
}

export default translate('vendor')(VendorList);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center'
  },
  text: {
    fontSize: 18
  },
  iconWrapper: {
    backgroundColor: 'transparent',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  vendorWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomColor: '#000',
    borderBottomWidth: 0.3,
    height: 50,
    paddingLeft: 7
  },
  list: {
    marginTop: 5
  }
});
