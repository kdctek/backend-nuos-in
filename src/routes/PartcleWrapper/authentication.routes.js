const authenticationRouter = require('express').Router();

const {
  Routes: { PARTICLE },
  UserRoles: { ADMIN },
} = require('../../constants');

const {
  authenticationController: {
    generatePArticleAccessToken,
    getCurrentAccessToken,
  },
} = require('../../controller/ParticleWrapper');

const {
  particleValidations: { validateGenerateToken },
} = require('../../validations');

const { verifyToken, restrictTo } = require('../../middleware');

authenticationRouter.post(
  PARTICLE.ACCESS_TOKEN,
  verifyToken,
  restrictTo(ADMIN),
  validateGenerateToken,
  generatePArticleAccessToken,
);

authenticationRouter.get(
  PARTICLE.ACCESS_TOKEN,
  verifyToken,
  restrictTo(ADMIN),
  getCurrentAccessToken,
);

module.exports = { authenticationRouter };
