import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import cookiesParser from 'cookie-parser';
import cors from 'cors';

import geminiResponse from '../backend/gemini.js';

dotenv.config();

const app = express();
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true
}));


const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookiesParser());
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.listen(PORT, () => {
    connectDB();
  console.log(`Server running on port http://localhost:${PORT}`);
});

export default app;