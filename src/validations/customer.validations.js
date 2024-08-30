const Joi = require('joi');
const { HttpStatus } = require('../constants');

const { HttpException, JoiException } = require('../errors');

exports.validateSignupCustomer = async (req, _, next) => {
  const schema = Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(30),
    phoneNumber: Joi.string().required(),
    organisationId: Joi.string(),
  });

  const { error } = await JoiException(schema, req.body);
  if (error) {
    return next(new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY));
  }
  return next();
};
