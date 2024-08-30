const axios = require('axios');
const { clientUrl } = require('../../../config');
const { HttpStatus } = require('../../../constants');
const { asyncHandler } = require('../../../middleware');
const { logger } = require('../../../shared');

exports.createCustomerWithAcessToken = asyncHandler(async (req, res, _) => {
  const { rootAccessToken } = req.query;
  const { productIdOrSlug } = req.params;
  const { email, password } = req.body;

  const result = await axios
    .post(
      `${clientUrl}/v1/products/${productIdOrSlug}/customers`,
      { email, password },
      {
        headers: {
          authorization: `Bearer ${rootAccessToken}`,
        },
      },
    )
    .then((response) => response)
    .catch((error) => error.response.data.error_description);

  if (result?.status === 200) {
    logger.info(
      `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'Customer created successfully!' `,
    );
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Customer created successfully!',
      data: result?.data,
    });
  }
  return res.status(HttpStatus.BAD_REQUEST).json({
    statusCode: HttpStatus.BAD_REQUEST,
    message: result,
  });
});

exports.createCustomerWithClientCredentials = asyncHandler(
  async (req, res, _) => {
    const { productIdOrSlug } = req.params;
    const { email, clientId, clientSecret } = req.body;
    const result = await axios
      .post(
        `${clientUrl}/v1/products/${productIdOrSlug}/customers`,
        { email },
        {
          auth: {
            username: clientId,
            password: clientSecret,
          },
        },
      )
      .then((response) => response)
      .catch((error) => error.response.data.error_description);

    if (result?.status === 200) {
      logger.info(
        `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'Customer created successfully!' `,
      );
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Customer created successfully!',
        data: result?.data,
      });
    }
    return res.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      message: result,
    });
  },
);

exports.listCustomerForProduct = asyncHandler(async (req, res, _) => {
  const { rootAccessToken } = req.query;
  const { productIdOrSlug } = req.params;
  const result = await axios
    .get(`${clientUrl}/v1/products/${productIdOrSlug}/customers`, {
      headers: {
        authorization: `Bearer ${rootAccessToken}`,
      },
    })
    .then((response) => response)
    .catch((error) => error?.response?.data?.error_description);

  if (result?.status === 200) {
    logger.info(
      `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'Customers fetched successfully!' `,
    );
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Customers fetched successfully!',
      data: result?.data,
    });
  }
  return res.status(HttpStatus.BAD_REQUEST).json({
    statusCode: HttpStatus.BAD_REQUEST,
    message: result,
  });
});

exports.generateCustomerScopeToken = asyncHandler(async (req, res, _) => {
  const { grant_type, expires_in, expires_at, scope, clientId, clientSecret } =
    req.body;

  const params = new URLSearchParams();
  if (grant_type) {
    params.append('grant_type', grant_type);
  }
  if (expires_in) {
    params.append('expires_in', expires_in);
  }
  if (expires_at) {
    params.append('expires_at', expires_at);
  }
  if (scope) {
    params.append('scope', scope);
  }

  const result = await axios
    .post(`${clientUrl}/oauth/token`, params, {
      auth: {
        username: clientId,
        password: clientSecret,
      },
    })
    .then((response) => response)
    .catch((error) => error.response.data.error_description);

  if (result?.status === 200) {
    logger.info(
      `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'Token generated successfully!' `,
    );
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Token generated successfully!',
      data: result?.data,
    });
  }
  return res.status(HttpStatus.BAD_REQUEST).json({
    statusCode: HttpStatus.BAD_REQUEST,
    message: result,
  });
});

exports.updateCustomerPassword = asyncHandler(async (req, res, _) => {
  const { particle_token } = req.query;
  const { productIdOrSlug } = req.params;
  const { email, newPassword } = req.body;
  const result = await axios
    .put(
      `${clientUrl}/v1/products/${productIdOrSlug}/customers/${email}`,
      {
        newPassword,
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
      `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'Customer updated successfully!'`,
    );
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Customer updated successfully!',
      data: result?.data,
    });
  }
  return res.status(HttpStatus.BAD_REQUEST).json({
    statusCode: HttpStatus.BAD_REQUEST,
    message: result,
  });
});

exports.deleteCustomer = asyncHandler(async (req, res, _) => {
  const { particle_token } = req.query;
  const { productIdOrSlug } = req.params;
  const { email } = req.body;
  const result = await axios
    .delete(`${clientUrl}/v1/products/${productIdOrSlug}/customers/${email}`, {
      headers: {
        authorization: `Bearer ${particle_token}`,
      },
    })
    .then((response) => response)
    .catch((error) => error.response.data.error_description);

  if (result?.status === 200) {
    logger.info(
      `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'Customer deleted successfully!'`,
    );
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Customer deleted successfully!',
      data: result?.data,
    });
  }
  return res.status(HttpStatus.BAD_REQUEST).json({
    statusCode: HttpStatus.BAD_REQUEST,
    message: result,
  });
});
