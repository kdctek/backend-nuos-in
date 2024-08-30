const superAdminRouter = require('express').Router();

const {
  Routes: { SUPER_ADMIN },
  UserRoles,
} = require('../constants');
const {
  superAdminController: {
    createAdminHandler,
    getAllAdminHandler,
    getAdminByIdHandler,
    updateAdminHandler,
    deleteAdminHandler,
  },
} = require('../controller');

const {
  superAdminValidations: { validateCreateAdmin, validateUpdateAdmin },
} = require('../validations');
const { verifyToken, restrictTo } = require('../middleware');

superAdminRouter
  .route(SUPER_ADMIN.ALL)
  .post(
    verifyToken,
    restrictTo(UserRoles.SUPER_ADMIN),
    validateCreateAdmin,
    createAdminHandler,
  )
  .get(verifyToken, restrictTo(UserRoles.SUPER_ADMIN), getAllAdminHandler);

superAdminRouter
  .route(SUPER_ADMIN.DETAILS)
  .get(verifyToken, restrictTo(UserRoles.SUPER_ADMIN), getAdminByIdHandler)
  .patch(
    verifyToken,
    restrictTo(UserRoles.SUPER_ADMIN),
    validateUpdateAdmin,
    updateAdminHandler,
  )
  .delete(verifyToken, restrictTo(UserRoles.SUPER_ADMIN), deleteAdminHandler);

module.exports = { superAdminRouter };
