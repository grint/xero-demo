import React from 'react';
import { Route, NavLink } from 'react-router-dom';
import { translate } from '@gqlapp/i18n-client-react';
import { MenuItem } from '@gqlapp/look-client-react';
import ClientModule from '@gqlapp/module-client-react';
import loadable from '@loadable/component';

import resources from './locales';

const NavLinkWithI18n = translate()(({ t }) => (
  <NavLink to="/vendors" className="nav-link" activeClassName="active">
    {t('vendor:navLink')}
  </NavLink>
));

export default new ClientModule({
  route: [
    <Route exact path="/vendors" component={loadable(() => import('./containers/Vendor').then(c => c.default))} />,
    <Route path="/vendors/:id" component={loadable(() => import('./containers/VendorDetails').then(c => c.default))} />
  ],
  navItem: [
    <MenuItem key="/vendors">
      <NavLinkWithI18n />
    </MenuItem>
  ],
  resolver: [],
  localization: [{ ns: 'vendor', resources }]
});
