/* eslint-disable react/display-name */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';

import { translate } from '@gqlapp/i18n-client-react';
import { PageLayout, Table, Button, Pagination } from '@gqlapp/look-client-react';
import settings from '@gqlapp/config';

const { itemsNumber, type } = settings.pagination.web;

const Loading = ({ t }) => <div className="text-center">{t('vendor.loadMsg')}</div>;
Loading.propTypes = { t: PropTypes.func };

const NoVendorsMessage = ({ t }) => <div className="text-center">{t('vendor.noVendorsMsg')}</div>;
NoVendorsMessage.propTypes = { t: PropTypes.func };

const VendorList = ({ loading, vendors, t, loadData }) => {
  const columns = [
    {
      title: t('list.column.title'),
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => <Link to={`/vendors/${record.id}`}>{text}</Link>
    },
    {
      title: t('list.column.actions'),
      key: 'actions',
      width: 50,
      render: (text, record) => (
        <Link to={`/vendors/${record.id}`}>
          <Button color="primary" size="sm">
            {t('vendor.btn.view')}
          </Button>
        </Link>
      )
    }
  ];

  const handlePageChange = (pagination, pageNumber) => {
    const {
      pageInfo: { endCursor }
    } = vendors;
    pagination === 'relay' ? loadData(endCursor + 1, 'add') : loadData((pageNumber - 1) * itemsNumber, 'replace');
  };

  const RenderVendors = () => (
    <Fragment>
      <Table dataSource={vendors.edges.map(({ node }) => node)} columns={columns} />
      <Pagination
        itemsPerPage={vendors.edges.length}
        handlePageChange={handlePageChange}
        hasNextPage={vendors.pageInfo.hasNextPage}
        pagination={type}
        total={vendors.totalCount}
        loadMoreText={t('list.btn.more')}
        defaultPageSize={itemsNumber}
      />
    </Fragment>
  );

  return (
    <PageLayout>
      {/* Render metadata */}
      <Helmet
        title={`${settings.app.name} - ${t('list.title')}`}
        meta={[{ name: 'description', content: `${settings.app.name} - ${t('list.meta')}` }]}
      />
      <h2>{t('list.subTitle')}</h2>
      {/* <Link to="/sync">
        <Button color="primary">{t('list.btn.sync')}</Button>
      </Link> */}
      {/* Render loader */}
      {loading && !vendors && <Loading t={t} />}
      {/* Render main vendor content */}
      {vendors && vendors.totalCount ? <RenderVendors /> : <NoVendorsMessage t={t} />}
    </PageLayout>
  );
};

VendorList.propTypes = {
  loading: PropTypes.bool.isRequired,
  vendors: PropTypes.object,
  // viewVendor: PropTypes.func.isRequired,
  loadData: PropTypes.func,
  t: PropTypes.func
};

export default translate('vendor')(VendorList);
