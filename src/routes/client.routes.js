const clientRouter = require('express').Router();

const {
  Routes: { OAUTH },
  UserRoles: { ADMIN },
} = require('../constants');
const {
  clientController: {
    createClientHandler,
    getAllClientHandler,
    getClientByIdHandler,
    updateClienttHandler,
    deleteClientHandler,
  },
} = require('../controller');
const { verifyToken, restrictTo } = require('../middleware');

clientRouter
  .route(OAUTH.CLIENT)
  // .post(verifyToken, restrictTo(ADMIN), createClientHandler)
  .post(verifyToken, createClientHandler)
  .get(verifyToken, restrictTo(ADMIN), getAllClientHandler);
clientRouter
  .route(OAUTH.DETAILS)
  .get(verifyToken, restrictTo(ADMIN), getClientByIdHandler)
  .patch(verifyToken, restrictTo(ADMIN), updateClienttHandler)
  .delete(verifyToken, restrictTo(ADMIN), deleteClientHandler);

module.exports = { clientRouter };
