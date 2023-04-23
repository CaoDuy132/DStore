const jwt = require('jsonwebtoken');
// const _ = require('lodash');
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
var GooglePlusTokenStrategy = require('passport-google-plus-token');
const FacebookTokenStrategy = require('passport-facebook-token');
const {
    GOOGLE_APP_ID,
    FACEBOOK_APP_ID,
    FACEBOOK_CLIENT_SECRET,
    GOOGLE_CLIENT_SECRET,
} = process.env;
const { ExtractJwt } = require('passport-jwt');
const { ACCESS_SECRET_TOKEN } = process.env;
var User = require('../models/User');
passport.use(
    new JwtStrategy(
        {
            jwtFromRequest:
                ExtractJwt.fromAuthHeaderAsBearerToken('Authorization'),
            secretOrKey: ACCESS_SECRET_TOKEN,
        },
        async (payload, done) => {
            try {
                const user = await User.findOne({ _id: payload.id });
                if (!user) return done(null, false);
                return done(null, user);
            } catch (error) {
                return done(error, false);
            }
        },
    ),
);
//passport google
passport.use(
    new GooglePlusTokenStrategy(
        {
            clientID: GOOGLE_APP_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            passReqToCallback: true,
        },
        async (req, accessToken, refreshToken, profile, next) => {
            try {
                const userGoogle = await User.findOne({
                    googleID: profile.id,
                    authType: 'google',
                });
                if (userGoogle) return next(null, userGoogle);
                let user = new User({
                    googleId: profile.id,
                    fullName: profile.name.givenName,
                    email: profile.emails[0].value,
                    image: profile.photos[0].value,
                    authType: 'google',
                });
                await user.save();
                next(null, user);
            } catch (err) {
                next(err, false);
            }
        },
    ),
);
//passport facebook
passport.use(
    new FacebookTokenStrategy(
        {
            clientID: FACEBOOK_APP_ID,
            clientSecret: FACEBOOK_CLIENT_SECRET,
            fbGraphVersion: 'v3.0',
        },
        async (accessToken, refreshToken, profile, next) => {
            try {
                const userGoogle = await User.findOne({
                    faceBookID: profile.id,
                    authType: 'facebook',
                });
                if (userGoogle) return next(null, userGoogle);
                let user = new User({
                    faceBookId: profile.id,
                    fullName: profile.displayName,
                    email: profile.emails[0].value,
                    image: profile.photos[0].value,
                    authType: 'facebook',
                });
                await user.save();
                next(null, user);
            } catch (err) {
                next(err, false);
            }
        },
    ),
);
