const Joi = require('joi');
const { JoiException, HttpException } = require('../../errors');
const { HttpStatus } = require('../../constants');

exports.validateGenerateToken = async (req, _, next) => {
  const schema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    client_id: Joi.string().required(),
    client_secret: Joi.string().required(),
  });

  const { error } = await JoiException(schema, req.body);
  if (error) {
    return next(new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY));
  }
  return next();
};
