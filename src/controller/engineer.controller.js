const { HttpStatus } = require('../constants');
const { NotFoundException } = require('../errors');
const { asyncHandler } = require('../middleware');
const { User } = require('../models');
const { queryService } = require('../services');
const { logger } = require('../shared');
const {
  UserRoles: { ENGINEER },
} = require('../constants');

/**
  @desc   Fetch engineer
  @param  { page, limit }
  @method GET
  @route  /api/v1/engineer/
  @access Private
  @role   Admin
*/
exports.getAllEngineerHandler = asyncHandler(async (req, res, _) => {
  const query = { ...req.query };
  query.page = +query.page || 1;
  query.limit = +query.limit || 10;
  query.role = ENGINEER;
  query.sort = 'createdAt';
  query.fields = 'firstName,lastName,email,role,createdAt,updatedAt';
  const features = new queryService.APIFeatures(User.find(), query || {})
    .filter()
    .sort()
    .paginate()
    .limitFields();
  const engineer = await features.query;
  logger.info(
    `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'Fetch engineer successfully!' `,
  );
  return res.status(HttpStatus.OK).json({
    statusCode: HttpStatus.OK,
    message: 'Fetch engineer Successfully!',
    data: engineer,
  });
});

/**
  @desc   Fetch engineer by id
  @param  { id }
  @method GET
  @route  /api/v1/admin/engineer/:id
  @access Private
  @role   Admin
*/
exports.getEngineerByIdHandler = asyncHandler(async (req, res, _) => {
  const { id } = req.params;
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Invalid engineer id',
    });
  }
  const engineer = await User.findOne({ _id: id });

  logger.info(
    `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'Fetch engineer successfully!' `,
  );
  return res.status(HttpStatus.OK).json({
    statusCode: HttpStatus.OK,
    message: 'Fetch engineer Successfully!',
    data: engineer,
  });
});

/**
  @desc   Update engineer by id
  @param  { id }
  @method PUT
  @route  /api/v1/admin/engineer/:id
  @access Private
  @role   Admin
*/
exports.updateEngineerHandler = asyncHandler(async (req, res, _) => {
  const { firstName, lastName, email, phoneNumber } = req.body;
  const { id } = req.params;
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Invalid engineer id',
    });
  }
  const engineer = await User.findOne({ _id: id });

  if (!engineer) {
    throw new NotFoundException('Engineer not found!');
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
    `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'Updated engineer successfully!' `,
  );
  return res.status(HttpStatus.OK).json({
    statusCode: HttpStatus.OK,
    message: 'Updated engineer Successfully!',
    data: updatedDetails,
  });
});

/**
  @desc   Delete engineer by id
  @param  { id }
  @method DELETE
  @route  /api/v1/admin/engineer/:id
  @access Private
  @role   Admin
*/
exports.deleteEngineerHandler = asyncHandler(async (req, res, _) => {
  const { id } = req.params;
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Invalid engineer id',
    });
  }
  const engineer = await User.findOne({ _id: id });

  if (!engineer) {
    throw new NotFoundException('Engineer not found!');
  }

  await User.findOneAndDelete({ _id: id });

  logger.info(
    `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'Engineer deleted successfully!' `,
  );
  return res.status(HttpStatus.OK).json({
    statusCode: HttpStatus.OK,
    message: 'Engineer deleted successfully!',
    data: engineer,
  });
});
