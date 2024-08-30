const authenticationRouter = require('./authentication.routes');
const particleUserRouter = require('./particleUser.routes');
const oauthClientRouter = require('./oauth.routes');
const customerRouter = require('./customer.routes');

module.exports = {
  authenticationRouter,
  particleUserRouter,
  oauthClientRouter,
  customerRouter,
};
