const { HttpStatus } = require('../constants');
const { NotFoundException } = require('../errors');
const { asyncHandler } = require('../middleware');
const { User } = require('../models');
const { queryService } = require('../services');
const { logger } = require('../shared');
const {
  UserRoles: { CHANNEL_PARTNER },
} = require('../constants');

/**
  @desc   Fetch CHANNEL PARTNER
  @param  { page, limit }
  @method GET
  @route  /api/v1/admin/channel_partner
  @access Private
  @role   Admin
*/
exports.getAllChannelPartnerHandler = asyncHandler(async (req, res, _) => {
  const query = { ...req.query };
  query.page = +query.page || 1;
  query.limit = +query.limit || 10;
  query.role = CHANNEL_PARTNER;
  query.sort = 'createdAt';
  query.fields = 'firstName,lastName,email,role,createdAt,updatedAt';
  const features = new queryService.APIFeatures(User.find(), query || {})
    .filter()
    .sort()
    .paginate()
    .limitFields();
  const channelPartner = await features.query;
  logger.info(
    `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'Fetch channel partner successfully!'`,
  );
  return res.status(HttpStatus.OK).json({
    statusCode: HttpStatus.OK,
    message: 'Fetch channel partner Successfully!',
    data: channelPartner,
  });
});

/**
  @desc   Fetch CHANNEL PARTNER by id
  @param  { id }
  @method GET
  @route  /api/v1/admin/channel_partner/:id
  @access Private
  @role   Admin
*/
exports.getChannelPartnerByIdHandler = asyncHandler(async (req, res, _) => {
  const { id } = req.params;
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Invalid channel partner id',
    });
  }
  const channelPartner = await User.findOne({ _id: id });

  logger.info(
    `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'Fetch channel partner successfully!' `,
  );
  return res.status(HttpStatus.OK).json({
    statusCode: HttpStatus.OK,
    message: 'Fetch channel partner Successfully!',
    data: channelPartner,
  });
});

/**
  @desc   Update CHANNEL PARTNER by id
  @param  { id }
  @method PUT
  @route  /api/v1/admin/channel_partner/:id
  @access Private
  @role   Admin
*/
exports.updateChannelPartnerHandler = asyncHandler(async (req, res, _) => {
  const { firstName, lastName, email, phoneNumber } = req.body;
  const { id } = req.params;
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Invalid channel partner id',
    });
  }

  const channelPartner = await User.findOne({ _id: id });

  if (!channelPartner) {
    throw new NotFoundException('Channel Partner not found!');
  }

  const updatedDetails = await User.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        firstName,
        lastName,
        email,
        phoneNumber,
      },
    },
    { new: true },
  );

  logger.info(
    `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'Updated channel partner successfully!' `,
  );
  return res.status(HttpStatus.OK).json({
    statusCode: HttpStatus.OK,
    message: 'Updated channel partner Successfully!',
    data: updatedDetails,
  });
});

/**
  @desc   Delete CHANNEL PARTNER by id
  @param  { id }
  @method DELETE
  @route  /api/v1/admin/channel_partner/:id
  @access Private
  @role   Admin
*/
exports.deleteChannelPartnerHandler = asyncHandler(async (req, res, _) => {
  const { id } = req.params;
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Invalid channel partner id',
    });
  }
  const channelPartner = await User.findOne({ _id: req.params.id });

  if (!channelPartner) {
    throw new NotFoundException('Channel Partner not found!');
  }

  await User.findOneAndDelete({ _id: req.params.id });

  logger.info(
    `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'Channel Partner deleted successfully!' `,
  );
  return res.status(HttpStatus.OK).json({
    statusCode: HttpStatus.OK,
    message: 'Channel Partner deleted successfully!',
    data: channelPartner,
  });
});
