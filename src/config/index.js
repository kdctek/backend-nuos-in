const dotenv = require('dotenv');

const {
  NodeEnv,
  toNumber,
  getOsEnv,
  normalizePort,
} = require('../shared/utils');

dotenv.config({ path: `.env.${getOsEnv('NODE_ENV')}` });

module.exports = {
  env: getOsEnv('NODE_ENV'),
  port: normalizePort(getOsEnv('PORT')),
  isProduction: getOsEnv('NODE_ENV') === NodeEnv.PRODUCTION,
  isDevelopment: getOsEnv('NODE_ENV') === NodeEnv.DEVELOPMENT,
  baseUrl: '/api/v1',
  appUrl: getOsEnv('BASE_URL'),
  db: {
    mongoUri: getOsEnv('MONGO_URL'),
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  jwt: {
    expiresIn: getOsEnv('EXPIRES_IN'),
    refreshExpiresIn: getOsEnv('REFRESH_EXPIRES_IN'),
    jwtSecret: getOsEnv('JWT_SECRET'),
    cookieExpire: toNumber(getOsEnv('COOKIE_EXPIRE')),
  },
  hash: toNumber(getOsEnv('HASH_SALT')),
  cryptoRounds: toNumber(getOsEnv('CRYPTO_ROUNDS')),
  corsUrl: '*',
  googleService: {
    userName: getOsEnv('USER_NAME'),
    appPasskey: getOsEnv('APP_PASSKEY'),
    clientId: getOsEnv('CLIENT_ID'),
    clientSecret: getOsEnv('CLIENT_SECRET'),
    refreshToken: getOsEnv('REFRESH_TOKEN'),
    accessToken: getOsEnv('ACCESS_TOKEN'),
  },
  facebookService: {
    clientId: getOsEnv('FACEBOOK_CLIENT_ID'),
    clientSecret: getOsEnv('FACEBOOK_CLIENT_SECRET'),
  },
  twilio: {
    accountSid: getOsEnv('TWILIO_ACCOUNT_SID'),
    serviceSid: getOsEnv('TWILIO_SERVICE_SID'),
    authToken: getOsEnv('TWILIO_AUTH_TOKEN'),
    phoneNumber: getOsEnv('TWILIO_PHONE_NUMBER'),
  },
  clientUrl: getOsEnv('CLIENT_URL'),
};
