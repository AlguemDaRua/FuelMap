const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const SALT_ROUNDS = 10;
const ALLOWED_ROLES = ['admin', 'gestor', 'usuario'];

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// =============================================
// US01 — REGISTO DE GESTOR
// POST /api/auth/register
// =============================================
const register = async (req, res) => {
  const { name, email, phone, password, role } = req.body;

  // Validação de campos obrigatórios
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      error: 'Campos obrigatórios em falta.',
      details: {
        name: !name ? 'O nome é obrigatório.' : undefined,
        email: !email ? 'O email é obrigatório.' : undefined,
        password: !password ? 'A palavra-passe é obrigatória.' : undefined
      }
    });
  }

  // Validação de formato de email
  if (!isValidEmail(email)) {
    return res.status(400).json({
      success: false,
      error: 'Formato de email inválido.'
    });
  }

  // Validação de tamanho de password
  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      error: 'A palavra-passe deve ter no mínimo 6 caracteres.'
    });
  }

  try {
    // Verificar se o email já existe
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'Este email já está registado.'
      });
    }

    // Hash da password com bcryptjs
    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    // Determinar role (default: usuario)
    const userRole = ALLOWED_ROLES.includes(role) ? role : 'usuario';

    // Criar utilizador
    const userId = await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone || null,
      password_hash,
      role: userRole
    });

    // Buscar o utilizador criado (sem password_hash)
    const newUser = await User.findById(userId);

    // Gerar token JWT
    const token = generateToken(newUser);

    return res.status(201).json({
      success: true,
      message: 'Gestor registado com sucesso.',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        created_at: newUser.created_at
      }
    });
  } catch (err) {
    console.error('❌ Erro no registo:', err.message);
    return res.status(500).json({
      success: false,
      error: 'Erro interno ao registar utilizador.',
      details: process.env.NODE_ENV !== 'production' ? err.message : undefined
    });
  }
};

// =============================================
// LOGIN
// POST /api/auth/login
// =============================================
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: 'Email e palavra-passe são obrigatórios.'
    });
  }

  try {
    const user = await User.findByEmail(email.trim().toLowerCase());
    if (!user) {
      return res.status(401).json({ success: false, error: 'Credenciais inválidas.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Credenciais inválidas.' });
    }

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: 'Login efectuado com sucesso.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (err) {
    console.error('❌ Erro no login:', err.message);
    return res.status(500).json({
      success: false,
      error: 'Erro interno ao autenticar.',
      details: process.env.NODE_ENV !== 'production' ? err.message : undefined
    });
  }
};

// =============================================
// PERFIL DO UTILIZADOR AUTENTICADO
// GET /api/auth/me
// =============================================
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'Utilizador não encontrado.' });
    }
    return res.status(200).json({ success: true, user });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Erro interno.',
      details: process.env.NODE_ENV !== 'production' ? err.message : undefined
    });
  }
};

module.exports = { register, login, getMe };
