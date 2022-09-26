const jwt = require('jsonwebtoken');
// const _ = require('lodash');
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
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
