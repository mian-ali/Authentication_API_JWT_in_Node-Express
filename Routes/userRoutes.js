import express from 'express';
import userController from '../controller/userController.js';

const router = express.Router();

//public routes
router.post('/register', userController.userRegister);
router.post('/login', userController.userLogin);
export default router;
