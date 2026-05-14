import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StockBar from '../../components/StockBar/StockBar';
import { stationService } from '../../services/stationService';
import { abastecimentoService } from '../../services/abastecimentoService';
import { useAuth } from '../../context/AuthContext';
import { normalizeStation, normalizeRecord } from '../../utils/normalizers';
import './Management.css';

function Management() {
  const { user } = useAuth();
  const [activePage, setActivePage] = useState('dashboard');
  const [bomba, setBomba] = useState(null);
  const [vendas, setVendas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obter todas as bombas e selecionar a primeira (para efeitos de demo)
        const stations = await stationService.getAll();
        if (stations.length > 0) {
          // No mundo real, a API devolveria a bomba associada ao utilizador logado
          const stationNormalizada = normalizeStation(stations[0]);
          setBomba({ ...stationNormalizada, gestor: user?.name || 'Gestor' });

          // Obter histórico de abastecimentos para esta bomba
          const records = await abastecimentoService.getByStation(stations[0].id);
          setVendas(records.map(normalizeRecord));
        }
      } catch (err) {
        console.error('Erro ao carregar dados da gestão:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (loading) {
    return <div className="management-loading">A carregar os dados da bomba...</div>;
  }

  if (!bomba) {
    return (
      <div className="management-loading">
        <p>Nenhum posto de combustível associado a esta conta.</p>
        <Link to="/register" style={{ marginTop: '10px', display: 'inline-block', color: '#D4500A' }}>
          Registar uma bomba
        </Link>
      </div>
    );
  }

  const totalStock = bomba.combustiveis.reduce((acc, c) => acc + c.quantidade, 0);
  const temAlerta = bomba.combustiveis.some(c => c.maximo > 0 && (c.quantidade / c.maximo) < 0.2);

  // Calcular litros vendidos (simulado ou baseado nos registos de abastecimento)
  // Como os registos são de *abastecimento* (entrada) e não *venda* (saída), vamos somar os abastecimentos
  const totalEntradas = vendas.reduce((acc, v) => acc + parseInt(v.litros), 0);

  return (
    <div className="management">
      <div className="management-sidebar">
        <div className="sidebar-bomba">
          <div className="sidebar-dot"></div>
          <div>
            <p className="sidebar-nome">{bomba.nome}</p>
            <p className="sidebar-gestor">{bomba.gestor}</p>
          </div>
        </div>

        <div className="sidebar-section">Gestão</div>
        {[
          { id: 'dashboard', label: 'Dashboard' },
          { id: 'abastecimento', label: 'Abastecimento' },
          { id: 'historico', label: 'Histórico' },
          { id: 'relatorios', label: 'Relatórios' },
        ].map(item => (
          <div
            key={item.id}
            className={`sidebar-item ${activePage === item.id ? 'active' : ''}`}
            onClick={() => setActivePage(item.id)}
          >
            {item.label}
          </div>
        ))}

        <div className="sidebar-section">Sistema</div>
        {[
          { id: 'apikey', label: 'API Key' },
          { id: 'alertas', label: 'Alertas' },
          { id: 'configuracoes', label: 'Configurações' },
        ].map(item => (
          <div
            key={item.id}
            className={`sidebar-item ${activePage === item.id ? 'active' : ''}`}
            onClick={() => setActivePage(item.id)}
          >
            {item.label}
          </div>
        ))}

        <Link to="/" className="sidebar-back">← Dashboard público</Link>
      </div>

      <div className="management-content">
        <div className="management-topbar">
          <h1>{activePage.charAt(0).toUpperCase() + activePage.slice(1)}</h1>
          <span className="management-update">Actualizado agora</span>
        </div>

        {temAlerta && (
          <div className="management-alert">
            ⚠ Um ou mais combustíveis estão abaixo de 20% do limite. Considere reabastecer.
          </div>
        )}

        <div className="management-metrics">
          <div className="metric-card">
            <p className="metric-label">Stock total</p>
            <p className="metric-value">{totalStock.toLocaleString()}</p>
            <p className="metric-sub">litros disponíveis</p>
          </div>
          <div className="metric-card">
            <p className="metric-label">Entradas (Histórico)</p>
            <p className="metric-value">{totalEntradas.toLocaleString()}</p>
            <p className="metric-sub">litros abastecidos</p>
          </div>
          <div className="metric-card">
            <p className="metric-label">Estimativa stock</p>
            <p className="metric-value">{bomba.estado === 'baixo' ? '< 5h' : '~18h'}</p>
            <p className="metric-sub">ao ritmo actual</p>
          </div>
          <div className="metric-card">
            <p className="metric-label">Último abastec.</p>
            <p className="metric-value">{vendas.length > 0 ? 'Hoje' : 'N/A'}</p>
            <p className="metric-sub">{vendas.length > 0 ? `${vendas[0].hora} · ${vendas[0].litros} L` : 'Sem registos'}</p>
          </div>
        </div>

        <div className="management-row">
          <div className="management-card">
            <h3>Stock por combustível</h3>
            {bomba.combustiveis.map(c => (
              <StockBar
                key={c.tipo}
                tipo={c.tipo}
                quantidade={c.quantidade}
                maximo={c.maximo}
              />
            ))}
            <Link to="/abastecimento" className="management-btn">
              + Registar abastecimento
            </Link>
          </div>

          <div className="management-card">
            <h3>Últimos Abastecimentos Registados</h3>
            <div style={{ overflowX: 'auto' }}>
              <table className="management-table">
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Hora</th>
                    <th>Tipo</th>
                    <th>Litros</th>
                    <th>Operador</th>
                  </tr>
                </thead>
                <tbody>
                  {vendas.length === 0 ? (
                    <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>Nenhum abastecimento registado.</td></tr>
                  ) : (
                    vendas.map((v, i) => (
                      <tr key={i}>
                        <td>{new Date(v.data).toLocaleDateString('pt-PT')}</td>
                        <td>{v.hora}</td>
                        <td>{v.tipo}</td>
                        <td>{v.litros} L</td>
                        <td>{v.operador}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Management;