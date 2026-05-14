import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login:', form);
    // futuramente ligamos ao backend aqui
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

        <form onSubmit={handleSubmit}>
          <div className="login-field">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="gestor@bomba.co.mz"
              onChange={handleChange}
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
              required
            />
          </div>
          <div className="login-forgot">
            <a href="#">Esqueci a palavra-passe</a>
          </div>
          <button type="submit" className="login-btn">Entrar</button>
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