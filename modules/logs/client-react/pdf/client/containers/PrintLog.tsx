import React, { useEffect } from 'react';
import { Query } from 'react-apollo';
import { translate, TranslateFunction } from '@gqlapp/i18n-client-react';
import { removeTypename } from '@gqlapp/core-common';
import { Table, Button, Row, Col } from '@gqlapp/look-client-react';
import { useState } from 'react';
import { Alert } from '@gqlapp/look-client-react';

import LogQuery from '../../../graphql/LogQuery.graphql';
// import VendorsQuery from '../../../graphql/VendorsQuery.graphql';
// import { useLazyQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { useMutation, useQuery } from '@apollo/react-hooks';

interface LogProps {
  t: TranslateFunction;
}

interface Log {
  id: string;
  operation: string;
  state: string;
  records: number;
  success: boolean;
  error: string;
  typename?: string;
}

const SYNC_VENDORS = gql`
  mutation AddVendors($vendors: [VendorsInput], $date: String) {
    addVendors(vendors: $vendors, date: $date) {
      name
      vendorId
    }
  }
`;

const ADD_LOG = gql`
  mutation AddLog($log: LogInput!) {
    addLog(log: $log) {
      operation
      state
      item
      success
      records
      error
    }
  }
`;

const GET_VENDOR_LOGS = gql`
  {
    vendorLog {
      created_at
    }
  }
`;

const Log = ({ t }: LogProps) => {
  const [load, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { data: vendorLogs } = useQuery(GET_VENDOR_LOGS);
  const [syncVendorsMutation] = useMutation(SYNC_VENDORS);
  const [addLog] = useMutation(ADD_LOG);

  const print = () => {
    window.print();
  };

  const sync = async () => {
    setLoading(true);
    await syncVendors();
  };

  const syncVendors = async () => {
    const lastVendorUpdate = vendorLogs.vendorLog.length > 0 ? vendorLogs.vendorLog[0].created_at : '';

    const log = {
      operation: 'SyncFromErp',
      state: 'Start',
      item: 'Vendor',
      success: true,
      records: 0,
      error: ''
    };

    setLoading(true);
    await addLog({ variables: { log } });

    await syncVendorsMutation({ variables: { vendors: [], date: lastVendorUpdate } }).then(
      async (res: any) => {
        const num = res.data && res.data.addVendors ? res.data.addVendors.length : 0;
        log.records = num;
        log.state = 'End';
        await addLog({ variables: { log } });
        setLoading(false);
        window.location.reload(true); // TODO logs subscription
      },
      async e => {
        console.error(e);
        log.success = false;
        log.state = 'End';
        log.error = e.toString();
        await addLog({ variables: { log } });
        setError(e);
        setLoading(false);
      }
    );
  };

  return (
    <Query query={LogQuery}>
      {({ loading, data }: any) => {
        if (loading || load) {
          return t('loading');
        }

        const log = data.log.map((item: Log) => removeTypename(item));
        let columns: any[] = [];
        if (log && log.length) {
          columns = Object.keys(log[0]).map((name: string) => {
            return {
              title: name,
              key: name,
              dataIndex: name
            };
          });
        }

        return (
          <>
            {error && <Alert color="danger">{error.toString()}</Alert>}
            <Row>
              <Col>
                <h2>{t('title')}</h2>
              </Col>
              <Col style={{textAlign: 'right'}}>
                <Button className="no-print" color="primary" size="lg" style={{marginBottom: '1rem'}} onClick={sync}>
                  {t('sync')}
                </Button>
              </Col>
            </Row>
            <Table dataSource={log} columns={columns} />
            <Button className="no-print" onClick={print}>
              {t('print')}
            </Button>
          </>
        );
      }}
    </Query>
  );
};

export default translate('PrintLog')(Log);
