/* eslint-disable no-unused-expressions */
const { UserProfile } = require('../models');
const { HttpStatus } = require('../constants');
const { asyncHandler } = require('../middleware');
const { logger } = require('../shared');

exports.listUserProfiles = asyncHandler(async (req, res, _) => {
  const userProfiles = await UserProfile.find()
    .populate('users')
    .populate('devices');
  if (userProfiles) {
    logger.info(
      `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'User profiles fetched successfully!' `,
    );
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'User profiles fetched successfully!',
      data: userProfiles,
    });
  }

  return res.status(HttpStatus.BAD_REQUEST).json({
    statusCode: HttpStatus.BAD_REQUEST,
  });
});

exports.addNewUserProfile = asyncHandler(async (req, res, _) => {
  const { users, devices } = req.body;
  const newProfile = await UserProfile.create({
    users,
    devices,
  });
  if (newProfile) {
    logger.info(
      `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'User profile created successfully!' `,
    );
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'User profile created successfully!',
      data: newProfile,
    });
  }

  return res.status(HttpStatus.BAD_REQUEST).json({
    statusCode: HttpStatus.BAD_REQUEST,
  });
});

exports.addUserToProfile = asyncHandler(async (req, res, _) => {
  const { id } = req.params;
  const { userId, deviceId } = req.body;
  const userProfile = await UserProfile.findOne({ _id: id });
  if (userProfile) {
    if (userId && !userProfile.users.includes(userId)) {
      userProfile.users.push(userId);
    }
    if (deviceId && !userProfile.devices.includes(deviceId)) {
      userProfile.devices.push(deviceId);
    }
    if (userId && deviceId) {
      if (
        !userProfile.devices.includes(deviceId) &&
        !userProfile.users.includes(userId)
      ) {
        userProfile.users.push(userId);
        userProfile.devices.push(deviceId);
      } else {
        return res.status(HttpStatus.BAD_REQUEST).json({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Either Device ID/User ID already exists',
        });
      }
    }
    await userProfile.save();
    logger.info(
      `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'User profile updated successfully!' `,
    );
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'User profile updated successfully!',
      data: userProfile,
    });
  }

  return res.status(HttpStatus.BAD_REQUEST).json({
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'User profile does not exist',
  });
});
