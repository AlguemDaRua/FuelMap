import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { stationService } from '../../services/stationService';
import { abastecimentoService } from '../../services/abastecimentoService';
import { normalizeStation } from '../../utils/normalizers';
import './Abastecimento.css';

function Abastecimento() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [bomba, setBomba] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [erro, setErro] = useState('');

  const [form, setForm] = useState({
    tipo: '',
    data: new Date().toISOString().split('T')[0],
    hora: new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
    quantidade: '',
    observacoes: ''
  });

  useEffect(() => {
    const fetchBomba = async () => {
      try {
        const stations = await stationService.getAll();
        if (stations.length > 0) {
          setBomba(normalizeStation(stations[0]));
        }
      } catch (err) {
        setErro('Erro ao carregar dados da bomba.');
      } finally {
        setLoading(false);
      }
    };
    fetchBomba();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErro('');
  };

  const getStockApos = () => {
    if (!form.tipo || !form.quantidade || !bomba) return null;
    const combustivel = bomba.combustiveis.find(c => c.tipo === form.tipo);
    const actual = combustivel ? combustivel.quantidade : 0;
    return actual + parseInt(form.quantidade || 0, 10);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!bomba) return;

    setSubmitting(true);
    setErro('');

    try {
      await abastecimentoService.create({
        station_id: bomba.id,
        fuel_type: form.tipo,
        quantity: form.quantidade,
        refuel_date: form.data,
        refuel_time: form.hora + ':00', // API espera HH:MM:SS
        observations: form.observacoes
      });

      alert('Abastecimento registado com sucesso!');
      navigate('/gestao');
    } catch (err) {
      const msg = err?.response?.data?.error || 'Erro ao registar abastecimento.';
      setErro(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="abastecimento-page"><p>A carregar...</p></div>;
  if (!bomba) return <div className="abastecimento-page"><p>Sem bomba associada.</p></div>;

  const combustivelSelecionado = bomba.combustiveis.find(c => c.tipo === form.tipo);
  const stockActual = combustivelSelecionado ? combustivelSelecionado.quantidade : 0;

  return (
    <div className="abastecimento-page">
      <div className="abastecimento-card">
        <div className="abastecimento-header">
          <div>
            <h2>Novo abastecimento</h2>
            <p className="abastecimento-sub">{bomba.nome}</p>
          </div>
          <Link to="/gestao" className="abastecimento-back">← Voltar</Link>
        </div>

        {erro && <div className="abastecimento-erro" style={{ color: 'red', marginBottom: '15px' }}>{erro}</div>}

        <form onSubmit={handleSubmit}>
          <div className="abastecimento-field">
            <label>Tipo de combustível</label>
            <select name="tipo" onChange={handleChange} value={form.tipo} required>
              <option value="">Seleccionar</option>
              {bomba.combustiveis.map(c => (
                <option key={c.tipo} value={c.tipo}>{c.tipo}</option>
              ))}
            </select>
          </div>

          <div className="abastecimento-row">
            <div className="abastecimento-field">
              <label>Data</label>
              <input
                type="date"
                name="data"
                value={form.data}
                onChange={handleChange}
                required
              />
            </div>
            <div className="abastecimento-field">
              <label>Hora</label>
              <input
                type="time"
                name="hora"
                value={form.hora}
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
              value={form.quantidade}
              onChange={handleChange}
              min="1"
              required
            />
          </div>

          <div className="abastecimento-field">
            <label>Operador responsável</label>
            <input
              type="text"
              value={user?.name || 'Gestor'}
              disabled
              className="input-disabled"
            />
          </div>

          <div className="abastecimento-field">
            <label>Observações (opcional)</label>
            <textarea
              name="observacoes"
              placeholder="Notas adicionais..."
              value={form.observacoes}
              onChange={handleChange}
              rows={3}
            />
          </div>

          {form.tipo && (
            <div className="abastecimento-preview">
              <div className="preview-row">
                <span>Stock actual ({form.tipo})</span>
                <span>{stockActual.toLocaleString()} L</span>
              </div>
              <div className="preview-row">
                <span>Após abastecimento</span>
                <span className="preview-after">{getStockApos()?.toLocaleString()} L</span>
              </div>
            </div>
          )}

          <button type="submit" className="abastecimento-btn" disabled={submitting}>
            {submitting ? 'A registar...' : 'Confirmar abastecimento'}
          </button>
          <Link to="/gestao" className="abastecimento-cancel">Cancelar</Link>
        </form>
      </div>
    </div>
  );
}

export default Abastecimento;