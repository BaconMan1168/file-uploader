const { PrismaClient } = require('@prisma/client');
const { validationResult, matchedData } = require("express-validator")
const { validateRegister, validateLogin } = require('../validator')
const passport = require('passport')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

function getRegisterForm(req, res){
    res.render('registerForm')
}

const registerUser = [
    validateRegister,
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            next(err);
        }

        const user = matchedData(req);
        
        try {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            user.password = hashedPassword;
            await prisma.User.create({
                data: user
            });
        }
        catch (err){
            next(err);
        }
        res.redirect('/users/login')
    }
]

const loginUser = [
    validateLogin,
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            next(err);
        }
        next();
    },
    passport.authenticate('local', { failureRedirect: '/users/login-failure', successRedirect: '/users/login-success' })
]

function getLoginSuccess(req, res){
    res.render('loginSuccess');
}

function getLoginFail(req, res){
    res.render('loginFailure')
}

module.exports = {
    getRegisterForm,
    registerUser,
    loginUser,
    getLoginFail,
    getLoginSuccess
}