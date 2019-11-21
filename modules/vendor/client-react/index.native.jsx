import React from 'react';
import PropTypes from 'prop-types';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import { translate } from '@gqlapp/i18n-client-react';
import { Button, HeaderTitle, IconButton, primary } from '@gqlapp/look-client-react-native';
import ClientModule from '@gqlapp/module-client-react-native';

import Vendor from './containers/Vendor';
import VendorView from './containers/VendorView';

import resources from './locales';

const withI18N = (Component, props) => {
  const WithI18N = translate('vendor')(Component);
  return <WithI18N {...props} />;
};

const VendorListHeaderRight = ({ navigation, t }) => {
  return (
    <View style={styles.viewButtonContainer}>
      <Button style={styles.viewButton} size={'small'} type={primary} onPress={() => navigation.navigate('VendorView')}>
        {t('list.btn.view')}
      </Button>
    </View>
  );
};
VendorListHeaderRight.propTypes = {
  navigation: PropTypes.object,
  t: PropTypes.func
};

class VendorListScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: withI18N(HeaderTitle, { style: 'subTitle', i18nKey: 'list.subTitle' }),
    headerRight: withI18N(VendorListHeaderRight, { navigation }),
    headerLeft: (
      <IconButton iconName="menu" iconSize={32} iconColor="#0275d8" onPress={() => navigation.openDrawer()} />
    ),
    headerStyle: styles.header,
    headerForceInset: {}
  });

  render() {
    return <Vendor navigation={this.props.navigation} />;
  }
}

VendorListScreen.propTypes = {
  navigation: PropTypes.object
};


class VendorViewScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: withI18N(VendorViewTitle, { navigation }),
    headerStyle: styles.header,
    headerForceInset: {}
  });

  render() {
    return <VendorView navigation={this.props.navigation} />;
  }
}
VendorViewScreen.propTypes = {
  navigation: PropTypes.object
};

const VendorNavigator = createStackNavigator({
  VendorList: { screen: VendorListScreen },
  VendorView: { screen: VendorViewScreen }
});

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#fff'
  },
  subTitle: {
    fontSize: Platform.OS === 'ios' ? 17 : 20,
    fontWeight: Platform.OS === 'ios' ? '700' : '500',
    color: 'rgba(0, 0, 0, .9)',
    textAlign: Platform.OS === 'ios' ? 'center' : 'left',
    marginHorizontal: 16
  },
  viewButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10
  },
  viewButton: {
    height: 32,
    width: 60
  }
});

export default new ClientModule({
  drawerItem: [
    {
      Vendor: {
        screen: VendorNavigator,
        navigationOptions: {
          drawerLabel: withI18N(HeaderTitle, { i18nKey: 'list.title' })
        }
      }
    }
  ],
  resolver: [resolvers],
  localization: [{ ns: 'vendor', resources }]
});
