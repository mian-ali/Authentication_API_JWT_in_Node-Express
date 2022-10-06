import mongoose from 'mongoose';

const connectDB = async (DATABASE_URL) => {
  try {
    await mongoose.connect(DATABASE_URL);
    console.log('MongoDB connected');
  } catch (error) {
    console.log(error.message);
  }
};

export default connectDB;
