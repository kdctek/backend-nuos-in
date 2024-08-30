const axios = require('axios');
const speakeasy = require('speakeasy');
const {
  googleService,
  isProduction,
  appUrl,
  twilio,
  clientUrl,
} = require('../config');
// eslint-disable-next-line import/order
const client = require('twilio')(twilio.accountSid, twilio.authToken, {
  lazyLoading: true,
});

const { User, Organisation } = require('../models');
const { HttpStatus, HttpMessage, AccountType } = require('../constants');

const { asyncHandler } = require('../middleware');
const {
  HttpException,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} = require('../errors');
const { logger } = require('../shared');
const { bcryptService, jwtService } = require('../services');
const {
  sendAccountCreationEmail,
  sendResetPasswordEmail,
  validateLoginEmail,
} = require('../services/email.service');

/**
  @desc   Signup user
  @param  { firstName,lastName, email, password }
  @method POST
  @route  /api/v1/auth/signup
  @access Public
*/
exports.signupHandler = asyncHandler(async (req, res, _) => {
  const { firstName, lastName, email, phoneNumber, password, accountType } =
    req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw new BadRequestException('Email is already taken');
  }
  if (accountType === AccountType.BUSINESS) {
    const { companyName } = req.body;
    if (!companyName) {
      throw new BadRequestException('Company name is required!');
    }
    const isOrganisation = await Organisation.findOne({ name: companyName });
    const organisation = await Organisation.create({
      name: companyName,
      created_by: email,
    });
    if (!isOrganisation) {
      await User.create({
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
        accountType,
        organisation: organisation._id,
      });
    }
    await User.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      accountType,
      organisation: isOrganisation._id,
    });
  } else {
    await User.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      accountType,
    });
  }

  logger.info(
    `${HttpStatus.CREATED} - ${req.originalUrl} [${req.method}] - 'Signup successfully!' `,
  );
  return res
    .status(HttpStatus.CREATED)
    .json({ statusCode: HttpStatus.CREATED, message: 'Signup Successfully!' });
});

/**
  @desc   Login user
  @param  { email, password }
  @method POST
  @route  /api/v1/auth/login
  @access Public
*/
exports.loginHandler = asyncHandler(async (req, res, _) => {
  const { email, password } = req.body;
  // Check for user
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new UnauthorizedException('Invalid credentials');
  }

  // Check current password
  if (!(await user.matchPassword(password))) {
    throw new UnauthorizedException('Invalid credentials');
  }

  // Create token
  const accessToken = user?.organisation
    ? jwtService.signToken(user._id, user?.organisation)
    : jwtService.signToken(user._id);

  res.setHeader('token', accessToken);
  res.cookie('token', accessToken, jwtService.getCookieOptions(req));

  return res.status(HttpStatus.OK).json({
    statusCode: HttpStatus.OK,
    message: 'Login successfully!',
    accessToken,
    data: {
      role: user?.role,
      organisation: user?.organisation,
    },
  });
});
/**
  @desc   Login user when linking Alexa
  @param  { email, password }
  @method POST
  @route  /api/v1/auth/iot/login
  @access Public
*/
exports.alexaLoginHandler = asyncHandler(async (req, res, _) => {
  const { email, password } = req.body;

  const params = new URLSearchParams();
  params.append('grant_type', 'password');
  params.append('username', email);
  params.append('password', password);
  params.append('client_id', 'nuos-mobile-apps-7666');
  params.append('client_secret', 'f109ef9dea152edcccc8af54fff9c1ea51a5ee44');

  const result = await axios
    .post(`${clientUrl}/oauth/token`, params)
    .then((response) => response?.data)
    .catch((error) => {
      console.error(error);
    });

  // Create token
  const accessToken = jwtService.signToken(email);

  res.setHeader('token', accessToken);
  res.cookie('token', accessToken, jwtService.getCookieOptions(req));

  return res.status(HttpStatus.OK).json({
    statusCode: HttpStatus.OK,
    message: 'Login successfully!',
    accessToken,
    particleAccessToken: result?.access_token,
    particleRefreshToken: result?.refresh_token,
  });
});

/**
  @desc   Get current logged in user
  @param  GET
  @method POST
  @route  /api/v1/auth/me
  @access Private
*/
exports.getMeHandler = asyncHandler(async (req, res, _) => {
  // user is already available in req due to the protect middleware
  const { user } = req;

  // remove sensitive information
  user.createdAt = undefined;
  user.__v = undefined;

  return res.status(HttpStatus.OK).json({
    statusCode: HttpStatus.OK,
    message: 'User details fetched successfully!',
    data: user,
  });
});

