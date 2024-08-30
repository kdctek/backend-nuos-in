const { HttpStatus } = require('../constants');
const { NotFoundException } = require('../errors');
const { asyncHandler } = require('../middleware');
const { User } = require('../models');
const { queryService } = require('../services');
const { logger } = require('../shared');
const {
  UserRoles: { TESTER },
} = require('../constants');

/**
  @desc   Fetch tester
  @param  { page, limit }
  @method GET
  @route  /api/v1/tester/
  @access Private
  @role   Admin
*/
exports.getAllTesterHandler = asyncHandler(async (req, res, _) => {
  const query = { ...req.query };
  query.page = +query.page || 1;
  query.limit = +query.limit || 10;
  query.role = TESTER;
  query.sort = 'createdAt';
  query.fields = 'firstName,lastName,email,role,createdAt,updatedAt';
  const features = new queryService.APIFeatures(User.find(), query || {})
    .filter()
    .sort()
    .paginate()
    .limitFields();
  const tester = await features.query;
  logger.info(
    `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'Fetch tester successfully!' `,
  );
  return res.status(HttpStatus.OK).json({
    statusCode: HttpStatus.OK,
    message: 'Fetch tester Successfully!',
    data: tester,
  });
});

/**
  @desc   Fetch tester by id
  @param  { id }
  @method GET
  @route  /api/v1/admin/tester/:id
  @access Private
  @role   Admin
*/
exports.getTesterByIdHandler = asyncHandler(async (req, res, _) => {
  const { id } = req.params;
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Invalid tester id',
    });
  }
  const tester = await User.findOne({ _id: id });

  logger.info(
    `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'Fetch tester successfully!' `,
  );
  return res.status(HttpStatus.OK).json({
    statusCode: HttpStatus.OK,
    message: 'Fetch tester Successfully!',
    data: tester,
  });
});

/**
  @desc   Update tester by id
  @param  { id }
  @method PUT
  @route  /api/v1/admin/tester/:id
  @access Private
  @role   Admin
*/
exports.updateTesterHandler = asyncHandler(async (req, res, _) => {
  const { firstName, lastName, email, phoneNumber } = req.body;
  const { id } = req.params;
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Invalid tester id',
    });
  }
  const tester = await User.findOne({ _id: id });

  if (!tester) {
    throw new NotFoundException('Tester not found!');
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
    `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'Updated tester successfully!' `,
  );
  return res.status(HttpStatus.OK).json({
    statusCode: HttpStatus.OK,
    message: 'Updated tester Successfully!',
    data: updatedDetails,
  });
});

/**
  @desc   Delete tester by id
  @param  { id }
  @method DELETE
  @route  /api/v1/admin/tester/:id
  @access Private
  @role   Admin
*/
exports.deleteTesterHandler = asyncHandler(async (req, res, _) => {
  const { id } = req.params;
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Invalid tester id',
    });
  }
  const tester = await User.findOne({ _id: id });

  if (!tester) {
    throw new NotFoundException('Tester not found!');
  }

  await User.findOneAndDelete({ _id: id });

  logger.info(
    `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'Tester deleted successfully!' `,
  );
  return res.status(HttpStatus.OK).json({
    statusCode: HttpStatus.OK,
    message: 'Tester deleted successfully!',
    data: tester,
  });
});
