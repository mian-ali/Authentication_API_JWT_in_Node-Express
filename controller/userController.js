import userModel from '../model/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class userController {
  static userRegister = async (req, res) => {
    const { name, email, password, tc, password_comfirm } = req.body;

    const user = await userModel.findOne({ email: email });
    if (user) {
      res.status(400).json({ sucess: false, message: 'user already exist' });
    } else {
      if ((name, email, password, tc, password_comfirm)) {
        if (password === password_comfirm) {
          try {
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);
            const newUser = new userModel({
              name: name,
              email: email,
              password: hashPassword,
              tc: tc,
            });

            await newUser.save();
            const saved_user = await userModel.findOne({ email: email });

            //Generate JWT Token
            const token = jwt.sign(
              { userID: saved_user._id },
              process.env.JWT_SECRET,
              { expiresIn: '1d' }
            );
            res.status(200).json({
              sucess: true,
              message: 'user created successfully',
              token: token,
            });
          } catch (error) {
            res.status(500).json({ sucess: false, message: error.message });
          }
        } else {
          res
            .status(400)
            .json({ sucess: false, message: 'password not match' });
        }
      } else {
        res
          .status(400)
          .json({ sucess: false, message: 'please fill all the fields' });
      }
    }
  };

  static userLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (email && password) {
        const user = await userModel.findOne({ email: email });

        if (user != null) {
          const isMatch = await bcrypt.compare(password, user.password);

          if (user.email === email && isMatch) {
            const token = jwt.sign(
              { userID: user._id },
              process.env.JWT_SECRET,
              { expiresIn: '1d' }
            );
            res.status(200).json({
              sucess: true,
              message: 'login sucessfull',
              token: token,
            });
          } else {
            res.status(400).json({
              sucess: false,
              message: ' Email and Password not valid',
            });
          }
        } else {
          res.status(400).json({ sucess: false, message: 'user not found' });
        }
      } else {
        res
          .status(400)
          .json({ sucess: false, message: 'please fill all the fields' });
      }
    } catch (error) {
      res.json({ sucess: false, message: error.message });
    }
  };
}

export default userController;