/**
  @desc   Verify Email Invitation
  @param  GET
  @method GET
  @route  /api/v1/auth/:token
  @access Public
*/
exports.checkEmailInvitaion = asyncHandler(async (req, res, next) => {
  // user is already available in req due to the protect middleware
  const { token } = req.params;
  const decoded = await jwtService.verifyToken(token);
  if (!decoded) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .send(
        '<p style="text-align:center;font-size:24px;margin-top:20px">Something went wrong! Please try again later.</p>',
      );
  }
  const { firstName, lastName, email, phoneNumber, role, organisation } =
    decoded;
  const user = await User.findOne({ email });

  if (user) {
    return res
      .status(HttpStatus.OK)
      .send(
        '<h1 style="text-align:center;font-size:24px;margin-top:20px">Invitation already accepted </h1><p style="text-align:center">Please check your email for details.</p>',
      );
  }

  const password = `${firstName
    .replaceAll(' ', '')
    .toLowerCase()
    .slice(0, 4)}@1234`;

  const createdUser = await User.create({
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
    organisation,
    role,
  });
  createdUser.isVerified = true;
  createdUser.isActive = true;
  await createdUser.save();
  if (createdUser) {
    sendAccountCreationEmail({ firstName, lastName, email, password });
    return res
      .status(HttpStatus.OK)
      .send(
        '<h1 style="text-align:center;font-size:24px;margin-top:20px">Invitation accepted successfully</h1><p style="text-align:center">Please check your email for details.</p>',
      );
  }
  return next();
});

/**
  @desc   Forgot password
  @param  { email }
  @method POST
  @route  /api/v1/auth/forgotPassword
  @access Public
*/
exports.forgotPasswordHandler = asyncHandler(async (req, res, _) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new NotFoundException('There is no user with that email');
  }
  const otp = speakeasy.time({
    secret: googleService.clientSecret,
    encoding: 'base32',
    step: 600, // 10 mins
    window: 0,
  });
  await sendResetPasswordEmail({ user, otp });
  return res
    .status(HttpStatus.OK)
    .json({ statusCode: HttpMessage.OK, message: 'OTP sent successfully!' });
});

/**
  @desc   Reset password
  @param  {email,password}
  @body   password
  @method PUT
  @route  /api/v1/auth/resetPassword/:resetToken
  @access Public
*/
exports.resetPasswordHandler = asyncHandler(async (req, res, _) => {
  const { email, otp, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw new BadRequestException('User does not exists');
  }
  const isValid = speakeasy.time.verify({
    secret: googleService.clientSecret,
    encoding: 'base32',
    token: otp,
    step: 600, // 10 mins
    window: 0,
  });
  if (!isValid) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .json({ statusCode: HttpStatus.BAD_REQUEST, message: 'Invalid OTP!' });
  }

  // Set new password
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  return res.status(HttpStatus.OK).json({
    statusCode: HttpStatus.OK,
    message: 'Password Reset Successfully!',
  });
});

