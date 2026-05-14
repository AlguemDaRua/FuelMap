import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { stationService } from '../../services/stationService';
import { fuelService } from '../../services/fuelService';
import './Register.css';

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nomeBomba: '',
    provedor: '',
    provincia: '',
    cidade: '',
    bairro: '',
    combustiveis: [],
    email: '',
    password: ''
  });
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErro('');
  };

  const handleCombustivel = (tipo) => {
    const lista = form.combustiveis.includes(tipo)
      ? form.combustiveis.filter(c => c !== tipo)
      : [...form.combustiveis, tipo];
    setForm({ ...form, combustiveis: lista });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.combustiveis.length === 0) {
      setErro('Seleccione pelo menos um tipo de combustível.');
      return;
    }

    setLoading(true);
    setErro('');
    
    try {
      // 1. Registar o gestor (User)
      await register({
        name: 'Gestor ' + form.nomeBomba, // Nome genérico para o gestor
        email: form.email,
        password: form.password,
        role: 'gestor'
      });

      // 2. Criar a Bomba (Station) - O token já está no localStorage pelo authService
      const newStation = await stationService.create({
        name: form.nomeBomba,
        address: form.bairro + ', ' + form.cidade,
        city: form.cidade,
        district: form.bairro,
        provider: form.provedor,
        latitude: -25.9625, // Mock coords
        longitude: 32.5832
      });

      // 3. Adicionar Combustíveis (Fuels) selecionados à bomba
      for (const tipo of form.combustiveis) {
        await fuelService.addFuel({
          station_id: newStation.id,
          type: tipo,
          price: 0,
          stock_liters: 0,
          max_capacity: 15000
        });
      }

      // Redirecionar para a gestão
      navigate('/gestao');

    } catch (err) {
      const msg = err?.response?.data?.error || 'Erro ao registar bomba. Verifique os dados.';
      setErro(msg);
    } finally {
      setLoading(false);
    }
  };

  const combustiveisLista = ['Gasolina', 'Gasóleo', 'GPL', 'Jet A1'];

  return (
    <div className="register-page">
      <div className="register-card">
        <div className="register-logo">
          <span className="register-dot"></span>
          <span className="register-title">FuelMap</span>
        </div>
        <h2>Registar bomba</h2>
        <p className="register-sub">Preencha os dados do seu posto de combustível</p>

        {erro && <div className="register-erro">{erro}</div>}

        <form onSubmit={handleSubmit}>
          <div className="register-field">
            <label>Nome da bomba / posto</label>
            <input
              type="text"
              name="nomeBomba"
              placeholder="Ex: Petromoc Av. Julius Nyerere"
              onChange={handleChange}
              value={form.nomeBomba}
              required
            />
          </div>

          <div className="register-field">
            <label>Fornecedora / provedor</label>
            <select name="provedor" onChange={handleChange} value={form.provedor} required>
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
              <select name="provincia" onChange={handleChange} value={form.provincia} required>
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
                value={form.cidade}
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
              value={form.bairro}
              required
            />
          </div>

          <div className="register-field">
            <label>Tipos de combustível disponíveis</label>
            <div className="register-chips">
              {combustiveisLista.map(tipo => (
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
              value={form.email}
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
              value={form.password}
              required
              minLength={6}
            />
          </div>

          <button type="submit" className="register-btn" disabled={loading}>
            {loading ? 'A registar...' : 'Submeter registo'}
          </button>
        </form>

        <div className="register-links">
          <p>Já tem conta? <Link to="/login">Entrar</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Register;