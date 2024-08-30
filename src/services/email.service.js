const nodemailer = require('nodemailer');

const {
  appUrl,
  isProduction,
  googleService: { userName, appPasskey },
} = require('../config');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: userName,
    pass: appPasskey,
  },
});

const sendVerifyEmail = async ({
  firstName,
  lastName,
  email,
  verificationToken,
}) => {
  const mailOptions = {
    from: userName,
    to: email,
    subject: 'Nuos Home Automation - Accept Invitation',
    html: `<p><b>Dear</b> ${firstName} ${lastName},</p>
    <p>Nuos Home Automation has invited you to join their organisation.
    Please click <a href=${
      isProduction ? appUrl : 'http://localhost:8000/api/v1'
    }/auth/${verificationToken}>here</a> to accept this invitation.
    </p>
    <b>Best Regards,</b>
    <p>Nuos Home Automation</p>
 </span>`,
  };

  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log({ error });
      throw error;
    }
    console.log(`Email sent: ${info.response}`);
    return info;
  });
};

const sendAccountCreationEmail = async ({
  firstName,
  lastName,
  email,
  password,
}) => {
  const mailOptions = {
    from: userName,
    to: email,
    subject: 'Nuos Home Automation - Account Creation',
    html: `<p><b>Dear</b> ${firstName} ${lastName},</p>
    <p>Your account has been created successfully, please find below password for your account.</p>
    <p><b>Password</b> : ${password}</p>
    <b>Best Regards,</b>
    <p>Nuos Home Automation</p>
 </span>`,
  };

  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log({ error });
      return error;
    }
    console.log(`Email sent: ${info.response}`);
    return info;
  });
};

const sendResetPasswordEmail = async ({ user, otp }) => {
  const mailOptions = {
    from: userName,
    to: user.email,
    subject: 'Nuos Home Automation - Reset Password',
    html: `<p><b>Dear</b> ${user.firstName} ${user.lastName},</p>
    <p>We have received a request to reset the password for your Nuos Account.</p>
    <p>You can reset your password by verifying this OTP: ${otp}.</p>
    <b>Best Regards,</b>
    <p>Nuos Home Automation</p>
 </span>`,
  };

  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return error;
    }
    console.log(`Email sent: ${info.response}`);
    return info;
  });
};

const validateLoginEmail = async ({ email, otp }) => {
  const mailOptions = {
    from: userName,
    to: email,
    subject: 'Verfication Code - Nuos Home Automation',
    html: `
    <p>Please use the verification code below to sign in.</p>
    <b>${otp}</b>
    <p><b>Note:</b>This OTP is only valid for 10 minutes.</p>
    <b>Best Regards,</b>
    <p>Nuos Home Automation</p>

 </span>`,
  };

  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return error;
    }
    console.log(`Email sent: ${info.response}`);
    return info;
  });
};

module.exports = {
  sendAccountCreationEmail,
  sendVerifyEmail,
  sendResetPasswordEmail,
  validateLoginEmail,
};
