const accountantRouter = require('express').Router();

const {
  Routes: { ADMIN },
  UserRoles,
} = require('../constants');
const {
  accountantController: {
    getAllAccountantHandler,
    getAccountantByIdHandler,
    updateAccountantHandler,
    deleteAccountantHandler,
  },
} = require('../controller');

const { verifyToken, restrictTo } = require('../middleware');

accountantRouter.get(
  ADMIN.ACCOUNTS,
  verifyToken,
  restrictTo(UserRoles.ADMIN),
  getAllAccountantHandler,
);

accountantRouter
  .route(ADMIN.ACCOUNTS_DETAIL)
  .get(verifyToken, restrictTo(UserRoles.ADMIN), getAccountantByIdHandler)
  .patch(verifyToken, restrictTo(UserRoles.ADMIN), updateAccountantHandler)
  .delete(verifyToken, restrictTo(UserRoles.ADMIN), deleteAccountantHandler);

module.exports = { accountantRouter };
