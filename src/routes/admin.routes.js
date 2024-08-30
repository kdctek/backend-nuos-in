const adminRouter = require('express').Router();

const {
  Routes: { ADMIN },
  UserRoles,
} = require('../constants');
const {
  adminController: {
    createAccountantHandler,
    createChannelPersonHandler,
    createEngineerHandler,
    createMarketerHandler,
    createTesterHandler,
  },
} = require('../controller');
const { verifyToken, restrictTo } = require('../middleware');
const {
  adminValidations: { validateCreateAccount },
} = require('../validations');

adminRouter.post(
  ADMIN.ACCOUNTS,
  verifyToken,
  restrictTo(UserRoles.ADMIN),
  validateCreateAccount,
  createAccountantHandler,
);
adminRouter.post(
  ADMIN.CHANNEL_PARTNER,
  verifyToken,
  restrictTo(UserRoles.ADMIN),
  validateCreateAccount,
  createChannelPersonHandler,
);
adminRouter.post(
  ADMIN.ENGINEER,
  verifyToken,
  restrictTo(UserRoles.ADMIN),
  validateCreateAccount,
  createEngineerHandler,
);
adminRouter.post(
  ADMIN.MARKETER,
  verifyToken,
  restrictTo(UserRoles.ADMIN),
  validateCreateAccount,
  createMarketerHandler,
);
adminRouter.post(
  ADMIN.TESTER,
  verifyToken,
  restrictTo(UserRoles.ADMIN),
  validateCreateAccount,
  createTesterHandler,
);

module.exports = { adminRouter };
