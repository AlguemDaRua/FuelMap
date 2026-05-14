import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Register.css';

function Register() {
  const [form, setForm] = useState({
    nome: '',
    provedor: '',
    provincia: '',
    cidade: '',
    bairro: '',
    combustiveis: [],
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCombustivel = (tipo) => {
    const lista = form.combustiveis.includes(tipo)
      ? form.combustiveis.filter(c => c !== tipo)
      : [...form.combustiveis, tipo];
    setForm({ ...form, combustiveis: lista });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Registo:', form);
  };

  const combustiveis = ['Gasolina', 'Gasóleo', 'GPL', 'Jet A1'];

  return (
    <div className="register-page">
      <div className="register-card">
        <div className="register-logo">
          <span className="register-dot"></span>
          <span className="register-title">FuelMap</span>
        </div>
        <h2>Registar bomba</h2>
        <p className="register-sub">Preencha os dados do seu posto de combustível</p>

        <form onSubmit={handleSubmit}>
          <div className="register-field">
            <label>Nome da bomba / posto</label>
            <input
              type="text"
              name="nome"
              placeholder="Ex: Petromoc Av. Julius Nyerere"
              onChange={handleChange}
              required
            />
          </div>

          <div className="register-field">
            <label>Fornecedora / provedor</label>
            <select name="provedor" onChange={handleChange} required>
              <option value="">Seleccionar provedor</option>
              <option value="petromoc">Petromoc</option>
              <option value="galp">Galp</option>
              <option value="total">Total</option>
              <option value="enacosa">Enacosa</option>
            </select>
          </div>

          <div className="register-row">
            <div className="register-field">
              <label>Província</label>
              <select name="provincia" onChange={handleChange} required>
                <option value="">Seleccionar</option>
                <option value="maputo">Maputo</option>
                <option value="sofala">Sofala</option>
                <option value="nampula">Nampula</option>
              </select>
            </div>
            <div className="register-field">
              <label>Cidade</label>
              <input
                type="text"
                name="cidade"
                placeholder="Ex: Maputo Cidade"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="register-field">
            <label>Bairro / Avenida</label>
            <input
              type="text"
              name="bairro"
              placeholder="Ex: Sommerschield, Av. 24 de Julho"
              onChange={handleChange}
              required
            />
          </div>

          <div className="register-field">
            <label>Tipos de combustível disponíveis</label>
            <div className="register-chips">
              {combustiveis.map(tipo => (
                <div
                  key={tipo}
                  className={`register-chip ${form.combustiveis.includes(tipo) ? 'active' : ''}`}
                  onClick={() => handleCombustivel(tipo)}
                >
                  {tipo}
                </div>
              ))}
            </div>
          </div>

          <div className="register-field">
            <label>Email do gestor</label>
            <input
              type="email"
              name="email"
              placeholder="gestor@bomba.co.mz"
              onChange={handleChange}
              required
            />
          </div>

          <div className="register-field">
            <label>Palavra-passe</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="register-btn">Submeter registo</button>
        </form>

        <div className="register-links">
          <p>Já tem conta? <Link to="/login">Entrar</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Register;