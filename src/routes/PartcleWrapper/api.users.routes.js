const apiUserRouter = require('express').Router();

const {
  Routes: { PARTICLE },
  UserRoles: { ADMIN },
} = require('../../constants');

const {
  apiUserController: {
    addProductScopedApiUser,
    addOrganisationScopedApiUser,
    deleteProductScopedApiUser,
    deleteOrganisationScopedApiUser,
    updateProductScopedApiUser,
    updateOrganisationScopedApiUser,
  },
} = require('../../controller/ParticleWrapper');

const {
  particleValidations: { validateGenerateToken },
} = require('../../validations');

const { verifyToken, restrictTo } = require('../../middleware');

apiUserRouter.post(
  PARTICLE.API_USER.PRODUCT_SCOPED,
  verifyToken,
  restrictTo(ADMIN),
  addProductScopedApiUser,
);
apiUserRouter.post(
  PARTICLE.API_USER.ORGANISATION_SCOPED,
  verifyToken,
  restrictTo(ADMIN),
  addOrganisationScopedApiUser,
);
apiUserRouter.put(
  PARTICLE.API_USER.PRODUCT_SCOPED,
  verifyToken,
  restrictTo(ADMIN),
  updateProductScopedApiUser,
);
apiUserRouter.put(
  PARTICLE.API_USER.ORGANISATION_SCOPED,
  verifyToken,
  restrictTo(ADMIN),
  updateOrganisationScopedApiUser,
);
apiUserRouter.delete(
  PARTICLE.API_USER.PRODUCT_SCOPED,
  verifyToken,
  restrictTo(ADMIN),
  deleteProductScopedApiUser,
);
apiUserRouter.delete(
  PARTICLE.API_USER.ORGANISATION_SCOPED,
  verifyToken,
  restrictTo(ADMIN),
  deleteOrganisationScopedApiUser,
);

module.exports = { apiUserRouter };
