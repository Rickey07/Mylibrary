const User = require('../models/user');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');


module.exports = function (passport) {
    passport.use(new LocalStrategy(
        {usernameField:'email'} ,
    async (email , password , done) => {
        try {
            const user = await User.findOne({email:email});
            if(!user) return done(null , false , {message: 'No Account found asscociated with this email'}) 
            if(await bcrypt.compare(password , user.password)) {
                return done(null , user)
            } else {
                return done(null , false , {message: 'Incorrect Password'});
            }
        } catch (e) {
            return done(e)
        }
    }
    ))
    passport.serializeUser((user , done) => { done(null,user.id) })
    passport.deserializeUser((id , done) => {
        User.findById(id , (err , user) => {
            done(err , user)
        })
    })
}


