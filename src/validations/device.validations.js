const Joi = require('joi');
const { HttpStatus } = require('../constants');

const { HttpException, JoiException } = require('../errors');

exports.validateAddDevice = async (req, _, next) => {
  const schema = Joi.object().keys({
    users: Joi.string().hex().length(24),
    productId: Joi.string().hex().length(24).required(),
    deviceId: Joi.string().required(),
    name: Joi.string(),
    last_ip_address: Joi.string(),
    last_heard: Joi.date().iso(),
    last_handshake_at: Joi.date().iso(),
    online: Joi.boolean(),
    platform_id: Joi.number(),
    cellular: Joi.boolean(),
    notes: Joi.string(),
    functions: Joi.array().items(Joi.string()),
    variables: Joi.object({
      power: Joi.string(),
    }),
    status: Joi.string().valid(
      ...Object.values({
        online: 'online',
        offline: 'offline',
      }),
    ),
    serial_number: Joi.string(),
    mac_wifi: Joi.string(),
    system_firmware_version: Joi.string(),
  });

  const { error } = await JoiException(schema, req.body);
  if (error) {
    return next(new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY));
  }
  return next();
};

exports.validateUpdateDevice = async (req, _, next) => {
  const schema = Joi.object().keys({
    name: Joi.string(),
    platform_id: Joi.number(),
    last_ip_address: Joi.string(),
    last_heard: Joi.date().iso(),
    last_handshake_at: Joi.date().iso(),
    online: Joi.boolean(),
    cellular: Joi.boolean(),
    notes: Joi.string(),
    functions: Joi.array().items(Joi.string()),
    variables: Joi.object({
      power: Joi.string(),
    }),
    status: Joi.string().valid(
      ...Object.values({
        online: 'online',
        offline: 'offline',
      }),
    ),
    serial_number: Joi.string(),
    mac_wifi: Joi.string(),
    system_firmware_version: Joi.string(),
  });

  const { error } = await JoiException(schema, req.body);
  if (error) {
    return next(new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY));
  }
  return next();
};
