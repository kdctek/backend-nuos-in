/* eslint-disable func-names */
const { Schema, model } = require('mongoose');

const oauthClientSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name of oauth client is Required'],
      trim: true,
      lowercase: true,
    },
    clientId: {
      type: String,
      required: [true, 'Client ID is Required'],
    },
    clientSecret: {
      type: String,
      required: [true, 'Client Secret is Required'],
      select: false,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = model('OauthClient', oauthClientSchema);
