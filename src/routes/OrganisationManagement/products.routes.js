const productsRouter = require('express').Router();

const {
  Routes: { ORGANISATION },
  UserRoles: { SUPER_ADMIN, ADMIN, ORG_ADMIN },
} = require('../../constants');

const {
  productsController: {
    addProduct,
    listProducts,
    updateProduct,
    listProductsById,
    listProductsByOrg,
  },
} = require('../../controller/ParticleWrapper');

const { verifyToken, restrictTo } = require('../../middleware');
const {
  productValidations: { validateAddProduct, validateUpdateProduct },
} = require('../../validations');

productsRouter.post(
  ORGANISATION.PRODUCTS.DEFAULT,
  verifyToken,
  restrictTo(ORG_ADMIN),
  validateAddProduct,
  addProduct,
);
productsRouter.patch(
  ORGANISATION.PRODUCTS.DETAILS,
  verifyToken,
  restrictTo(ORG_ADMIN),
  validateUpdateProduct,
  updateProduct,
);
productsRouter.get(
  ORGANISATION.PRODUCTS.DEFAULT,
  verifyToken,
  restrictTo(SUPER_ADMIN, ADMIN, ORG_ADMIN),
  listProducts,
);
productsRouter.get(
  ORGANISATION.PRODUCTS.DETAILS,
  verifyToken,
  restrictTo(SUPER_ADMIN, ADMIN, ORG_ADMIN),
  listProductsById,
);

productsRouter.get(
  `${ORGANISATION.PRODUCTS.DEFAULT}/:organisationId`,
  verifyToken,
  restrictTo(SUPER_ADMIN, ADMIN),
  listProductsByOrg,
);

module.exports = { productsRouter };
