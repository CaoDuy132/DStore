const passport = require('passport');
const JwtStrategy =  require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const {ExtractJwt} = require('passport-jwt');
const {JWT_SECRET} =require('../../config/db/config');
const User = require('../models/User');
passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('Authorization'),
    secretOrKey: JWT_SECRET
},async (payload,done)=>{
    try{
        console.log("payload", payload);
        const user = await User.findById(payload.sub);
        if(!user) return done(null,false);
    }catch(err){
        done(err,false)
    }
}))
passport.use(new LocalStrategy({
    email: 'email'
},async (email,password,done)=>{
    const user = await User.findOne({email});
    console.log(user)
    if(!user) return done(null,false);
    const isMatch = await user.isValidLogin(password);
    if(isMatch) return done(null,false);
}))
