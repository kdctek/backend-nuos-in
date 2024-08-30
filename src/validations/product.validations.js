const Joi = require('joi');
const { HttpStatus } = require('../constants');

const { HttpException, JoiException } = require('../errors');

exports.validateAddProduct = async (req, _, next) => {
  const schema = Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
    user: Joi.string().hex().length(24).required(),
  });

  const { error } = await JoiException(schema, req.body);
  if (error) {
    return next(new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY));
  }
  return next();
};

exports.validateUpdateProduct = async (req, _, next) => {
  const schema = Joi.object().keys({
    platform_id: Joi.number(),
    name: Joi.string(),
    slug: Joi.string(),
    description: Joi.string(),
    subscription_id: Joi.number(),
    groups: Joi.array().items(Joi.string()),
    settings: Joi.object({
      location: Joi.object(),
      known_application: Joi.object({ opt_in: Joi.boolean() }),
      quarantine: Joi.boolean(),
    }),
  });

  const { error } = await JoiException(schema, req.body);
  if (error) {
    return next(new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY));
  }
  return next();
};
