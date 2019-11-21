import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import { translate } from '@gqlapp/i18n-client-react';
import { PageLayout } from '@gqlapp/look-client-react';
import settings from '@gqlapp/config';

const VendorDetailsView = ({ loading, vendor, match, location, subscribeToMore, null: any, t }) => {
  let vendorObj = vendor;
  // if new vendor was just added read it from router
  if (!vendorObj && location.state) {
    vendorObj = location.state.vendor;
  }

  const renderMetaData = () => (
    <Helmet
      title={`${settings.app.name} - ${t('vendor.name')}`}
      meta={[
        {
          name: 'description',
          content: t('vendor.meta')
        }
      ]}
    />
  );

  if (loading && !vendorObj) {
    return (
      <PageLayout>
        {renderMetaData()}
        <div className="text-center">{t('vendor.loadMsg')}</div>
      </PageLayout>
    );
  } else {
    console.log(vendorObj);
    return (
      <PageLayout>
        {renderMetaData()}
        <Link to="/vendors">{t('vendor.btn.back')}</Link>
        <h2>{vendorObj.name}</h2>
        <br />
        {vendorObj.vendorId}
      </PageLayout>
    );
  }
};

VendorDetailsView.propTypes = {
  loading: PropTypes.bool.isRequired,
  vendor: PropTypes.object,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  subscribeToMore: PropTypes.func.isRequired,
  t: PropTypes.func
};

export default translate('vendor')(VendorDetailsView);
