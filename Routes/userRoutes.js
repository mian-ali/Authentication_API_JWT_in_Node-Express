import express from 'express';
import userController from '../controller/userController.js';
import checkUserAuth from '../middlewear/auth_middlewear.js';
const router = express.Router();

//Router Leveal Middlewear

router.use('/changepassword', checkUserAuth);
router.use('/userprofile', checkUserAuth);

//public routes
router.post('/register', userController.userRegister);
router.post('/login', userController.userLogin);
router.post('/user-reset-password', userController.userRessetPaswordSendEmail);
router.post('/resetpassword/:id/:token', userController.ResetPassword);

//private routes
router.post('/changepassword', userController.chanagePassword);
router.get('/userprofile', userController.userProfile);

export default router;
