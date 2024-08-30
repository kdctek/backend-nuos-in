const authenticationController = require('./Authentication/authentication.controller');
const particleUserController = require('./Users/user.controller');
const oauthController = require('./OAuthClients/oauth.controller');
const customerController = require('./Customer/customer.controller');
const apiUserController = require('./APIUsers/api.users.controller');
const productsController = require('./Products/products.controller');
const quarantinedController = require('./Quarantined/quarantined.controller');
const deviceController = require('./Devices/devices.controller');

module.exports = {
  authenticationController,
  particleUserController,
  oauthController,
  customerController,
  apiUserController,
  productsController,
  quarantinedController,
  deviceController,
};
