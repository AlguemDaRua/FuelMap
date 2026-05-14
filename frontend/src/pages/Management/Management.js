import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import StockBar from '../../components/StockBar/StockBar';
import './Management.css';

const mockBomba = {
  nome: 'Petromoc — Av. Julius Nyerere',
  gestor: 'João Macuácua',
  combustiveis: [
    { tipo: 'Gasolina', quantidade: 8400, maximo: 15000 },
    { tipo: 'Gasóleo', quantidade: 12100, maximo: 20000 },
    { tipo: 'GPL', quantidade: 800, maximo: 5000 },
  ],
  vendas: [
    { hora: '09:42', tipo: 'Gasolina', litros: 45, estado: 'ok' },
    { hora: '09:38', tipo: 'Gasóleo', litros: 80, estado: 'ok' },
    { hora: '09:21', tipo: 'GPL', litros: 12, estado: 'baixo' },
    { hora: '09:10', tipo: 'Gasolina', litros: 60, estado: 'ok' },
  ]
};

function Management() {
  const [activePage, setActivePage] = useState('dashboard');

  const totalStock = mockBomba.combustiveis.reduce((acc, c) => acc + c.quantidade, 0);
  const temAlerta = mockBomba.combustiveis.some(c => (c.quantidade / c.maximo) < 0.2);

  return (
    <div className="management">
      <div className="management-sidebar">
        <div className="sidebar-bomba">
          <div className="sidebar-dot"></div>
          <div>
            <p className="sidebar-nome">{mockBomba.nome}</p>
            <p className="sidebar-gestor">{mockBomba.gestor}</p>
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
          <h1>Dashboard</h1>
          <span className="management-update">Actualizado há 12s</span>
        </div>

        {temAlerta && (
          <div className="management-alert">
            ⚠ GPL abaixo do limiar mínimo. Considere agendar reabastecimento.
          </div>
        )}

        <div className="management-metrics">
          <div className="metric-card">
            <p className="metric-label">Stock total</p>
            <p className="metric-value">{totalStock.toLocaleString()}</p>
            <p className="metric-sub">litros disponíveis</p>
          </div>
          <div className="metric-card">
            <p className="metric-label">Vendido hoje</p>
            <p className="metric-value">4.820</p>
            <p className="metric-sub">litros vendidos</p>
          </div>
          <div className="metric-card">
            <p className="metric-label">Estimativa stock</p>
            <p className="metric-value">~18h</p>
            <p className="metric-sub">ao ritmo actual</p>
          </div>
          <div className="metric-card">
            <p className="metric-label">Último abastec.</p>
            <p className="metric-value">Hoje</p>
            <p className="metric-sub">08:30 · 15.000 L</p>
          </div>
        </div>

        <div className="management-row">
          <div className="management-card">
            <h3>Stock por combustível</h3>
            {mockBomba.combustiveis.map(c => (
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
            <h3>Últimas vendas via API</h3>
            <table className="management-table">
              <thead>
                <tr>
                  <th>Hora</th>
                  <th>Tipo</th>
                  <th>Litros</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {mockBomba.vendas.map((v, i) => (
                  <tr key={i}>
                    <td>{v.hora}</td>
                    <td>{v.tipo}</td>
                    <td>{v.litros} L</td>
                    <td>
                      <span className={`badge-table ${v.estado === 'ok' ? 'badge-green' : 'badge-yellow'}`}>
                        {v.estado === 'ok' ? 'Registado' : 'Stock baixo'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Management;