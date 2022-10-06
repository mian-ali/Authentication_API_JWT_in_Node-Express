import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  password: { type: String, required: true, trim: true },

  // terms and conditions
  tc: { type: Boolean, required: true, trim: true },
});

const userModel = mongoose.model('User_ath', userSchema);

export default userModel;
