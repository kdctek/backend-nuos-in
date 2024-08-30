const { HttpStatus } = require('../constants');
const { NotFoundException } = require('../errors');
const { asyncHandler } = require('../middleware');
const { User } = require('../models');
const { queryService } = require('../services');
const { logger } = require('../shared');
const {
  UserRoles: { MARKETER },
} = require('../constants');

/**
  @desc   Fetch Marketer
  @param  { page, limit }
  @method GET
  @route  /api/v1/admin/marketer
  @access Private
  @role   Admin
*/
exports.getAllMarketerHandler = asyncHandler(async (req, res, _) => {
  const query = { ...req.query };
  query.page = +query.page || 1;
  query.limit = +query.limit || 10;
  query.role = MARKETER;
  query.sort = 'createdAt';
  query.fields = 'firstName,lastName,email,role,createdAt,updatedAt';
  const features = new queryService.APIFeatures(User.find(), query || {})
    .filter()
    .sort()
    .paginate()
    .limitFields();
  const marketer = await features.query;
  logger.info(
    `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'Fetch marketer successfully!'`,
  );
  return res.status(HttpStatus.OK).json({
    statusCode: HttpStatus.OK,
    message: 'Fetch marketer Successfully!',
    data: marketer,
  });
});

/**
  @desc   Fetch marketer by id
  @param  { id }
  @method GET
  @route  /api/v1/admin/:id
  @access Private
  @role   Admin
*/
exports.getMarketerByIdHandler = asyncHandler(async (req, res, _) => {
  const { id } = req.params;
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Invalid marketer id',
    });
  }
  const marketer = await User.findOne({ _id: id });

  logger.info(
    `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'Fetch marketer successfully!' `,
  );
  return res.status(HttpStatus.OK).json({
    statusCode: HttpStatus.OK,
    message: 'Fetch marketer Successfully!',
    data: marketer,
  });
});

/**
  @desc   Update marketer by id
  @param  { id }
  @method PUT
  @route  /api/v1/admin/:id
  @access Private
  @role   Admin
*/
exports.updateMarketerHandler = asyncHandler(async (req, res, _) => {
  const { firstName, lastName, email, phoneNumber } = req.body;
  const { id } = req.params;
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Invalid marketer id',
    });
  }

  const marketer = await User.findOne({ _id: id });

  if (!marketer) {
    throw new NotFoundException('Marketer not found!');
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
    `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'Updated marketer successfully!' `,
  );
  return res.status(HttpStatus.OK).json({
    statusCode: HttpStatus.OK,
    message: 'Updated marketer Successfully!',
    data: updatedDetails,
  });
});

/**
  @desc   Delete marketer by id
  @param  { id }
  @method DELETE
  @route  /api/v1/admin/:id
  @access Private
  @role   Admin
*/
exports.deleteMarketerHandler = asyncHandler(async (req, res, _) => {
  const { id } = req.params;
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Invalid marketer id',
    });
  }
  const marketer = await User.findOne({ _id: req.params.id });

  if (!marketer) {
    throw new NotFoundException('Marketer not found!');
  }

  await User.findOneAndDelete({ _id: req.params.id });

  logger.info(
    `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'Marketer deleted successfully!' `,
  );
  return res.status(HttpStatus.OK).json({
    statusCode: HttpStatus.OK,
    message: 'Marketer deleted successfully!',
    data: marketer,
  });
});
