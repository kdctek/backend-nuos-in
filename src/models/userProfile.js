/* eslint-disable func-names */
const { Schema, model } = require('mongoose');

const userProfileSchema = new Schema(
  {
    users: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
      unique: true,
    },

    devices: {
      type: [Schema.Types.ObjectId],
      ref: 'Device',
      uique: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = model('UserProfile', userProfileSchema);
