const deviceRouter = require('express').Router();

const {
  UserRoles: { SUPER_ADMIN, ADMIN, USER, ORG_ADMIN },
  Routes: { ORGANISATION },
} = require('../../constants');

const {
  deviceController: {
    addDevice,
    listDevices,
    claimDevice,
    unClaimDevice,
    removeDeviceFromProduct,
    getDeviceInformation,
    updateDevice,
    getDevicesFromProduct,
    getDevicesFromOrg,
  },
} = require('../../controller/ParticleWrapper');

const {
  deviceValidations: { validateAddDevice, validateUpdateDevice },
} = require('../../validations');

const { verifyToken, restrictTo } = require('../../middleware');

deviceRouter.post(
  ORGANISATION.DEVICES.DEFAULT,
  verifyToken,
  restrictTo(ORG_ADMIN),
  validateAddDevice,
  addDevice,
);

deviceRouter.patch(
  `${ORGANISATION.DEVICES.DEFAULT}/claim_device/:id`,
  verifyToken,
  restrictTo(ORG_ADMIN, USER),
  claimDevice,
);
deviceRouter.patch(
  `${ORGANISATION.DEVICES.DEFAULT}/unclaim_device/:id`,
  verifyToken,
  restrictTo(ORG_ADMIN, USER),
  unClaimDevice,
);

deviceRouter.patch(
  ORGANISATION.DEVICES.DETAILS,
  verifyToken,
  restrictTo(ORG_ADMIN, USER),
  validateUpdateDevice,
  updateDevice,
);

deviceRouter.delete(
  ORGANISATION.DEVICES.DETAILS,
  verifyToken,
  restrictTo(ORG_ADMIN),
  removeDeviceFromProduct,
);

deviceRouter.get(
  ORGANISATION.DEVICES.DEFAULT,
  verifyToken,
  restrictTo(SUPER_ADMIN, ADMIN, ORG_ADMIN),
  listDevices,
);

deviceRouter.get(
  `${ORGANISATION.DEVICES.DEFAULT}/all_devices/:id`,
  verifyToken,
  restrictTo(SUPER_ADMIN),
  getDevicesFromOrg,
);

deviceRouter.get(
  `${ORGANISATION.DEVICES.DEFAULT}/product/:id`,
  verifyToken,
  restrictTo(SUPER_ADMIN, ADMIN),
  getDevicesFromProduct,
);

deviceRouter.get(
  ORGANISATION.DEVICES.DETAILS,
  verifyToken,
  restrictTo(SUPER_ADMIN, ORG_ADMIN, ADMIN, USER),
  getDeviceInformation,
);

module.exports = { deviceRouter };
