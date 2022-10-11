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
      if (name && email && password && tc && password_comfirm) {
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

  static chanagePassword = async (req, res) => {
    const { password, password_comfirm } = req.body;

    if (password && password_comfirm) {
      if (password !== password_comfirm) {
        res.status(400).json({
          sucess: false,
          message: 'New password and comfirm password not match',
        });
      } else {
        const salt = await bcrypt.genSalt(10);
        const newHashPassword = await bcrypt.hash(password, salt);
        await userModel.findByIdAndUpdate(req.user._id, {
          password: newHashPassword,
        });
        // console.log(req.user);
        res.send({
          status: 'success',
          message: 'Password changed succesfully',
        });
      }
    } else {
      res
        .status(400)
        .json({ sucess: false, message: 'please fill all the fields' });
    }
  };

  static userProfile = async (req, res) => {
    res.status(200).json({
      sucess: true,
      userProfile: req.user,
    });
  };

  static userRessetPaswordSendEmail = async (req, res) => {
    const { email } = req.body;

    if (email) {
      const user = await userModel.findOne({ email: email });
      if (user) {
        const secret = user._id + process.env.JWT_SECRET;
        const token = jwt.sign({ userID: user._id }, secret, {
          expiresIn: '10m',
        });
        const link = `localhost:3000/api/user/resetpassword/${user._id}/${token}`;
        console.log(link);

        res.status(200).json({
          sucess: true,
          message: 'Email send successfully ...Please check your email',
        });
      } else {
        res.status(400).json({
          sucess: false,
          message: 'User Not Found ',
        });
      }
    } else {
      res
        .status(400)
        .json({ sucess: false, message: 'User Email is required' });
    }
  };

  static ResetPassword = async (req, res) => {
    const { password, password_comfirm } = req.body;
    const { id, token } = req.params;
    const user = await userModel.findById(id);
    const new_secret = user._id + process.env.JWT_SECRET;
    try {
      jwt.verify(token, new_secret);
      if (password && password_comfirm) {
        if (password !== password_comfirm) {
          res.status(400).json({
            sucess: false,
            message: 'New password and comfirm password not match',
          });
        } else {
          const salt = await bcrypt.genSalt(10);
          const newHashPassword = await bcrypt.hash(password, salt);
          await userModel.findByIdAndUpdate(user._id, {
            password: newHashPassword,
          });

          res.status(200).json({
            sucess: true,
            message: 'Password changed succesfully',
          });
        }
      } else {
        res
          .status(400)
          .json({ sucess: false, message: 'please fill all the fields' });
      }
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ sucess: false, message: 'invaild Token' });
    }
  };
}

export default userController;
