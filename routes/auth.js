import express from 'express';
import cognitoService from '../services/cognitoService.js';

const router = express.Router();

// ✅ POST /auth/register
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await cognitoService.registerUser(email, password);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ POST /auth/verify
router.post('/verify', async (req, res) => {
  const { email, code } = req.body;
  try {
    const result = await cognitoService.verifyUser(email, code);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ POST /auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await cognitoService.loginUser(email, password);
    res.status(200).json(result.AuthenticationResult);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ GET /auth/userinfo
router.get('/userinfo', async (req, res) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.split(' ')[1];
    const result = await cognitoService.getUserInfo(token);
    res.status(200).json(result);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

// ✅ POST /auth/logout
router.post('/logout', async (req, res) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.split(' ')[1];
    await cognitoService.logoutUser(token);
    res.status(200).json({ message: 'Successfully signed out' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
