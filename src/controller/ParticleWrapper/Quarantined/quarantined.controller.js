const axios = require('axios');
const { clientUrl } = require('../../../config');
const { HttpStatus } = require('../../../constants');
const { asyncHandler } = require('../../../middleware');
const { logger } = require('../../../shared');

exports.approveDevice = asyncHandler(async (req, res, _) => {
  const { productIdOrSlug, deviceId } = req.params;
  const { particle_token } = req.query;
  const { id } = req.body;
  const result = await axios
    .post(
      `${clientUrl}/v1/products/${productIdOrSlug}/devices/${deviceId}/ping`,
      { id },
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
      `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'Device approved successfully!' `,
    );
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Device approved successfully!',
      data: result?.data,
    });
  }
  return res.status(HttpStatus.BAD_REQUEST).json({
    statusCode: HttpStatus.BAD_REQUEST,
    message: result,
  });
});

exports.denyDeviceApproval = asyncHandler(async (req, res, _) => {
  const { productIdOrSlug, deviceId } = req.params;
  const { particle_token } = req.query;
  const result = await axios
    .delete(`${clientUrl}/v1/products/${productIdOrSlug}/devices/${deviceId}`, {
      data: { deny: true },
      headers: {
        authorization: `Bearer ${particle_token}`,
      },
    })
    .then((response) => response)
    .catch((error) => error.response.data.error_description);

  if (result?.status === 200) {
    logger.info(
      `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'Device approved failed!'`,
    );
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Device approved failed!',
      data: result?.data,
    });
  }
  return res.status(HttpStatus.BAD_REQUEST).json({
    statusCode: HttpStatus.BAD_REQUEST,
    message: result,
  });
});
