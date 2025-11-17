const { Router } = require('express')
const userRouter = Router();
const userController = require('../controllers/userController')

userRouter.get('/register', userController.getRegisterForm);
userRouter.post('/register', userController.registerUser);
userRouter.get('/login', userController.getLoginForm);
userRouter.post('/login', userController.loginUser);
userRouter.get('/loginSuccess', userController.getLoginSuccess);
userRouter.get('/loginFail', userController.getLoginFail);

module.exports = userRouter;