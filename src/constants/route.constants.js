const Routes = {
  AUTH: {
    DEFAULT: '/auth',
    AUTHORIZATION: '/authorization',
    LOGIN: '/login',
    LOGOUT: '/logout',
    SIGNUP: '/signup',
    ME: '/me',
    EXCHANGE_TOKEN: '/token',
    VERIFY_EMAIL: '/:token',
    FORGOT_PASSWORD: '/forgotPassword',
    RESET_PASSWORD: '/resetPassword',
    CHANGE_PASSWORD: '/change_password/:id',
    MFA: {
      SETUP: '/mfa/setup',
      VERIFY: '/mfa/verify',
    },

    GOOGLE_AUTH: '/google',
    FACEBOOK_AUTH: '/facebook',
    GOOGLE_HOME: '/google_home/token',
    ALEXA_GOOGLE_AUTH: '/google/:id',
    GOOGLE_AUTH_CALLBACK: '/google/callback',
    FACEBOOK_AUTH_CALLBACK: '/facebook/callback',
    GOOGLE_AUTHENTICATOR: '/google/authenticator',
    SEND_OTP: '/send_otp',
    VERIFY_OTP: '/verify_otp',
    SEND_MOBILE_OTP: '/mobile/send_otp',
    VERIFY_MOBILE_OTP: '/mobile/verify_otp',
    IOT: {
      LOGIN: '/iot/login',
    },
  },
  GOOGLE_HOME: {
    DEFAULT: '/google_home',
    WEBHOOK: '/webhook',
  },

  PARTICLE: {
    DEFAULT: '/particle',
    GET_GATEWAYS: '/gateways/:accessToken',
    GET_DEVICES: '/gateway/devices/:gatewayId',
    ACCESS_TOKEN: '/access_token',
    USER: '/user',
    CLIENT: {
      DEFAULT: '/clients',
      DETAILS: '/clients/:clientId',
    },
    CUSTOMER: {
      DEFAULT: '/customers',
      DETAILS: '/customers/:productIdOrSlug',
      CREATE_CUSTOMER_CLIENT_CREDENTIALS:
        '/customers/client_credentials/:productIdOrSlug',
      GENERATE_TOKEN: '/customers/oauth/token',
    },
    API_USER: {
      PRODUCT_SCOPED: '/api_user/product/:productIDorSlug',
      ORGANISATION_SCOPED: '/api_user/organisation/:orgIDorSlug',
    },
    PRODUCTS: {
      DEFAULT: '/products',
      DETAILS: '/products/:id',
      LIST_TEAM_MEMBER: '/products/team/:productIdOrSlug',
    },
    QUARANTINED: '/device/quarantine/:productIdOrSlug/:deviceId',
    DEVICE: {
      DEFAULT: '/devices',
    },
    VARIABLE: {
      DEFAULT: '/variable',
      DETAILS: '/variable/:id',
    },
  },
  OAUTH: {
    DEFAULT: '/oauth',
    CLIENT: '/client',
    DETAILS: '/client/:id',
  },
  SUPER_ADMIN: {
    DEFAULT: '/super_admin',
    ALL: '/',
    DETAILS: '/:id',
  },
  ADMIN: {
    DEFAULT: '/admin',
    ACCOUNTS: '/accounts',
    MARKETER: '/marketer',
    ENGINEER: '/engineer',
    TESTER: '/tester',
    CHANNEL_PARTNER: '/channel_partner',
    ACCOUNTS_DETAIL: '/accounts/:id',
    MARKETER_DETAIL: '/marketer/:id',
    ENGINEER_DETAIL: '/engineer/:id',
    TESTER_DETAIL: '/tester/:id',
    CHANNEL_PARTNER_DETAIL: '/channel_partner/:id',
  },
  USER: {
    DEFAULT: '/users',
    ALL: '/',
    DETAIL: '/:id',
  },
  ORGANISATION: {
    DEFAULT: '/organisations',
    ALL: '/',
    DETAIL: '/:id',
    MANAGE_ORGANISATION: {
      DEFAULT: '/organisation',
      ADMIN: '/admin',
      CUSTOMER: '/customer',
    },
    PRODUCTS: {
      DEFAULT: '/products',
      DETAILS: '/product/:id',
    },
    DEVICES: {
      DEFAULT: '/devices',
      DETAILS: '/device/:id',
    },
  },
  USER_PROFILE: {
    DEFAULT: '/user_profile',
    DETAIL: '/:id',
  },
  HEALTH: '/health',
  SMART_THINGS: {
    DEFAULT: '/smart_things',
  },
};

module.exports = { Routes };
