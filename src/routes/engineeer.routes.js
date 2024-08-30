const engineerRouter = require('express').Router();

const {
  Routes: { ADMIN },
  UserRoles,
} = require('../constants');
const {
  engineerController: {
    getAllEngineerHandler,
    getEngineerByIdHandler,
    updateEngineerHandler,
    deleteEngineerHandler,
  },
} = require('../controller');

const { verifyToken, restrictTo } = require('../middleware');

engineerRouter.get(
  ADMIN.ENGINEER,
  verifyToken,
  restrictTo(UserRoles.ADMIN),
  getAllEngineerHandler,
);

engineerRouter
  .route(ADMIN.ENGINEER_DETAIL)
  .get(verifyToken, restrictTo(UserRoles.ADMIN), getEngineerByIdHandler)
  .patch(verifyToken, restrictTo(UserRoles.ADMIN), updateEngineerHandler)
  .delete(verifyToken, restrictTo(UserRoles.ADMIN), deleteEngineerHandler);

module.exports = { engineerRouter };
