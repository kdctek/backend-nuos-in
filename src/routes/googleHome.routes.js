const googleHomeRouter = require('express').Router();

const {
  Routes: { GOOGLE_HOME },
} = require('../constants');
const {
  googleHomeController: { smartHomeWebhook },
} = require('../controller');

googleHomeRouter.post(GOOGLE_HOME.WEBHOOK, smartHomeWebhook);
module.exports = { googleHomeRouter };
