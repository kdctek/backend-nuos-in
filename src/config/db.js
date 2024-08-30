const { connect, set } = require('mongoose');

const {
  db: { mongoUri },
} = require('.');

set('strictQuery', false);
const database = {
  authenticate: () => connect(mongoUri),
};

module.exports = { database };
