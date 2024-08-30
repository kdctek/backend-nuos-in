/* eslint-disable func-names */
const { Schema, model } = require('mongoose');

const deviceSchema = new Schema(
  {
    users: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product ID is required'],
    },
    organisationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organisation',
      required: [true, 'Organisation ID is required'],
    },
    deviceId: {
      type: String,
      trim: true,
      unique: true,
      required: [true, 'Device ID is required'],
    },
    name: {
      type: String,
      trim: true,
    },
    last_ip_address: {
      type: String,
      trim: true,
    },
    last_heard: {
      type: Date,
    },
    last_handshake_at: {
      type: Date,
    },
    online: {
      type: Boolean,
      default: false,
    },
    platform_id: {
      type: Number,
    },
    cellular: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
      trim: true,
    },
    functions: {
      type: [String],
    },
    variables: {
      type: [Schema.Types.ObjectId],
      ref: 'Variable',
    },

    status: {
      type: String,
      enum: ['online', 'offline'],
      default: 'offline',
    },
    serial_number: {
      type: String,
      trim: true,
    },
    mac_wifi: {
      type: String,
      trim: true,
    },
    system_firmware_version: {
      type: String,
      trim: true,
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

module.exports = model('Device', deviceSchema);
