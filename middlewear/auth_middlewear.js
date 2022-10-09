import jwt from 'jsonwebtoken';
import userModel from '../model/userModel.js';

const checkUserAuth = async (req, res, next) => {
  let token;

  const { authorization } = req.headers;

  if (authorization && authorization.startsWith('Bearer')) {
    try {
      // get token from header
      token = authorization.split(' ')[1];

      //   verfiy token
      const { userID } = jwt.verify(token, process.env.JWT_SECRET);

      // get user from token

      req.user = await userModel.findById(userID).select('-password');

      next();
    } catch (error) {
      console.log(error);

      res.status(401).json({
        success: false,
        message: 'unAuthorized User',
      });
    }
  }

  if (!token) {
    res
      .status(401)
      .send({ status: 'failed', message: 'Unauthorized User, No Token' });
  }
};

export default checkUserAuth;
