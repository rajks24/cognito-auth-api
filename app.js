import express, { json } from 'express';
import { config } from 'dotenv';
import authRoutes from './routes/auth.js';

config();
const app = express();
app.use(json());
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Auth API running on port ${PORT}`));
