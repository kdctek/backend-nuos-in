const manageCustomerRouter = require('express').Router();

const {
  Routes: { ORGANISATION },
  UserRoles: { SUPER_ADMIN, ADMIN, ORG_ADMIN },
} = require('../../constants');

const {
  manageCustomerController: {
    registerCustomer,
    getAllCustomerHandler,
    getCustomerByIdHandler,
    updateCustomerHandler,
    deleteCustomerHandler,
    getAllCustomerByOrgHandler,
  },
} = require('../../controller');

const {
  customerValidations: { validateSignupCustomer },
} = require('../../validations');

const { verifyToken, restrictTo } = require('../../middleware');

manageCustomerRouter.get(
  `${ORGANISATION.MANAGE_ORGANISATION.CUSTOMER}/:organisationId`,
  verifyToken,
  restrictTo(SUPER_ADMIN, ADMIN, ORG_ADMIN),
  getAllCustomerByOrgHandler,
);

manageCustomerRouter.get(
  ORGANISATION.MANAGE_ORGANISATION.CUSTOMER,
  verifyToken,
  restrictTo(SUPER_ADMIN, ADMIN),
  getAllCustomerHandler,
);

manageCustomerRouter.get(
  `${ORGANISATION.MANAGE_ORGANISATION.CUSTOMER}/detail/:id`,
  verifyToken,
  getCustomerByIdHandler,
);

manageCustomerRouter.post(
  ORGANISATION.MANAGE_ORGANISATION.CUSTOMER,
  validateSignupCustomer,
  registerCustomer,
);

manageCustomerRouter.delete(
  `${ORGANISATION.MANAGE_ORGANISATION.CUSTOMER}/detail/:id`,
  verifyToken,
  deleteCustomerHandler,
);

manageCustomerRouter.patch(
  `${ORGANISATION.MANAGE_ORGANISATION.CUSTOMER}/detail/:id`,
  verifyToken,
  updateCustomerHandler,
);

module.exports = { manageCustomerRouter };
