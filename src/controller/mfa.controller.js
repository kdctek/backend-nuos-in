const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const { asyncHandler } = require('../middleware');
const { HttpStatus } = require('../constants');

const userObject = {};

exports.setupMfaHandler = (_req, res) => {
  const secret = speakeasy.generateSecret({
    length: 10,
    name: 'Nuos Home Automation',
  });
  const url = speakeasy.otpauthURL({
    secret: secret.base32,
    label: 'Nuos Home Automation',
    encoding: 'base32',
  });
  QRCode.toDataURL(url, (err, dataURL) => {
    userObject.tfa = {
      secret: '',
      tempSecret: secret.base32,
      dataURL,
      tfaURL: url,
    };
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'TFA Auth needs to be verified',
      tempSecret: secret.base32,
      dataURL,
      secret: secret.base32,
      tfaURL: secret.otpauth_url,
    });
  });
};

exports.verifyCodeHandler = asyncHandler(async (req, res, _) => {
  const { code } = req.body;
  const isVerified = speakeasy.totp.verify({
    secret: userObject.tfa.tempSecret,
    encoding: 'base32',
    token: code,
  });

  if (isVerified) {
    userObject.tfa.secret = userObject.tfa.tempSecret;
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Two-factor Auth is enabled successfully',
    });
  }

  return res.status(HttpStatus.FORBIDDEN).send({
    statusCode: 403,
    message:
      'Invalid Auth Code, verification failed. Please verify the system Date and Time',
  });
});
