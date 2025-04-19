import express, { json } from 'express';
import { config } from 'dotenv';
import authRoutes from './routes/auth.js';

config();
const app = express();

// In app.js
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

app.use(json());
app.use('/auth', authRoutes);

// Only start server if not running in Lambda
if (process.env.NODE_ENV !== 'lambda') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`API listening on port ${PORT}`));
  }
  
export default app;
