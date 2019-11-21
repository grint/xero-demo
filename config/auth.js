const CERTIFICATE_DEVSERIAL = '00';

export default {
  secret: process.env.NODE_ENV === 'test' ? 'secret for tests' : process.env.AUTH_SECRET,
  serial: {
    enabled: false
  },
  session: {
    enabled: true
  },
  jwt: {
    enabled: true,
    tokenExpiresIn: '1m',
    refreshTokenExpiresIn: '7d'
  },
  password: {
    requireEmailConfirmation: true,
    sendPasswordChangesEmail: true,
    minLength: 8,
    enabled: true
  },
  certificate: {
    devSerial: CERTIFICATE_DEVSERIAL,
    enabled: false
  }
};
