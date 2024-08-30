const axios = require('axios');
const { clientUrl } = require('../../../config');
const { HttpStatus } = require('../../../constants');
const { asyncHandler } = require('../../../middleware');
const { logger } = require('../../../shared');

exports.listClients = asyncHandler(async (req, res, _) => {
  const { rootAccessToken, productIdOrSlug } = req.query;
  const result = await axios
    .get(`${clientUrl}/v1/clients?productIdOrSlug=${productIdOrSlug}`, {
      headers: {
        authorization: `Bearer ${rootAccessToken}`,
      },
    })
    .then((response) => response)
    .catch((error) => error.response.data.error_description);

  if (result?.status === 200) {
    logger.info(
      `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'Clients fetched successfully!' `,
    );
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Clients fetched successfully!',
      data: result?.data,
    });
  }
  return res.status(HttpStatus.BAD_REQUEST).json({
    statusCode: HttpStatus.BAD_REQUEST,
    message: result,
  });
});

exports.createClient = asyncHandler(async (req, res, _) => {
  const { name, type, redirect_uri, scope, productIdOrSlug } = req.body;

  const { particle_token } = req.query;

  const result = await axios
    .post(
      `${clientUrl}/v1/clients`,
      {
        name,
        type,
        redirect_uri,
        scope,
        productIdOrSlug,
      },
      {
        headers: {
          authorization: `Bearer ${particle_token}`,
        },
      },
    )
    .then((response) => response)
    .catch((error) => error?.response?.data?.error_description);

  if (result?.status === 200) {
    logger.info(
      `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'Client created successfully!' `,
    );
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Client created successfully!',
      data: result?.data,
    });
  }
  return res.status(HttpStatus.BAD_REQUEST).json({
    statusCode: HttpStatus.BAD_REQUEST,
    message: result,
  });
});

exports.deleteClient = asyncHandler(async (req, res, _) => {
  const { particle_token } = req.query;
  const { clientId } = req.params;

  const result = await axios
    .delete(`${clientUrl}/v1/clients/${clientId}`, {
      headers: {
        authorization: `Bearer ${particle_token}`,
      },
    })
    .then((response) => response)
    .catch((error) => error.response.data.error_description);

  if (result?.status === 200) {
    logger.info(
      `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'Client deleted successfully!' `,
    );
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Client deleted successfully!',
      data: result?.data,
    });
  }
  return res.status(HttpStatus.BAD_REQUEST).json({
    statusCode: HttpStatus.BAD_REQUEST,
    message: result,
  });
});

exports.updateClient = asyncHandler(async (req, res, _) => {
  const { clientId } = req.params;
  const { particle_token } = req.query;
  const { productIdOrSlug } = req.body;
  const result = await axios
    .put(
      `${clientUrl}/v1/clients/${clientId}`,
      {
        productIdOrSlug,
      },
      {
        headers: {
          authorization: `Bearer ${particle_token}`,
        },
      },
    )
    .then((response) => response)
    .catch((error) => error.response.data.error_description);

  if (result?.status === 200) {
    logger.info(
      `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'Client updated successfully!'`,
    );
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Client updated successfully!',
      data: result?.data,
    });
  }
  return res.status(HttpStatus.BAD_REQUEST).json({
    statusCode: HttpStatus.BAD_REQUEST,
    message: result,
  });
});
