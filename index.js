import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';

const app = express();
dotenv.config();

app.use(express.json());

app.use('/api/users', userRoutes);

const DATABASE_URL = process.env.DATABASE_URL;
connectDB(DATABASE_URL);
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
