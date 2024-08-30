const { HttpStatus } = require('../../../constants');
const { asyncHandler } = require('../../../middleware');
const { logger } = require('../../../shared');
const { Device } = require('../../../models');

exports.listDevices = asyncHandler(async (req, res, _) => {
  const devices = await Device.find().populate('productId').populate('users');
  if (devices) {
    logger.info(
      `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'Devices fetched successfully!' `,
    );
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Devices fetched successfully!',
      data: devices,
    });
  }

  return res.status(HttpStatus.BAD_REQUEST).json({
    statusCode: HttpStatus.BAD_REQUEST,
  });
});

exports.addDevice = asyncHandler(async (req, res, _) => {
  const { organisation } = req.user;
  const { deviceId, productId } = req.body;
  const device = await Device.findOne({
    deviceId,
  });

  if (device) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Device with this device id already exists!',
    });
  }
  const newDevice = await Device.create({
    deviceId,
    productId,
    organisationId: organisation,
  });
  if (newDevice) {
    logger.info(
      `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'Devices created successfully!' `,
    );
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Devices created successfully!',
      data: newDevice,
    });
  }

  return res.status(HttpStatus.BAD_REQUEST).json({
    statusCode: HttpStatus.BAD_REQUEST,
  });
});

exports.claimDevice = asyncHandler(async (req, res, _) => {
  const { id } = req.params;
  const { userId } = req.body;
  if (!userId) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'User Id is required!',
    });
  }

  const device = await Device.findOne({
    _id: id,
  });
  if (device) {
    const result = device.users.find((user) => user.toString() === userId);
    if (result) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Device is already claimed!',
      });
    }
    device.users.push(userId);
    await device.save();
    logger.info(
      `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] -  'Device claimed successfully!' `,
    );
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Device claimed successfully!',
      data: device,
    });
  }

  return res.status(HttpStatus.BAD_REQUEST).json({
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Something went wrong!',
  });
});

exports.unClaimDevice = asyncHandler(async (req, res, _) => {
  const { id } = req.params;
  const { userId } = req.body;
  if (!userId) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'User Id is required!',
    });
  }
  const device = await Device.findOneAndUpdate(
    {
      _id: id,
    },
    { $pull: { users: userId } },
    {
      new: true,
    },
  );
  if (device) {
    logger.info(
      `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'Device unclaimed successfully!'`,
    );
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Device unclaimed successfully!',
      data: device,
    });
  }

  return res.status(HttpStatus.BAD_REQUEST).json({
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Something went wrong!',
  });
});

exports.updateDevice = asyncHandler(async (req, res, _) => {
  const { id } = req.params;
  const {
    name,
    platform_id,
    last_ip_address,
    last_heard,
    last_handshake_at,
    online,
    cellular,
    notes,
    functions,
    variables,
    status,
    serial_number,
    mac_wifi,
    system_firmware_version,
  } = req.body;
  const newDevice = await Device.findOneAndUpdate(
    { _id: id },
    {
      name,
      platform_id,
      notes,
      last_ip_address,
      last_heard,
      last_handshake_at,
      online,
      cellular,
      functions,
      variables,
      status,
      serial_number,
      mac_wifi,
      system_firmware_version,
    },
    {
      new: true,
    },
  );
  if (newDevice) {
    logger.info(
      `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'Devices updated successfully!' `,
    );
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Devices updated successfully!',
      data: newDevice,
    });
  }

  return res.status(HttpStatus.BAD_REQUEST).json({
    statusCode: HttpStatus.BAD_REQUEST,
  });
});

exports.removeDeviceFromProduct = asyncHandler(async (req, res, _) => {
  const { id } = req.params;
  const device = await Device.findOneAndDelete({
    _id: id,
  });
  if (device) {
    logger.info(
      `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'Device removed successfully!'`,
    );
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Device removed successfully!',
      data: device,
    });
  }

  return res.status(HttpStatus.BAD_REQUEST).json({
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Device not found!',
  });
});

exports.getDevicesFromProduct = asyncHandler(async (req, res, _) => {
  const { id } = req.params;
  const device = await Device.find({
    productId: id,
  }).populate('users');
  if (device) {
    logger.info(
      `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'Device fetched successfully!'`,
    );
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Device fetched successfully!',
      data: device,
    });
  }

  return res.status(HttpStatus.BAD_REQUEST).json({
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Product not found!',
  });
});

exports.getDevicesFromOrg = asyncHandler(async (req, res, _) => {
  const { id } = req.params;
  const device = await Device.find({
    organisationId: id,
  }).populate('users');
  if (device) {
    logger.info(
      `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'Devices fetched successfully!'`,
    );
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Devices fetched successfully!',
      data: device,
    });
  }

  return res.status(HttpStatus.BAD_REQUEST).json({
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Devices not found!',
  });
});

exports.getDeviceInformation = asyncHandler(async (req, res, _) => {
  const { id } = req.params;
  const device = await Device.findOne({
    _id: id,
  }).populate('users');
  if (device) {
    logger.info(
      `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'Device info fetched successfully!'`,
    );
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Device info fetched successfully!',
      data: device,
    });
  }

  return res.status(HttpStatus.BAD_REQUEST).json({
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Device not found!',
  });
});
