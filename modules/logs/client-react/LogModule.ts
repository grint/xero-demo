import React from 'react';
import ClientModule, { ClientModuleShape } from '@gqlapp/module-client-react';

export interface LogModuleShape extends ClientModuleShape {
  logComponent?: Array<React.ReactElement<any>>;
}

interface LogModule extends LogModuleShape {}

class LogModule extends ClientModule {
  constructor(...modules: LogModuleShape[]) {
    super(...modules);
  }
}

export default LogModule;
