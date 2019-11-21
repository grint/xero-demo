import ServerModule from '@gqlapp/module-server-ts';
import AuthModule from './social/AuthModule';
import access from './access';

export default new ServerModule(access);
export { access, AuthModule };
