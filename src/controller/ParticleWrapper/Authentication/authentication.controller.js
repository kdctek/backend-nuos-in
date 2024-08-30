const axios = require('axios');
const { clientUrl } = require('../../../config');
const { HttpStatus } = require('../../../constants');
const { asyncHandler } = require('../../../middleware');
const { logger } = require('../../../shared');

exports.generatePArticleAccessToken = asyncHandler(async (req, res, _) => {
  const { email, password, client_id, client_secret } = req.body;
  const params = new URLSearchParams();
  params.append('grant_type', 'password');
  params.append('username', email);
  params.append('password', password);
  params.append('client_id', client_id);
  params.append('client_secret', client_secret);

  const result = await axios
    .post(`${clientUrl}/oauth/token`, params)
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

exports.getCurrentAccessToken = asyncHandler(async (req, res, _) => {
  const { particle_token } = req.query;
  const result = await axios
    .get(`${clientUrl}/v1/access_tokens/current`, {
      headers: {
        authorization: `Bearer ${particle_token}`,
      },
    })
    .then((response) => response)
    .catch((error) => error.response.data.error_description);

  if (result?.status === 200) {
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
