const particleUserRouter = require('express').Router();

const {
  Routes: { PARTICLE },
  UserRoles: { ADMIN },
} = require('../../constants');

const {
  particleUserController: {
    getParticleUser,
    updateParticleUSer,
    deleteParticleUser,
    forgotParticlePassword,
  },
} = require('../../controller/ParticleWrapper');

const {
  particleValidations: { validateGenerateToken },
} = require('../../validations');

const { verifyToken, restrictTo } = require('../../middleware');

particleUserRouter.get(
  PARTICLE.USER,
  verifyToken,
  restrictTo(ADMIN),
  //   validateGenerateToken,
  getParticleUser,
);
particleUserRouter.patch(
  PARTICLE.USER,
  verifyToken,
  restrictTo(ADMIN),
  //   validateGenerateToken,
  updateParticleUSer,
);
particleUserRouter.post(
  PARTICLE.USER,
  verifyToken,
  restrictTo(ADMIN),
  //   validateGenerateToken,
  forgotParticlePassword,
);
particleUserRouter.delete(
  PARTICLE.USER,
  verifyToken,
  restrictTo(ADMIN),
  //   validateGenerateToken,
  deleteParticleUser,
);

module.exports = { particleUserRouter };
