import app from './app';
import connectDB from './db/database';
import dotenv from 'dotenv';
dotenv.config();

const PORT: number = parseInt(process.env.PORT || '3000', 10);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
});