exports.logoutHandler = (_, res) => {
  res.cookie('token', 'loggedOut', {
    maxAge: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  return res
    .status(HttpStatus.OK)
    .json({ statusCode: HttpStatus.OK, message: 'Logout Successfully!' });
};

/**
  @desc   Change password
  @param  userId
  @body   {currentPassword,newPassword}
  @method PATCH
  @route  /api/v1/auth/change_password
  @access Public
*/

exports.changePasswordHandler = asyncHandler(async (req, res, _) => {
  const { currentPassword, newPassword } = req.body;
  const { id } = req.params;
  const user = await User.findOne({ _id: id }).select('+password');
  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    return res.status(HttpStatus.CONFLICT).json({
      statusCode: HttpStatus.CONFLICT,
      message: 'Please enter correct password',
    });
  }

  if (await user.matchPassword(newPassword)) {
    return res.status(HttpStatus.AMBIGUOUS).json({
      statusCode: HttpStatus.AMBIGUOUS,
      message: 'New password should not be same as existing password',
    });
  }
  user.password = newPassword;
  await user.save();
  return res.status(HttpStatus.CREATED).json({
    statusCode: HttpStatus.CREATED,
    message: 'Password changed successfully!',
  });
});

/**
  @desc   Authorisation url foe alexa
  @method get
  @route  /api/v1/auth/authorization
  @access Public
*/
exports.tokenHandler = asyncHandler(async (req, res, _) => {
  const { code } = req.body;
  res.status(HttpStatus.OK).json({
    token_type: 'bearer',
    access_token: code?.split(' ')[0],
    expires_in: 31536000,
    refresh_token: code?.split(' ')[1] || code?.split(' ')[0],
  });
});
/**
  @desc   Token handler url for google home
  @method post
  @route  /api/v1/auth/google_home/token
  @access Public
*/
// eslint-disable-next-line consistent-return
exports.googleHomeTokenHandler = asyncHandler(async (req, res, _) => {
  const { code, grant_type } = req.body;
  if (grant_type === 'authorization_code') {
    return res.status(HttpStatus.OK).json({
      token_type: 'Bearer',
      access_token: code,
      refresh_token: code,
      expires_in: 31536000,
    });
  }
});

/**
  @desc   Generate token for alexa
  @method post
  @route  /api/v1/auth/token
  @access Public
*/

exports.authorizationHandler = asyncHandler(async (req, res, _) => {
  const { state, client_id, redirect_uri } = req.query;
  // const isClient = await OAuthClient.findOne({ clientId: client_id });
  // if (!isClient) {
  //   return res.status(HttpStatus.CONFLICT).json({
  //     statusCode: HttpStatus.CONFLICT,
  //     message: 'Client id does not exist',
  //   });
  // }
  res.cookie('state', state);
  res.cookie('redirect_uri', redirect_uri);
  res.set(
    'Content-Security-Policy',
    "default-src *; style-src 'self' http://* 'unsafe-inline'; script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'",
  );
  return res.render('Login');
});

exports.sendEmailVerificationOTP = asyncHandler(async (req, res, _) => {
  const { email } = req.body;
  const otp = speakeasy.time({
    secret: googleService.clientSecret,
    encoding: 'base32',
    step: 600, // 10 mins
    window: 0,
  });
  validateLoginEmail({ email, otp });
  return res
    .status(HttpStatus.OK)
    .json({ statusCode: HttpMessage.OK, message: 'OTP sent successfully!' });
});

exports.verifyEmailOTP = asyncHandler(async (req, res, _) => {
  const { otp } = req.body;
  const isValid = speakeasy.time.verify({
    secret: googleService.clientSecret,
    encoding: 'base32',
    token: otp,
    step: 600, // 10 mins
    window: 0,
  });
  if (isValid) {
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'OTP verified successfully!',
    });
  }
  return res
    .status(HttpStatus.BAD_REQUEST)
    .json({ statusCode: HttpStatus.BAD_REQUEST, message: 'Invalid OTP!' });
});

exports.redirectGoogleSignIn = asyncHandler(async (req, res, _) => {
  const { state, redirect_uri } = req.cookies;
  const { id } = req.params;
  const accessToken = jwtService.signToken(id);
  return res.redirect(`${redirect_uri}?state=${state}&code=${accessToken}`);
});

exports.sendMobileOTP = asyncHandler(async (req, res, _) => {
  const { countryCode, phoneNumber } = req.body;
  try {
    await client.verify.v2.services(twilio.serviceSid).verifications.create({
      to: `+${countryCode}${phoneNumber}`,
      channel: 'sms',
    });
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'OTP sent successfully!',
    });
  } catch (error) {
    return res.status(error?.status || 400).json({
      statusCode: error?.status || 400,
      message: error?.message || 'Something went wrong',
    });
  }
});

exports.verifyMobileOTP = asyncHandler(async (req, res, _) => {
  const { countryCode, phoneNumber, otp } = req.body;
  try {
    const response = await client.verify.v2
      .services(twilio.serviceSid)
      .verificationChecks.create({
        to: `+${countryCode}${phoneNumber}`,
        code: otp,
      });
    if (response?.valid) {
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'OTP verified successfully!',
      });
    }

    return res.status(HttpStatus.CONFLICT).json({
      statusCode: HttpStatus.CONFLICT,
      message: 'Invalid OTP!',
    });
  } catch (error) {
    return res.status(error?.status || 400).json({
      statusCode: error?.status || 400,
      message: error?.message || 'Something went wrong',
    });
  }
});
