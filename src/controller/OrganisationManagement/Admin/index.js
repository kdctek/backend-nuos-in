const {
  HttpStatus,
  UserRoles,
  AccountType,
  ErrorMessage,
} = require('../../../constants');
const { BadRequestException } = require('../../../errors');
const { asyncHandler } = require('../../../middleware');
const { User } = require('../../../models');
const { jwtService } = require('../../../services');
const { sendVerifyEmail } = require('../../../services/email.service');
const { logger } = require('../../../shared');

/**
  @desc   Add Admin To Organisation
  @param  { firstName,lastName, email, phoneNumber }
  @method POST
  @route  /api/v1/organisations/admin
  @access Private
  @role   Organisation Admin
*/
exports.addOrgAdmin = asyncHandler(async (req, res, _) => {
  const { organisation } = req.user;
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
    role: UserRoles.ORG_ADMIN,
    organisation: organisation.toString(),
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

exports.getOrgAdmins = asyncHandler(async (req, res, _) => {
  const { organisation } = req.user;
  const admins = await User.find({ organisation, role: 'admin' });

  if (!admins) {
    throw new BadRequestException('Admins not found!');
  }

  logger.info(
    `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'Organisation admins fetched successfully!' `,
  );
  return res.status(HttpStatus.CREATED).json({
    statusCode: HttpStatus.CREATED,
    message: 'Organisation admins fetched successfully!',
    result: admins,
  });
});

exports.updateOrgAdminDetails = asyncHandler(async (req, res, _) => {
  const { id } = req.params;
  const { firstName, lastName, email, phoneNumber } = req.body;
  const admin = await User.findOneAndUpdate(
    { _id: id },
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

  if (!admin) {
    throw new BadRequestException('Admin not found!');
  }

  logger.info(
    `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'Organisation admin updated successfully!' `,
  );
  return res.status(HttpStatus.CREATED).json({
    statusCode: HttpStatus.CREATED,
    message: 'Organisation admin updated successfully!',
    result: admin,
  });
});

exports.deleteOrgAdmins = asyncHandler(async (req, res, _) => {
  const { accountType, _id } = req.user;
  const { id } = req.params;
  if (accountType === AccountType.BUSINESS && _id.toString() !== id) {
    const deletedAdmin = await User.findOneAndDelete({ _id: id });
    if (!deletedAdmin) {
      throw new BadRequestException('Admins not found!');
    }

    logger.info(
      `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'Organisation admin deleted successfully!' `,
    );
    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      message: 'Organisation admin deleted successfully!',
      result: deletedAdmin,
    });
  }
  return res.status(HttpStatus.FORBIDDEN).json({
    statusCode: HttpStatus.FORBIDDEN,
    message: ErrorMessage.PERMISSION_DENIED,
  });
});
