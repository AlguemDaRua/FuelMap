import React, { useState, useEffect } from 'react';
import FilterBar from '../../components/FilterBar/FilterBar';
import StationCard from '../../components/StationCard/StationCard';
import { stationService } from '../../services/stationService';
import { normalizeStation } from '../../utils/normalizers';
import './Dashboard.css';

function Dashboard() {
  const [bombas, setBombas] = useState([]);
  const [todasBombas, setTodasBombas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const fetchBombas = async () => {
      try {
        const data = await stationService.getAll();
        const normalizadas = data.map(normalizeStation);
        setTodasBombas(normalizadas);
        setBombas(normalizadas);
      } catch (err) {
        setErro('Erro ao carregar os postos de combustível. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };
    fetchBombas();
  }, []);

  const handleFiltrar = (filtros) => {
    let resultado = [...todasBombas];

    if (filtros.provedor) {
      resultado = resultado.filter(b => b.provedor.toLowerCase() === filtros.provedor.toLowerCase());
    }
    if (filtros.combustivel) {
      resultado = resultado.filter(b => b.combustiveis.some(c => c.tipo.toLowerCase().includes(filtros.combustivel.toLowerCase())));
    }
    if (filtros.cidade) {
      resultado = resultado.filter(b => b.cidade.toLowerCase().includes(filtros.cidade.toLowerCase()));
    }
    if (filtros.pesquisa) {
      resultado = resultado.filter(b =>
        b.nome.toLowerCase().includes(filtros.pesquisa.toLowerCase())
      );
    }

    setBombas(resultado);
  };

  return (
    <div className="dashboard">
      <FilterBar onFiltrar={handleFiltrar} />
      <div className="dashboard-content">
        <div className="dashboard-lista">
          <div className="dashboard-header">
            <span>{bombas.length} bombas encontradas</span>
            <span className="dashboard-update">Actualizado agora</span>
          </div>

          {loading ? (
            <p className="dashboard-loading">A carregar postos de combustível...</p>
          ) : erro ? (
            <p className="dashboard-empty">{erro}</p>
          ) : bombas.length === 0 ? (
            <p className="dashboard-empty">Nenhuma bomba encontrada com estes filtros.</p>
          ) : (
            bombas.map(bomba => (
              <StationCard key={bomba.id} bomba={bomba} />
            ))
          )}
        </div>
        <div className="dashboard-mapa">
          <p>🗺️ Mapa interactivo</p>
          <span>A integração com o Google Maps será feita na próxima fase.</span>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;