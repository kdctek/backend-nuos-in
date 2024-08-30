const customerRouter = require('express').Router();

const {
  Routes: { PARTICLE },
  UserRoles: { ADMIN },
} = require('../../constants');

const {
  customerController: {
    createCustomerWithAcessToken,
    createCustomerWithClientCredentials,
    deleteCustomer,
    generateCustomerScopeToken,
    listCustomerForProduct,
    updateCustomerPassword,
  },
} = require('../../controller/ParticleWrapper');

const {
  particleValidations: { validateGenerateToken },
} = require('../../validations');

const { verifyToken, restrictTo } = require('../../middleware');

customerRouter.post(
  PARTICLE.CUSTOMER.CREATE_CUSTOMER_CLIENT_CREDENTIALS,
  verifyToken,
  restrictTo(ADMIN),
  createCustomerWithClientCredentials,
);
customerRouter.post(
  PARTICLE.CUSTOMER.DETAILS,
  verifyToken,
  restrictTo(ADMIN),
  createCustomerWithAcessToken,
);
customerRouter.get(
  PARTICLE.CUSTOMER.DETAILS,
  verifyToken,
  restrictTo(ADMIN),
  listCustomerForProduct,
);
customerRouter.put(
  PARTICLE.CUSTOMER.DETAILS,
  verifyToken,
  restrictTo(ADMIN),
  updateCustomerPassword,
);
customerRouter.delete(
  PARTICLE.CUSTOMER.DETAILS,
  verifyToken,
  restrictTo(ADMIN),
  deleteCustomer,
);
customerRouter.post(
  PARTICLE.CUSTOMER.GENERATE_TOKEN,
  verifyToken,
  restrictTo(ADMIN),
  generateCustomerScopeToken,
);

module.exports = { customerRouter };
