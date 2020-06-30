const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const { check , validationResult } = require('express-validator');
const passport = require('passport');
const passportConfig = require('../config/passport-config')(passport);

router.get('/login' , (req , res) => {
    res.render('user/login')
})

router.get('/register' , ( req , res  ) => {
    res.render('user/register')
})

router.post('/register' ,  [ check('name' , 'Name should be at least 5 characters long').isLength({min:5}),
    check('email' , 'Email is required').isEmail() ,
    check('password' , 'Passowrd should be at least 6 characters long').isLength({min:6}) ] , async ( req ,res ) => {
    try {
        const result = validationResult(req);
        let errors = result.errors;
        for(var key in errors) {
            console.log(errors[key].value);
        }
        if(!result.isEmpty()) {
            res.render('user/register' , {
                errors: errors
            })
        } else {

            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            const user = await new User({
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword
            })
            await user.save()
             res.redirect('/user/login' );
        }

        
    } catch (err) {
        console.log(err);
        res.redirect('/')
    }
    
})

router.post('/login',passport.authenticate('local', {
    successRedirect:'/',
    failureRedirect:'/user/login',
    failureFlash: true
}))



module.exports = router