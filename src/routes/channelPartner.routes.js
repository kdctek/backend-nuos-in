const channelPartnerRouter = require('express').Router();

const {
  Routes: { ADMIN },
  UserRoles,
} = require('../constants');
const {
  channelPartnerController: {
    getAllChannelPartnerHandler,
    getChannelPartnerByIdHandler,
    updateChannelPartnerHandler,
    deleteChannelPartnerHandler,
  },
} = require('../controller');

const { verifyToken, restrictTo } = require('../middleware');

channelPartnerRouter.get(
  ADMIN.CHANNEL_PARTNER,
  verifyToken,
  restrictTo(UserRoles.ADMIN),
  getAllChannelPartnerHandler,
);

channelPartnerRouter
  .route(ADMIN.CHANNEL_PARTNER_DETAIL)
  .get(verifyToken, restrictTo(UserRoles.ADMIN), getChannelPartnerByIdHandler)
  .patch(verifyToken, restrictTo(UserRoles.ADMIN), updateChannelPartnerHandler)
  .delete(
    verifyToken,
    restrictTo(UserRoles.ADMIN),
    deleteChannelPartnerHandler,
  );

module.exports = { channelPartnerRouter };
