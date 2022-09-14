const passport = require('passport');
const res = require('express/lib/response');
const passportLocal = require('passport-local');
const {User} =  require('../models/Model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {mongooseToObject} = require('../../util/mongoose')
const {ACCESS_SECRET_TOKEN} = process.env||'secretkey';
let LocalStrategy = passportLocal.Strategy;
let initPassportLocal = () => {
  passport.use(new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true
  },async(req, email, password, done)=> {
    try {
      let user = await User.findOne({email});
      if (!user) {
        return done(null, false);
      }
      let checkPassword = await bcrypt.compare(password, user.password);
      if (!checkPassword) {
        return done(null, false);
      }
      const userId = mongooseToObject(user);
      const id = userId._id
      const token= jwt.sign({id},ACCESS_SECRET_TOKEN,{
        expiresIn: '1d'
      })
      return done(null, token);
    } catch (error) {
      console.log(error);
      return done(null, false,);
    }
  }));
};

passport.serializeUser(function(token, done) {
  return done(null, token);
});
passport.deserializeUser(function(token, done) {
//  console.log('deserializeUser::: ', token)
  return done(null, token);
});

module.exports = initPassportLocal;