const testerRouter = require('express').Router();

const {
  Routes: { ADMIN },
  UserRoles,
} = require('../constants');
const {
  testerController: {
    getAllTesterHandler,
    getTesterByIdHandler,
    updateTesterHandler,
    deleteTesterHandler,
  },
} = require('../controller');

const { verifyToken, restrictTo } = require('../middleware');

testerRouter.get(
  ADMIN.TESTER,
  verifyToken,
  restrictTo(UserRoles.ADMIN),
  getAllTesterHandler,
);

testerRouter
  .route(ADMIN.TESTER_DETAIL)
  .get(verifyToken, restrictTo(UserRoles.ADMIN), getTesterByIdHandler)
  .patch(verifyToken, restrictTo(UserRoles.ADMIN), updateTesterHandler)
  .delete(verifyToken, restrictTo(UserRoles.ADMIN), deleteTesterHandler);

module.exports = { testerRouter };
