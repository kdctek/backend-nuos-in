const { HttpStatus, UserRoles } = require('../constants');
const { NotFoundException, BadRequestException } = require('../errors');
const { asyncHandler } = require('../middleware');
const { User } = require('../models');
const { queryService, jwtService } = require('../services');
const { logger } = require('../shared');
const {
  UserRoles: { ADMIN },
} = require('../constants');
const { sendVerifyEmail } = require('../services/email.service');

/**
  @desc   Add admin
  @param  { firstName,lastName, email, phoneNumber }
  @method POST
  @route  /api/v1/super_admin/
  @access Private
  @role   Super Admin
*/
exports.createAdminHandler = asyncHandler(async (req, res, _) => {
  const { firstName, lastName, email, phoneNumber } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw new BadRequestException('Email is already taken');
  }

  const verificationToken = jwtService.invitationToken({
    firstName,
    lastName,
    email,
    phoneNumber,
    role: UserRoles.ADMIN,
  });

  sendVerifyEmail({ firstName, lastName, email, verificationToken });

  logger.info(
    `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'Email invitation sent successfully!' `,
  );
  return res.status(HttpStatus.CREATED).json({
    statusCode: HttpStatus.CREATED,
    message: 'Email invitation sent successfully!',
  });
});

/**
  @desc   Fetch users
  @param  { page, limit }
  @method GET
  @route  /api/v1/users/
  @access Private
  @role   Admin
*/
exports.getAllAdminHandler = asyncHandler(async (req, res, _) => {
  const query = { ...req.query };
  query.page = +query.page || 1;
  query.limit = +query.limit || 10;
  query.sort = 'createdAt';
  query.role = ADMIN;
  query.fields = 'firstName,lastName,email,role,createdAt,updatedAt';
  const features = new queryService.APIFeatures(User.find(), query || {})
    .filter()
    .sort()
    .paginate()
    .limitFields();
  const admins = await features.query;
  logger.info(
    `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'Fetch admins successfully!' `,
  );
  return res.status(HttpStatus.OK).json({
    statusCode: HttpStatus.OK,
    message: 'Fetch admins Successfully!',
    data: admins,
  });
});

/**
  @desc   Fetch admin by id
  @param  { id }
  @method GET
  @route  /api/v1/users/:id
  @access Private
  @role   Admin
*/
exports.getAdminByIdHandler = asyncHandler(async (req, res, _) => {
  const admin = await User.findOne({ _id: req.params.id });
  logger.info(
    `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'Fetch admin successfully!' `,
  );
  return res.status(HttpStatus.OK).json({
    statusCode: HttpStatus.OK,
    message: 'Fetch admin Successfully!',
    data: admin,
  });
});

/**
  @desc   Update admin by id
  @param  { id }
  @method PUT
  @route  /api/v1/users/:id
  @access Private
  @role   Admin
*/
exports.updateAdminHandler = asyncHandler(async (req, res, _) => {
  const { firstName, lastName, email, phoneNumber } = req.body;
  const admin = await User.findOne({
    _id: req.params.id,
    role: UserRoles.ADMIN,
  });

  if (!admin) {
    throw new NotFoundException('Admin not found!');
  }

  const updatedAdmin = await User.findOneAndUpdate(
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
    `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'Updated admin successfully!' `,
  );
  return res.status(HttpStatus.OK).json({
    statusCode: HttpStatus.OK,
    message: 'Updated admin Successfully!',
    data: updatedAdmin,
  });
});

/**
  @desc   Delete admin by id
  @param  { id }
  @method DELETE
  @route  /api/v1/users/:id
  @access Private
  @role   Admin
*/
exports.deleteAdminHandler = asyncHandler(async (req, res, _) => {
  const admin = await User.findOne({ _id: req.params.id });

  if (!admin) {
    throw new NotFoundException('User not found!');
  }

  await User.findOneAndDelete({ _id: req.params.id });

  logger.info(
    `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'Admin deleted successfully!' `,
  );
  return res.status(HttpStatus.OK).json({
    statusCode: HttpStatus.OK,
    message: 'Admin deleted successfully!',
    data: admin,
  });
});
