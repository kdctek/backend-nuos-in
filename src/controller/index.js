const authController = require('./auth.controller');
const usersController = require('./users.controller');
const adminController = require('./admin.controller');
const superAdminController = require('./superAdmin.controller');
const accountantController = require('./acccountant.controller');
const marketerController = require('./marketer.controller');
const channelPartnerController = require('./channelPartner.controller');
const engineerController = require('./engineer.controller');
const testerController = require('./tester.controller');
const clientController = require('./oauth.controller');
const mfaController = require('./mfa.controller');
const gatewayController = require('./gateway.controller');
const googleHomeController = require('./googleHome.controller');
const smartThingsController = require('./smartthings.controller');
const variableController = require('./variable.controller');
const {
  authenticationController,
  productsController,
  quarantinedController,
} = require('./ParticleWrapper/index');
const userProfileController = require('./userProfile.controller');
const organisationController = require('./oganisation.controller');
const manageOrganisationController = require('./OrganisationManagement/Admin');
const manageCustomerController = require('./OrganisationManagement/Customer');

module.exports = {
  authController,
  usersController,
  adminController,
  superAdminController,
  accountantController,
  marketerController,
  channelPartnerController,
  engineerController,
  testerController,
  clientController,
  mfaController,
  gatewayController,
  googleHomeController,
  authenticationController,
  productsController,
  quarantinedController,
  smartThingsController,
  userProfileController,
  variableController,
  organisationController,
  manageOrganisationController,
  manageCustomerController,
};
