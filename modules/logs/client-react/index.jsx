import React from 'react';
import { Route, NavLink } from 'react-router-dom';
import { translate } from '@gqlapp/i18n-client-react';
import { MenuItem } from '@gqlapp/look-client-react';
import ClientModule from '@gqlapp/module-client-react';
import loadable from '@loadable/component';

import logs from './logs';
import resources from './locales';

const NavLinkWithI18n = translate('log')(({ t }) => (
  <NavLink to="/log" className="nav-link" activeClassName="active">
    {t('navLink')}
  </NavLink>
));

export default new ClientModule(logs, {
  route: [
    <Route exact path="/log" component={loadable(() => import('./containers/Log').then(c => c.default))} />
  ],
  navItem: [
    <MenuItem key="/log">
      <NavLinkWithI18n />
    </MenuItem>
  ],
  localization: [{ ns: 'log', resources }]
});
