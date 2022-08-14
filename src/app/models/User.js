const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = new Schema(
    {
        fullname: { type: String },
        fullname: { type: String },
        phone: { type: Number },
        email: { type: String, unique: true, lowercase: true },
        role: { type: String },
        password: { type: String, required: true },
        verificationToken: { String },
        isVerified: { type: Boolean, default: false },
        tokens:[{
            token: {type: String,required: true}
        }]
    },
    {
        timestamps: true,
    },
);
User.pre('save', async function(next){
    try{
        //Generate a salt
        const salt = await bcrypt.genSalt(10);
        //Generate a password hash (salt + hash)
        this.password = await bcrypt.hash(this.password, salt);
    }catch(err){
        next(err);
    }
})
User.methods.isValidLogin = function(passwordNew){
    try{
        return bcrypt.compare(passwordNew, this.password)
    }catch(err){
        console.log('Có lỗi:' + err);
    }
}

module.exports = mongoose.model('User', User);
