const gatewayRouter = require('express').Router();

const {
  Routes: { PARTICLE },
} = require('../constants');
const {
  gatewayController: { getGatewayDetails, getDeviceDetails },
} = require('../controller');
const { verifyToken } = require('../middleware');

gatewayRouter.get(PARTICLE.GET_GATEWAYS, verifyToken, getGatewayDetails);
gatewayRouter.get(PARTICLE.GET_DEVICES, verifyToken, getDeviceDetails);
module.exports = { gatewayRouter };
