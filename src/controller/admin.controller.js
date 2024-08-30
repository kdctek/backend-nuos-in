const { HttpStatus, UserRoles } = require('../constants');
const { BadRequestException } = require('../errors');
const { asyncHandler } = require('../middleware');
const { User } = require('../models');
const { jwtService } = require('../services');
const {
  sendAccountCreationEmail,
  sendVerifyEmail,
} = require('../services/email.service');
const { logger, generateRandomNumber } = require('../shared');

/**
  @desc   Add Accountant
  @param  { firstName,lastName, email, phoneNumber }
  @method POST
  @route  /api/v1/admin/accountants
  @access Private
  @role   Admin
*/
exports.createAccountantHandler = asyncHandler(async (req, res, _) => {
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
    role: UserRoles.ACCOUNTS,
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
  @desc   Add Channel Person
  @param  { firstName,lastName, email, phoneNumber }
  @method POST
  @route  /api/v1/admin/channel_person
  @access Private
  @role   Admin
*/
exports.createChannelPersonHandler = asyncHandler(async (req, res, _) => {
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
    role: UserRoles.CHANNEL_PARTNER,
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
  @desc   Add Engineer
  @param  { firstName,lastName, email, phoneNumber }
  @method POST
  @route  /api/v1/admin/engineer
  @access Private
  @role   Admin
*/
exports.createEngineerHandler = asyncHandler(async (req, res, _) => {
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
    role: UserRoles.ENGINEER,
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
  @desc   Add Marketer
  @param  { firstName,lastName, email, phoneNumber }
  @method POST
  @route  /api/v1/admin/marketer
  @access Private
  @role   Admin
*/
exports.createMarketerHandler = asyncHandler(async (req, res, _) => {
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
    role: UserRoles.MARKETER,
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
  @desc   Add Tester
  @param  { firstName,lastName, email, phoneNumber }
  @method POST
  @route  /api/v1/admin/tester
  @access Private
  @role   Admin
*/
exports.createTesterHandler = asyncHandler(async (req, res, _) => {
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
    role: UserRoles.TESTER,
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
