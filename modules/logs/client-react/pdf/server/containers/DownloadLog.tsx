import React, { useState } from 'react';
import { ApolloClient } from 'apollo-client';
import { withApollo } from 'react-apollo';

import { Button } from '@gqlapp/look-client-react';
import { translate, TranslateFunction } from '@gqlapp/i18n-client-react';
import query from '../../../graphql/PDF.graphql';
import { downloadFile, getObjectURLFromArray } from '../../../common';

interface DownloadLogProps {
  t: TranslateFunction;
  client: ApolloClient<any>;
}

const DownloadLog = ({ t, client }: DownloadLogProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const donwload = async () => {
    setIsLoading(true);
    const { data } = await client.query({
      query
    });
    const url = getObjectURLFromArray(data.pdf);
    downloadFile(url, 'Log.pdf');
    setIsLoading(false);
  };

  return (
    <Button className="no-print" disabled={isLoading} style={{ marginLeft: '10px' }} onClick={donwload}>
      {t('downloadPDF')}
    </Button>
  );
};

export default translate('PdfLog')(withApollo(DownloadLog));
