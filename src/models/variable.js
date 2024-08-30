/* eslint-disable func-names */
const { Schema, model } = require('mongoose');

const variableSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
    },
    value: { type: Number },
    info: {
      name: {
        type: String,
        trim: true,
      },
      deviceId: {
        type: String,
        trim: true,
        required: [true, 'Device ID is required'],
      },
      connected: {
        type: Boolean,
        default: false,
      },
      last_handshake_at: { type: Date },
    },
  },
  { timestamps: true },
);

module.exports = model('Variable', variableSchema);
