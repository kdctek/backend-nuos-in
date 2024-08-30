const axios = require('axios');
const { asyncHandler } = require('../middleware');
const { HttpStatus } = require('../constants');
const { clientUrl } = require('../config');

/**
  @desc   Get Gateway List
  @param  accessToken
  @method GET
  @route  /api/v1/particle/gateway/accessToken
  @access Private
*/

exports.getGatewayDetails = asyncHandler(async (req, res, _) => {
  const { accessToken } = req.params;
  if (accessToken) {
    const result = await axios
      .get(`${clientUrl}/v1/devices`, {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => response.data)
      .catch((error) => {
        console.error(error);
        return res.status(HttpStatus.BAD_REQUEST).json({
          statusCode: HttpStatus.BAD_REQUEST,
          data: 'Something went wrong',
        });
      });
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: result,
    });
  }
  return res.status(HttpStatus.BAD_REQUEST).json({
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Invalid access token',
  });
});

/**
  @desc   Get Device List
  @param  gatewayId
  @method GET
  @route  /api/v1/particle/gateway/devices/:gatewayId
  @access Private
*/

exports.getDeviceDetails = asyncHandler(async (req, res, _) => {
  const { gatewayId } = req.params;
  const apiKey = req.headers['x-api-key'];
  if (!apiKey) {
    return res.status(HttpStatus.FAILED_DEPENDENCY).json({
      statusCode: HttpStatus.FAILED_DEPENDENCY,
      message: 'API key is required!',
    });
  }
  if (gatewayId) {
    const result = await axios
      .get(
        `https://8a346zakk7.execute-api.ap-southeast-1.amazonaws.com/prod/NUOSAPPDeviceAndSceneNamesDB/${gatewayId}`,
        {
          headers: {
            'x-api-key': apiKey,
          },
        },
      )
      .then((response) => response.data)
      .catch((error) => {
        console.error(error);
      });
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: result,
    });
  }
  return res.status(HttpStatus.BAD_REQUEST).json({
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Invalid gateway id',
  });
});
