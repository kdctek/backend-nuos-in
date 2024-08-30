const axios = require('axios');
const { clientUrl } = require('../../../config');
const { HttpStatus } = require('../../../constants');
const { asyncHandler } = require('../../../middleware');
const { logger } = require('../../../shared');

exports.addProductScopedApiUser = asyncHandler(async (req, res, _) => {
  const { particle_token } = req.query;
  const { productIDorSlug } = req.params;
  const { friendly_name, scopes } = req.body;
  const result = await axios
    .post(
      `${clientUrl}/v1/products/${productIDorSlug}/team`,
      { friendly_name, scopes },
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
      `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'User added successfully!' `,
    );
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'User added successfully!',
      data: result?.data,
    });
  }
  return res.status(HttpStatus.BAD_REQUEST).json({
    statusCode: HttpStatus.BAD_REQUEST,
    message: result,
  });
});

exports.addOrganisationScopedApiUser = asyncHandler(async (req, res, _) => {
  const { particle_token } = req.query;
  const { orgIDorSlug } = req.params;
  const { friendly_name, scopes } = req.body;
  const result = await axios
    .post(
      `${clientUrl}/v1/orgs/${orgIDorSlug}/team`,
      { friendly_name, scopes },
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
      `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'User added successfully!' `,
    );
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'User added successfully!',
      data: result?.data,
    });
  }
  return res.status(HttpStatus.BAD_REQUEST).json({
    statusCode: HttpStatus.BAD_REQUEST,
    message: result,
  });
});

exports.updateProductScopedApiUser = asyncHandler(async (req, res, _) => {
  const { userID, particle_token } = req.query;
  const { productIDorSlug } = req.params;
  const { friendly_name, scopes } = req.body;
  const result = await axios
    .put(
      `${clientUrl}/v1/products/${productIDorSlug}/team/${userID}`,
      { friendly_name, scopes },
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
      `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'User updated successfully!' `,
    );
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'User updated successfully!',
      data: result?.data,
    });
  }
  return res.status(HttpStatus.BAD_REQUEST).json({
    statusCode: HttpStatus.BAD_REQUEST,
    message: result,
  });
});

exports.updateOrganisationScopedApiUser = asyncHandler(async (req, res, _) => {
  const { userID, particle_token } = req.query;
  const { orgIDorSlug } = req.params;
  const { friendly_name, scopes } = req.body;
  const result = await axios
    .put(
      `${clientUrl}/v1/orgs/${orgIDorSlug}/team/${userID}`,
      { friendly_name, scopes },
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
      `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'User updated successfully!' `,
    );
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'User updated successfully!',
      data: result?.data,
    });
  }
  return res.status(HttpStatus.BAD_REQUEST).json({
    statusCode: HttpStatus.BAD_REQUEST,
    message: result,
  });
});

exports.deleteProductScopedApiUser = asyncHandler(async (req, res, _) => {
  const { userID, particle_token } = req.query;
  const { productIDorSlug } = req.params;
  const result = await axios
    .delete(`${clientUrl}/v1/products/${productIDorSlug}/team/${userID}`, {
      headers: {
        authorization: `Bearer ${particle_token}`,
      },
    })
    .then((response) => response)
    .catch((error) => error.response.data.error_description);

  if (result?.status === 200) {
    logger.info(
      `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'User deleted successfully!' `,
    );
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'User deleted successfully!',
      data: result?.data,
    });
  }
  return res.status(HttpStatus.BAD_REQUEST).json({
    statusCode: HttpStatus.BAD_REQUEST,
    message: result,
  });
});

exports.deleteOrganisationScopedApiUser = asyncHandler(async (req, res, _) => {
  const { userID, particle_token } = req.query;
  const { orgIDorSlug } = req.params;
  const result = await axios
    .delete(`${clientUrl}/v1/orgs/${orgIDorSlug}/team/${userID}`, {
      headers: {
        authorization: `Bearer ${particle_token}`,
      },
    })
    .then((response) => response)
    .catch((error) => error.response.data.error_description);

  if (result?.status === 200) {
    logger.info(
      `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'User deleted successfully!' `,
    );
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'User deleted successfully!',
      data: result?.data,
    });
  }
  return res.status(HttpStatus.BAD_REQUEST).json({
    statusCode: HttpStatus.BAD_REQUEST,
    message: result,
  });
});
