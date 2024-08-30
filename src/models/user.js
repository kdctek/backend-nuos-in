/* eslint-disable func-names */
const { Schema, model } = require('mongoose');
const { AccountType, UserRoles } = require('../constants');

const { bcryptService } = require('../services');
const { toInteger } = require('../shared');

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First Name is Required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last Name is Required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is Required'],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      minlength: 8,
      select: false,
    },
    photo: {
      type: String,
      default: null,
    },
    phoneNumber: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      default: UserRoles.ORG_ADMIN,
    },
    accountType: {
      type: String,
      enum: [AccountType.BUSINESS, AccountType.PERSONAL],
      default: AccountType.PERSONAL,
    },
    organisation: {
      type: Schema.Types.ObjectId,
      ref: 'Organisation',
    },
    passwordChangedAt: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true },
);

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcryptService.hashPassword(this.password);
  return next();
});

// Compare password using bcrypt
userSchema.methods.matchPassword = async function (enteredPassword) {
  const isMatch = await bcryptService.comparePassword(
    enteredPassword,
    this.password,
  );
  return isMatch;
};

// Check password is changed or not.
userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  return next();
});

// If password changed throw error
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = toInteger(this.passwordChangedAt.getTime() / 1000);
    return JWTTimestamp < changedTimestamp;
  }
  // False means NOT changed
  return false;
};

// Generate and hash password token
userSchema.methods.getResetPasswordToken = function () {
  const { resetToken, resetPasswordExpire, resetPasswordToken } =
    bcryptService.getResetPasswordToken();

  this.resetPasswordToken = resetPasswordToken;
  this.resetPasswordExpire = resetPasswordExpire;
  return resetToken;
};

module.exports = model('User', userSchema);
