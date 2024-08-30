const smartThingsRouter = require('express').Router();

const {
  Routes: { SMART_THINGS },
} = require('../constants');
const {
  smartThingsController: { connector },
} = require('../controller');

smartThingsRouter.post(SMART_THINGS.DEFAULT, async (req, res) => {
  await connector.handleHttpCallback(req, res);
});
module.exports = { smartThingsRouter };
