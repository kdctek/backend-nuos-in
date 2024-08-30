const quarantinedRouter = require('express').Router();

const {
  Routes: { PARTICLE },
  UserRoles: { ADMIN },
} = require('../../constants');

const {
  quarantinedController: { approveDevice, denyDeviceApproval },
} = require('../../controller/ParticleWrapper');

const { verifyToken, restrictTo } = require('../../middleware');

quarantinedRouter.post(
  PARTICLE.QUARANTINED,
  verifyToken,
  restrictTo(ADMIN),
  approveDevice,
);

quarantinedRouter.delete(
  PARTICLE.QUARANTINED,
  verifyToken,
  restrictTo(ADMIN),
  denyDeviceApproval,
);

module.exports = { quarantinedRouter };
