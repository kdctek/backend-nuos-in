const crypto = require('crypto');
const { HttpStatus } = require('../constants');
const { BadRequestException, NotFoundException } = require('../errors');
const { asyncHandler } = require('../middleware');
const { OAuthClient } = require('../models');
const { queryService, jwtService, bcryptService } = require('../services');
const { logger, generateRandomNumber } = require('../shared');

/**
  @desc   Create client
  @method GET
  @route  /api/v1/oauth/client
  @access Private
  @role   Admin
*/

exports.createClientHandler = asyncHandler(async (req, res, _) => {
  const { name } = req.body;
  const client = await OAuthClient.findOne({ name });
  if (client) {
    throw new BadRequestException('Client already exists!');
  }

  const clientId = `${name.toLowerCase()}-${generateRandomNumber()}`;
  const secret = clientId;
  const clientSecret = crypto.createHmac('sha256', secret).digest('hex');
  const hashedSecret = await bcryptService.hashSecret(clientSecret);

  // Create client
  const data = await OAuthClient.create({
    name,
    clientId,
    clientSecret: hashedSecret,
  });
  data.clientSecret = clientSecret;
  logger.info(
    `${HttpStatus.CREATED} - ${req.originalUrl} [${req.method}] - 'Client created successfully!' `,
  );
  return res.status(HttpStatus.CREATED).json({
    statusCode: HttpStatus.CREATED,
    message: 'Client created Successfully!',
    data,
  });
});

/**
  @desc   Fetch clients
  @param  { page, limit }
  @method GET
  @route  /api/v1/oauth/client
  @access Private
  @role   Admin
*/
exports.getAllClientHandler = asyncHandler(async (req, res, _) => {
  const query = { ...req.query };
  query.page = +query.page || 1;
  query.limit = +query.limit || 10;
  query.sort = 'createdAt';
  query.fields = 'name,skillId,clientId,createdAt,updatedAt';
  const features = new queryService.APIFeatures(OAuthClient.find(), query || {})
    .filter()
    .sort()
    .paginate()
    .limitFields();
  const clients = await features.query;
  logger.info(
    `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'Fetch clients successfully!' `,
  );
  return res.status(HttpStatus.OK).json({
    statusCode: HttpStatus.OK,
    message: 'Fetch clients Successfully!',
    data: clients,
  });
});

/**
  @desc   Fetch clients by id
  @param  { id }
  @method GET
  @route  /api/v1/oauth/client/:id
  @access Private
  @role   Admin
*/
exports.getClientByIdHandler = asyncHandler(async (req, res, _) => {
  const { id } = req.params;
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Invalid client id',
    });
  }
  const client = await OAuthClient.findOne({ _id: req.params.id });
  if (!client) {
    throw new NotFoundException('Client not found!');
  }
  logger.info(
    `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'Fetch client successfully!' `,
  );
  return res.status(HttpStatus.OK).json({
    statusCode: HttpStatus.OK,
    message: 'Fetch client Successfully!',
    data: client,
  });
});

/**
  @desc   Update client by id
  @param  { id }
  @method PUT
  @route  /api/v1/oauth/client/:id
  @access Private
  @role   Admin
*/
exports.updateClienttHandler = asyncHandler(async (req, res, _) => {
  const { name } = req.body;
  const { id } = req.params;
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Invalid client id',
    });
  }
  const client = await OAuthClient.findOne({ _id: id });

  if (!client) {
    throw new NotFoundException('Client not found!');
  }

  const updatedDetails = await OAuthClient.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        name,
      },
    },
    { new: true },
  );

  logger.info(
    `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'Updated client successfully!' `,
  );
  return res.status(HttpStatus.OK).json({
    statusCode: HttpStatus.OK,
    message: 'Updated client Successfully!',
    data: updatedDetails,
  });
});

/**
  @desc   Delete client by id
  @param  { id }
  @method DELETE
  @route  /api/v1/oauth/client/:id
  @access Private
  @role   Admin
*/
exports.deleteClientHandler = asyncHandler(async (req, res, _) => {
  const client = await OAuthClient.findOne({ _id: req.params.id });

  if (!client) {
    throw new NotFoundException('Client not found!');
  }

  await OAuthClient.findOneAndDelete({ _id: req.params.id });

  logger.info(
    `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'Client deleted successfully!' `,
  );
  return res.status(HttpStatus.OK).json({
    statusCode: HttpStatus.OK,
    message: 'Client deleted Successfully!',
    data: client,
  });
});
