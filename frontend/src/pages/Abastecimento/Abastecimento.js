import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Abastecimento.css';

function Abastecimento() {
  const [form, setForm] = useState({
    tipo: '',
    data: '',
    hora: '',
    quantidade: '',
    observacoes: ''
  });

  const stockActual = {
    Gasolina: 8400,
    Gasóleo: 12100,
    GPL: 800,
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const getStockApos = () => {
    if (!form.tipo || !form.quantidade) return null;
    const actual = stockActual[form.tipo] || 0;
    return actual + parseInt(form.quantidade || 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Abastecimento:', form);
    alert('Abastecimento registado com sucesso!');
  };

  return (
    <div className="abastecimento-page">
      <div className="abastecimento-card">
        <div className="abastecimento-header">
          <div>
            <h2>Novo abastecimento</h2>
            <p className="abastecimento-sub">Petromoc — Av. Julius Nyerere</p>
          </div>
          <Link to="/gestao" className="abastecimento-back">← Voltar</Link>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="abastecimento-field">
            <label>Tipo de combustível</label>
            <select name="tipo" onChange={handleChange} required>
              <option value="">Seleccionar</option>
              <option value="Gasolina">Gasolina</option>
              <option value="Gasóleo">Gasóleo</option>
              <option value="GPL">GPL</option>
              <option value="Jet A1">Jet A1</option>
            </select>
          </div>

          <div className="abastecimento-row">
            <div className="abastecimento-field">
              <label>Data</label>
              <input
                type="date"
                name="data"
                onChange={handleChange}
                required
              />
            </div>
            <div className="abastecimento-field">
              <label>Hora</label>
              <input
                type="time"
                name="hora"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="abastecimento-field">
            <label>Quantidade abastecida (litros)</label>
            <input
              type="number"
              name="quantidade"
              placeholder="Ex: 15000"
              onChange={handleChange}
              required
            />
          </div>

          <div className="abastecimento-field">
            <label>Operador responsável</label>
            <input
              type="text"
              value="João Macuácua"
              disabled
              className="input-disabled"
            />
          </div>

          <div className="abastecimento-field">
            <label>Observações (opcional)</label>
            <textarea
              name="observacoes"
              placeholder="Notas adicionais..."
              onChange={handleChange}
              rows={3}
            />
          </div>

          {getStockApos() && (
            <div className="abastecimento-preview">
              <div className="preview-row">
                <span>Stock actual ({form.tipo})</span>
                <span>{stockActual[form.tipo]?.toLocaleString()} L</span>
              </div>
              <div className="preview-row">
                <span>Após abastecimento</span>
                <span className="preview-after">{getStockApos().toLocaleString()} L</span>
              </div>
            </div>
          )}

          <button type="submit" className="abastecimento-btn">
            Confirmar abastecimento
          </button>
          <Link to="/gestao" className="abastecimento-cancel">Cancelar</Link>
        </form>
      </div>
    </div>
  );
}

export default Abastecimento;