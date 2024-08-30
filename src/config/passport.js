const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const { User } = require('../models');
const { googleService, facebookService } = require('.');

module.exports = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: googleService.clientId,
        clientSecret: googleService.clientSecret,
        callbackURL: 'https://backend.nuos.in/api/v1/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log({ accessToken, refreshToken });
        const newUser = {
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          photo: profile.photos[0].value,
          email: profile.emails[0].value,
        };
        try {
          // find the user in our database
          let user = await User.findOne({ email: newUser.email });

          if (user) {
            // If user present in our database.
            done(null, user);
          } else {
            // if user is not preset in our database save user data to database.
            user = await User.create(newUser);
            done(null, user);
          }
        } catch (err) {
          console.error(err);
        }
      },
    ),
  );

  passport.use(
    new FacebookStrategy(
      {
        clientID: facebookService.clientId,
        clientSecret: facebookService.clientSecret,
        callbackURL: 'https://backend.nuos.in/api/v1/auth/facebook/callback',
        profileFields: [
          'id',
          'email',
          'gender',
          'link',
          'locale',
          'name',
          'timezone',
          'updated_time',
          'verified',
        ],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // find the user in our database

          if (profile) {
            // If user present in our database.
            done(null, profile);
          } else {
            // if user is not preset in our database save user data to database.
            done(null, profile);
          }
        } catch (err) {
          console.error(err);
        }
      },
    ),
  );

  // used to serialize the user for the session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user));
  });
};
