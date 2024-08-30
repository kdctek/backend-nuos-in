const auth = require('./auth.validation');
const superAdminValidations = require('./superAdmin.validations');
const adminValidations = require('./admin.validations');
const particleValidations = require('./ParticleWrapper/authentication.validations');
const deviceValidations = require('./device.validations');
const productValidations = require('./product.validations');
const customerValidations = require('./customer.validations');

module.exports = {
  auth,
  adminValidations,
  superAdminValidations,
  particleValidations,
  deviceValidations,
  productValidations,
  customerValidations,
};
