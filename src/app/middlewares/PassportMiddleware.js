const jwt = require('jsonwebtoken');
// const _ = require('lodash');
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
var GooglePlusTokenStrategy = require('passport-google-plus-token');
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
            clientID:
                '511465107728-7haa5fofh6toq4dlhlo9gmhe08tc6fut.apps.googleusercontent.com',
            clientSecret: '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',
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
                console.log(err, false);
            }
        },
    ),
);
