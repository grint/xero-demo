import React from 'react';
import Helmet from 'react-helmet';

import { PageLayout } from '@gqlapp/look-client-react';
import { translate, TranslateFunction } from '@gqlapp/i18n-client-react';
import settings from '@gqlapp/config';

import logs from '../logs';

interface LogProps {
  t: TranslateFunction;
}

const Log = ({ t }: LogProps) => (
  <PageLayout>
    <Helmet
      title={`${settings.app.name} - ${t('title')}`}
      meta={[
        {
          name: 'description',
          content: `${settings.app.name} - ${t('meta')}`
        }
      ]}
    />
    {logs.logComponent.map((component: any, idx: number, items: any) =>
      React.cloneElement(component, { key: idx + items ? items.length : '' })
    )}
  </PageLayout>
);

export default translate('log')(Log);
