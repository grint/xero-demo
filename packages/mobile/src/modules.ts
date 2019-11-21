import core from '@gqlapp/core-client-react-native';
import i18n from '@gqlapp/i18n-client-react';
import validation from '@gqlapp/validation-common-react';
import defaultRouter from '@gqlapp/router-client-react-native';
import authentication from '@gqlapp/authentication-client-react';

import ClientModule from '@gqlapp/module-client-react-native';

const upload = require('@gqlapp/upload-client-react').default;
const user = require('@gqlapp/user-client-react').default;
const vendor = require('@gqlapp/vendor-client-react').default;

const modules = new ClientModule(
  validation,
  defaultRouter,
  vendor,
  upload,
  user,
  i18n,
  core,
  authentication
);

export default modules;
