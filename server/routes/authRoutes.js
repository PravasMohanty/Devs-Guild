const express = require('express');
const authRouter = express.Router();
const { Login, Register } = require('../controllers/authController');

authRouter.post('/login', Login);
authRouter.post('/register', Register);

module.exports = authRouter;
