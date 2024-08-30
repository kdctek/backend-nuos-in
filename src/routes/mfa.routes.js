const mfaRouter = require('express').Router();

const {
  Routes: { AUTH },
} = require('../constants');
const {
  mfaController: { setupMfaHandler, verifyCodeHandler },
} = require('../controller');

mfaRouter.post(AUTH.MFA.SETUP, setupMfaHandler);
mfaRouter.post(AUTH.MFA.VERIFY, verifyCodeHandler);

module.exports = { mfaRouter };
