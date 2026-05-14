const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Nome, email e palavra-passe são obrigatórios.' });
  }

  try {
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'Este email já está registado.' });
    }

    const password_hash = await bcrypt.hash(password, 12);
    const allowedRoles = ['admin', 'gestor', 'viewer'];
    const userRole = allowedRoles.includes(role) ? role : 'gestor';

    const userId = await User.create({ name, email, password_hash, role: userRole });
    const newUser = await User.findById(userId);

    const token = generateToken(newUser);

    return res.status(201).json({
      message: 'Utilizador registado com sucesso.',
      token,
      user: {
        id:    newUser.id,
        name:  newUser.name,
        email: newUser.email,
        role:  newUser.role
      }
    });
  } catch (err) {
    return res.status(500).json({ error: 'Erro interno ao registar utilizador.', details: err.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e palavra-passe são obrigatórios.' });
  }

  try {
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const token = generateToken(user);

    return res.status(200).json({
      message: 'Login efectuado com sucesso.',
      token,
      user: {
        id:    user.id,
        name:  user.name,
        email: user.email,
        role:  user.role
      }
    });
  } catch (err) {
    return res.status(500).json({ error: 'Erro interno ao autenticar.', details: err.message });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'Utilizador não encontrado.' });
    }
    return res.status(200).json({ user });
  } catch (err) {
    return res.status(500).json({ error: 'Erro interno.', details: err.message });
  }
};

module.exports = { register, login, getMe };
