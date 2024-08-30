const axios = require('axios');
const { clientUrl } = require('../../../config');
const { HttpStatus } = require('../../../constants');
const { asyncHandler } = require('../../../middleware');
const { logger } = require('../../../shared');

exports.getParticleUser = asyncHandler(async (req, res, _) => {
  const { particle_token } = req.query;
  const result = await axios
    .get(`${clientUrl}/v1/user`, {
      headers: {
        authorization: `Bearer ${particle_token}`,
      },
    })
    .then((response) => response)
    .catch((error) => error.response.data.error_description);

  if (result?.status === 200) {
    logger.info(
      `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'User details fetched successfully!' `,
    );
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'USer details fetched successfully!',
      data: result?.data,
    });
  }
  return res.status(HttpStatus.BAD_REQUEST).json({
    statusCode: HttpStatus.BAD_REQUEST,
    message: result,
  });
});

exports.updateParticleUSer = asyncHandler(async (req, res, _) => {
  const { username, password, account_info, current_password } = req.body;

  const { particle_token } = req.query;

  const result = await axios
    .patch(
      `${clientUrl}/v1/user`,
      {
        username,
        password,
        account_info,
        current_password,
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

exports.deleteParticleUser = asyncHandler(async (req, res, _) => {
  const { password } = req.body;
  const { particle_token } = req.query;

  const result = await axios
    .delete(
      `${clientUrl}/v1/user`,
      { password },
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

exports.forgotParticlePassword = asyncHandler(async (req, res, _) => {
  const { username } = req.body;
  const { particle_token } = req.query;

  const result = await axios
    .post(
      `${clientUrl}/v1/user/password-reset`,
      {
        username,
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
      `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'Reset password email sent successfully!' `,
    );
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Reset password email sent successfully!',
      data: result?.data,
    });
  }
  return res.status(HttpStatus.BAD_REQUEST).json({
    statusCode: HttpStatus.BAD_REQUEST,
    message: result,
  });
});
