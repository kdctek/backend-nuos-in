const Joi = require('joi');
const { HttpStatus } = require('../constants');

const { HttpException, JoiException } = require('../errors');

exports.validateSignup = async (req, _, next) => {
  const schema = Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    phoneNumber: Joi.string().required(),
    password: Joi.string().min(8).max(30),
    accountType: Joi.string().required(),
    companyName: Joi.string(),
  });

  const { error } = await JoiException(schema, req.body);
  if (error) {
    return next(new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY));
  }
  return next();
};

exports.validateLogin = async (req, _, next) => {
  const schema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().max(30),
  });

  const { error } = await JoiException(schema, req.body);
  if (error) {
    return next(new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY));
  }
  return next();
};

exports.validateForgotPassword = async (req, _, next) => {
  const schema = Joi.object().keys({
    email: Joi.string().email().required(),
  });

  const { error } = await JoiException(schema, req.body);
  if (error) {
    return next(new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY));
  }
  return next();
};

exports.validateResetPassword = async (req, _, next) => {
  const schema = Joi.object().keys({
    email: Joi.string().required(),
    otp: Joi.string().required(),
    password: Joi.string().min(8).max(30).required(),
  });

  const { error } = await JoiException(schema, req.body);
  if (error) {
    return next(new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY));
  }
  return next();
};
exports.validateChangePassword = async (req, _, next) => {
  const schema = Joi.object().keys({
    currentPassword: Joi.string().min(8).max(30),
    newPassword: Joi.string().min(8).max(30),
  });

  const { error } = await JoiException(schema, req.body);
  if (error) {
    return next(new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY));
  }
  return next();
};

exports.validateSendMobileOtp = async (req, _, next) => {
  const schema = Joi.object().keys({
    countryCode: Joi.string().required().messages({
      'string.base': '"Country code" should be a type of \'text\'',
      'string.empty': '"Country code" cannot be an empty field',
      'any.required': '"Country code" is a required field',
    }),
    phoneNumber: Joi.string().required().messages({
      'string.base': '"Phone number" should be a type of \'text\'',
      'string.empty': '"Phone number" cannot be an empty field',
      'any.required': '"Phone number" is a required field',
    }),
  });

  const { error } = await JoiException(schema, req.body);
  if (error) {
    return next(new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY));
  }
  return next();
};
exports.validateVerifyMobileOtp = async (req, _, next) => {
  const schema = Joi.object().keys({
    countryCode: Joi.string().required().messages({
      'string.base': '"Country code" should be a type of \'text\'',
      'string.empty': '"Country code" cannot be an empty field',
      'any.required': '"Country code" is a required field',
    }),
    phoneNumber: Joi.string().required().messages({
      'string.base': '"Phone number" should be a type of \'text\'',
      'string.empty': '"Phone number" cannot be an empty field',
      'any.required': '"Phone number" is a required field',
    }),
    otp: Joi.string().required().messages({
      'string.base': '"OTP" should be a type of \'text\'',
      'string.empty': '"OTP" cannot be an empty field',
      'any.required': '"OTP" is a required field',
    }),
  });

  const { error } = await JoiException(schema, req.body);
  if (error) {
    return next(new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY));
  }
  return next();
};
