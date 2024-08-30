const restRouter = require('express').Router();

const {
  Routes: {
    AUTH,
    USER,
    ADMIN,
    SUPER_ADMIN,
    OAUTH,
    PARTICLE,
    GOOGLE_HOME,
    USER_PROFILE,
    ORGANISATION,
  },
} = require('../constants');
const { authRouter } = require('./auth.routes');
const { usersRouter } = require('./users.routes');
const { adminRouter } = require('./admin.routes');
const { superAdminRouter } = require('./superAdmin.routes');
const { accountantRouter } = require('./accountant.routes');
const { marketerRouter } = require('./marketer.routes');
const { channelPartnerRouter } = require('./channelPartner.routes');
const { testerRouter } = require('./tester.routes');
const { engineerRouter } = require('./engineeer.routes');
const { clientRouter } = require('./client.routes');
const { mfaRouter } = require('./mfa.routes');
const { gatewayRouter } = require('./gateway.routes');
const { googleHomeRouter } = require('./googleHome.routes');
const {
  authenticationRouter,
} = require('./PartcleWrapper/authentication.routes');
const { particleUserRouter } = require('./PartcleWrapper/particleUser.routes');
const { oauthClientRouter } = require('./PartcleWrapper/oauth.routes');
const { customerRouter } = require('./PartcleWrapper/customer.routes');
const { apiUserRouter } = require('./PartcleWrapper/api.users.routes');
const { productsRouter } = require('./OrganisationManagement/products.routes');
const { quarantinedRouter } = require('./PartcleWrapper/quarantined.routes');
const { smartThingsRouter } = require('./smartthings.routes');
const { deviceRouter } = require('./OrganisationManagement/device.routes');
const { userProfileRouter } = require('./userProfile.routes');
const { variableRouter } = require('./variable.routes');
const { organisationRouter } = require('./organisation.routes');
const {
  manageOrganisationRouter,
} = require('./OrganisationManagement/admin.routes');
const {
  manageCustomerRouter,
} = require('./OrganisationManagement/customer.routes');

restRouter.use(SUPER_ADMIN.DEFAULT, superAdminRouter);
restRouter.use(AUTH.DEFAULT, authRouter);
restRouter.use(USER.DEFAULT, usersRouter);
restRouter.use(ADMIN.DEFAULT, adminRouter);
restRouter.use(ADMIN.DEFAULT, accountantRouter);
restRouter.use(ADMIN.DEFAULT, marketerRouter);
restRouter.use(ADMIN.DEFAULT, channelPartnerRouter);
restRouter.use(ADMIN.DEFAULT, testerRouter);
restRouter.use(ADMIN.DEFAULT, engineerRouter);
restRouter.use(OAUTH.DEFAULT, clientRouter);
restRouter.use(AUTH.DEFAULT, mfaRouter);
restRouter.use(PARTICLE.DEFAULT, gatewayRouter);
restRouter.use(PARTICLE.DEFAULT, authenticationRouter);
restRouter.use(PARTICLE.DEFAULT, particleUserRouter);
restRouter.use(PARTICLE.DEFAULT, oauthClientRouter);
restRouter.use(PARTICLE.DEFAULT, customerRouter);
restRouter.use(PARTICLE.DEFAULT, apiUserRouter);
restRouter.use(ORGANISATION.DEFAULT, productsRouter);
restRouter.use(ORGANISATION.DEFAULT, deviceRouter);
restRouter.use(PARTICLE.DEFAULT, variableRouter);
restRouter.use(USER_PROFILE.DEFAULT, userProfileRouter);
restRouter.use(PARTICLE.DEFAULT, quarantinedRouter);
restRouter.use(GOOGLE_HOME.DEFAULT, googleHomeRouter);
restRouter.use(AUTH.DEFAULT, smartThingsRouter);
restRouter.use(ORGANISATION.DEFAULT, organisationRouter);
restRouter.use(
  ORGANISATION.MANAGE_ORGANISATION.DEFAULT,
  manageOrganisationRouter,
);
restRouter.use(ORGANISATION.MANAGE_ORGANISATION.DEFAULT, manageCustomerRouter);

module.exports = { restRouter };
