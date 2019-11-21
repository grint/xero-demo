import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, ScrollView, Keyboard } from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { translate } from '@gqlapp/i18n-client-react';
import { Loading } from '@gqlapp/look-client-react-native';

const VendorDetailsView = ({ loading, vendor, navigation, subscribeToMore, null: any, t }) => {
  let vendorObj = vendor;
  // if new vendor was just added read it from router
  if (!vendorObj && navigation.state) {
    vendorObj = navigation.state.params.vendor;
  }

  if (loading && !vendorObj) {
    return <Loading text={t('vendor.loadMsg')} />;
  } else {
    return (
      <View style={styles.container}>
        <ScrollView keyboardDismissMode="none" keyboardShouldPersistTaps="always">
          {/* {vendorObj && (
            
          )} */}
          <KeyboardSpacer />
        </ScrollView>
      </View>
    );
  }
};

VendorDetailsView.propTypes = {
  loading: PropTypes.bool.isRequired,
  post: PropTypes.object,
  navigation: PropTypes.object.isRequired,
  subscribeToMore: PropTypes.func.isRequired,
  t: PropTypes.func
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff'
  }
});

export default translate('post')(VendorDetailsView);
