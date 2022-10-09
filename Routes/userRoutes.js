import express from 'express';
import userController from '../controller/userController.js';
import checkUserAuth from '../middlewear/auth_middlewear.js';
const router = express.Router();

//Router Leveal Middlewear

router.use('/changepassword', checkUserAuth);

//public routes
router.post('/register', userController.userRegister);
router.post('/login', userController.userLogin);

//private routes
router.post('/changepassword', userController.chanagePassword);
export default router;
