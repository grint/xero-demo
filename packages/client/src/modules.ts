import core from '@gqlapp/core-client-react';
import look from '@gqlapp/look-client-react';
import i18n from '@gqlapp/i18n-client-react';
import validation from '@gqlapp/validation-common-react';
import ClientModule from '@gqlapp/module-client-react';
import defaultRouter from '@gqlapp/router-client-react';
import authentication from '@gqlapp/authentication-client-react';
import '@gqlapp/favicon-common';

const pageNotFound = require('@gqlapp/page-not-found-client-react').default;
const user = require('@gqlapp/user-client-react').default;
const vendor = require('@gqlapp/vendor-client-react').default;
const logs = require('@gqlapp/logs-client-react').default;

const modules = new ClientModule(
  look,
  validation,
  defaultRouter,
  vendor,
  logs,
  user,
  i18n,
  pageNotFound,
  core,
  authentication
);

export default modules;
