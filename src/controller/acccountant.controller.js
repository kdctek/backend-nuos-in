const { HttpStatus } = require('../constants');
const { NotFoundException } = require('../errors');
const { asyncHandler } = require('../middleware');
const { User } = require('../models');
const { queryService } = require('../services');
const { logger } = require('../shared');
const {
  UserRoles: { ACCOUNTS },
} = require('../constants');

/**
  @desc   Fetch accountant
  @param  { page, limit }
  @method GET
  @route  /api/v1/accountant/
  @access Private
  @role   Admin
*/
exports.getAllAccountantHandler = asyncHandler(async (req, res, _) => {
  const query = { ...req.query };
  query.page = +query.page || 1;
  query.limit = +query.limit || 10;
  query.role = ACCOUNTS;
  query.sort = 'createdAt';
  query.fields = 'firstName,lastName,email,role,createdAt,updatedAt';
  const features = new queryService.APIFeatures(User.find(), query || {})
    .filter()
    .sort()
    .paginate()
    .limitFields();
  const accountant = await features.query;
  logger.info(
    `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'Fetch accountant successfully!' `,
  );
  return res.status(HttpStatus.OK).json({
    statusCode: HttpStatus.OK,
    message: 'Fetch accountant Successfully!',
    data: accountant,
  });
});

/**
  @desc   Fetch accountant by id
  @param  { id }
  @method GET
  @route  /api/v1/admin/:id
  @access Private
  @role   Admin
*/
exports.getAccountantByIdHandler = asyncHandler(async (req, res, _) => {
  const { id } = req.params;
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Invalid accountant id',
    });
  }
  const accountant = await User.findOne({ _id: id });

  logger.info(
    `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'Fetch accountant successfully!' `,
  );
  return res.status(HttpStatus.OK).json({
    statusCode: HttpStatus.OK,
    message: 'Fetch accountant Successfully!',
    data: accountant,
  });
});

/**
  @desc   Update accountant by id
  @param  { id }
  @method PUT
  @route  /api/v1/admin/:id
  @access Private
  @role   Admin
*/
exports.updateAccountantHandler = asyncHandler(async (req, res, _) => {
  const { firstName, lastName, email, phoneNumber } = req.body;
  const { id } = req.params;
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Invalid accountant id',
    });
  }
  const accountant = await User.findOne({ _id: id });

  if (!accountant) {
    throw new NotFoundException('Accountant not found!');
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
    `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'Updated accountant successfully!' `,
  );
  return res.status(HttpStatus.OK).json({
    statusCode: HttpStatus.OK,
    message: 'Updated accountant Successfully!',
    data: updatedDetails,
  });
});

/**
  @desc   Delete accountant by id
  @param  { id }
  @method DELETE
  @route  /api/v1/admin/:id
  @access Private
  @role   Admin
*/
exports.deleteAccountantHandler = asyncHandler(async (req, res, _) => {
  const { id } = req.params;
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Invalid accountant id',
    });
  }
  const accountant = await User.findOne({ _id: id });

  if (!accountant) {
    throw new NotFoundException('Accountant not found!');
  }

  await User.findOneAndDelete({ _id: id });

  logger.info(
    `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'Accountant deleted successfully!' `,
  );
  return res.status(HttpStatus.OK).json({
    statusCode: HttpStatus.OK,
    message: 'Accountant deleted successfully!',
    data: accountant,
  });
});
