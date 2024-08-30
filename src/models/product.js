/* eslint-disable func-names */
const { Schema, model } = require('mongoose');

const productSchema = new Schema(
  {
    platform_id: {
      type: Number,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      required: [true, 'Product slug is required'],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    subscription_id: {
      type: Number,
      trim: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    groups: {
      type: [String],
    },
    settings: {
      location: {},
      known_application: { opt_in: Boolean },
      quarantine: {
        type: Boolean,
      },
    },
    organisation: {
      type: Schema.Types.ObjectId,
      ref: 'Organisation',
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

module.exports = model('Product', productSchema);
