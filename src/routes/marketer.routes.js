const marketerRouter = require('express').Router();

const {
  Routes: { ADMIN },
  UserRoles,
} = require('../constants');
const {
  marketerController: {
    getAllMarketerHandler,
    getMarketerByIdHandler,
    updateMarketerHandler,
    deleteMarketerHandler,
  },
} = require('../controller');

const { verifyToken, restrictTo } = require('../middleware');

marketerRouter.get(
  ADMIN.MARKETER,
  verifyToken,
  restrictTo(UserRoles.ADMIN),
  getAllMarketerHandler,
);

marketerRouter
  .route(ADMIN.MARKETER_DETAIL)
  .get(verifyToken, restrictTo(UserRoles.ADMIN), getMarketerByIdHandler)
  .patch(verifyToken, restrictTo(UserRoles.ADMIN), updateMarketerHandler)
  .delete(verifyToken, restrictTo(UserRoles.ADMIN), deleteMarketerHandler);

module.exports = { marketerRouter };
