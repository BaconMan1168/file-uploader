const { body } = require("express-validator");

const validateRegister = [
    body("username").trim()
        .isAlpha(),
    body("password").trim()
        .notEmpty(),
    body("confirm-password").custom((value, { req }) => {
        return value === req.body.password;
    })
]

const validateLogin = [
    body("username").trim()
        .isAlpha()
]

module.exports = {
    validateRegister,
    validateLogin
}