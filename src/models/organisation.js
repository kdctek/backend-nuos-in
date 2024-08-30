/* eslint-disable func-names */
const { Schema, model } = require('mongoose');

const organisationSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
    },
    created_by: {
      type: String,
      trim: true,
      unique: true,
    },
  },
  { timestamps: true },
);

module.exports = model('Organisation', organisationSchema);
