/* eslint-disable consistent-return */
const authRouter = require('express').Router();

const passport = require('passport');
const {
  Routes: { AUTH },
} = require('../constants');
const {
  authController: {
    signupHandler,
    loginHandler,
    getMeHandler,
    logoutHandler,
    forgotPasswordHandler,
    resetPasswordHandler,
    checkEmailInvitaion,
    authorizationHandler,
    changePasswordHandler,
    tokenHandler,
    sendEmailVerificationOTP,
    verifyEmailOTP,
    redirectGoogleSignIn,
    sendMobileOTP,
    verifyMobileOTP,
    alexaLoginHandler,
    googleHomeTokenHandler,
  },
} = require('../controller');
const { verifyToken } = require('../middleware');
const {
  auth: {
    validateLogin,
    validateSignup,
    validateForgotPassword,
    validateResetPassword,
    validateChangePassword,
    validateSendMobileOtp,
    validateVerifyMobileOtp,
  },
} = require('../validations');
const { jwtService } = require('../services');

authRouter.get(
  AUTH.GOOGLE_AUTH,
  passport.authenticate('google', { scope: ['profile', 'email'] }),
);
authRouter.get(AUTH.FACEBOOK_AUTH, passport.authenticate('facebook'));

authRouter.get(AUTH.GOOGLE_AUTH_CALLBACK, (req, res, next) =>
  passport.authenticate('google', async (err, user, info) => {
    if (err) return next(err);

    if (req.cookies.state) {
      return res.redirect(`/api/v1/auth/google/${user._id}`);
    }
    const accessToken = jwtService.signToken(user._id);
    return res.json({ message: 'Login Successfull!', accessToken });
  })(req, res, next),
);

authRouter.get(AUTH.FACEBOOK_AUTH_CALLBACK, (req, res, next) =>
  passport.authenticate('facebook', async (err, user, info) => {
    if (err) return next(err);

    if (req.cookies.state) {
      return res.redirect(`/api/v1/auth/facebook/${user.id}`);
    }
    const accessToken = jwtService.signToken(user._id);
    return res.json({ message: 'Login Successfull!', accessToken });
  })(req, res, next),
);

authRouter.post(AUTH.SIGNUP, validateSignup, signupHandler);
authRouter.post(AUTH.LOGIN, validateLogin, loginHandler);
authRouter.post(AUTH.IOT.LOGIN, validateLogin, alexaLoginHandler);
authRouter.get(AUTH.AUTHORIZATION, authorizationHandler);
authRouter.post(AUTH.GOOGLE_HOME, googleHomeTokenHandler);
authRouter.get(AUTH.VERIFY_EMAIL, checkEmailInvitaion);
authRouter.get(AUTH.ME, verifyToken, getMeHandler);
authRouter.post(AUTH.EXCHANGE_TOKEN, tokenHandler);
authRouter.post(
  AUTH.FORGOT_PASSWORD,
  validateForgotPassword,
  forgotPasswordHandler,
);
authRouter.put(
  AUTH.RESET_PASSWORD,
  validateResetPassword,
  resetPasswordHandler,
);
authRouter.patch(
  AUTH.CHANGE_PASSWORD,
  verifyToken,
  validateChangePassword,
  changePasswordHandler,
);
authRouter.post(AUTH.SEND_OTP, sendEmailVerificationOTP);
authRouter.post(AUTH.VERIFY_OTP, verifyEmailOTP);
authRouter.post(AUTH.SEND_MOBILE_OTP, validateSendMobileOtp, sendMobileOTP);
authRouter.post(
  AUTH.VERIFY_MOBILE_OTP,
  validateVerifyMobileOtp,
  verifyMobileOTP,
);
authRouter.get(AUTH.LOGOUT, logoutHandler);
authRouter.get(AUTH.ALEXA_GOOGLE_AUTH, redirectGoogleSignIn);

module.exports = { authRouter };
