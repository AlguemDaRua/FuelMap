import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErro('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro('');
    try {
      await login(form.email, form.password);
      navigate('/gestao');
    } catch (err) {
      const msg = err?.response?.data?.error || 'Erro ao autenticar. Tente novamente.';
      setErro(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <span className="login-dot"></span>
          <span className="login-title">FuelMap</span>
        </div>
        <h2>Entrar na plataforma</h2>
        <p className="login-sub">Acesso exclusivo para gestores de bombas</p>

        {erro && <div className="login-erro">{erro}</div>}

        <form onSubmit={handleSubmit}>
          <div className="login-field">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="gestor@bomba.co.mz"
              onChange={handleChange}
              value={form.email}
              required
            />
          </div>
          <div className="login-field">
            <label>Palavra-passe</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              onChange={handleChange}
              value={form.password}
              required
            />
          </div>
          <div className="login-forgot">
            <a href="#forgot">Esqueci a palavra-passe</a>
          </div>
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'A entrar...' : 'Entrar'}
          </button>
        </form>

        <div className="login-links">
          <p>Não tem conta? <Link to="/register">Registar bomba</Link></p>
          <Link to="/" className="login-back">← Voltar ao dashboard público</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;