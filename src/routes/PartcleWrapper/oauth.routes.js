const oauthClientRouter = require('express').Router();

const {
  Routes: { PARTICLE },
  UserRoles: { ADMIN },
} = require('../../constants');

const {
  oauthController: { createClient, deleteClient, listClients, updateClient },
} = require('../../controller/ParticleWrapper');

const {
  particleValidations: { validateGenerateToken },
} = require('../../validations');

const { verifyToken, restrictTo } = require('../../middleware');

oauthClientRouter.get(
  PARTICLE.CLIENT.DEFAULT,
  verifyToken,
  restrictTo(ADMIN),
  //   validateGenerateToken,
  listClients,
);
oauthClientRouter.patch(
  PARTICLE.CLIENT.DETAILS,
  verifyToken,
  restrictTo(ADMIN),
  //   validateGenerateToken,
  updateClient,
);
oauthClientRouter.post(
  PARTICLE.CLIENT.DEFAULT,
  verifyToken,
  restrictTo(ADMIN),
  //   validateGenerateToken,
  createClient,
);
oauthClientRouter.delete(
  PARTICLE.CLIENT.DETAILS,
  verifyToken,
  restrictTo(ADMIN),
  //   validateGenerateToken,
  deleteClient,
);

module.exports = { oauthClientRouter };
