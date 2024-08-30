const userProfileRouter = require('express').Router();

const {
  Routes: { USER_PROFILE },
  UserRoles: { ADMIN },
} = require('../constants');

const {
  userProfileController: {
    addNewUserProfile,
    listUserProfiles,
    addUserToProfile,
  },
} = require('../controller');

const { verifyToken, restrictTo } = require('../middleware');

userProfileRouter.post('/', verifyToken, restrictTo(ADMIN), addNewUserProfile);

userProfileRouter.get('/', verifyToken, restrictTo(ADMIN), listUserProfiles);

userProfileRouter.patch(
  USER_PROFILE.DETAIL,
  verifyToken,
  restrictTo(ADMIN),
  addUserToProfile,
);

module.exports = { userProfileRouter };
