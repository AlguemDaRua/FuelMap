import React, { useState } from 'react';
import FilterBar from '../../components/FilterBar/FilterBar';
import StationCard from '../../components/StationCard/StationCard';
import './Dashboard.css';

const mockBombas = [
  {
    id: 1,
    nome: 'Petromoc — Av. Julius Nyerere',
    cidade: 'Maputo',
    bairro: 'Sommerschield',
    distancia: 1.2,
    estado: 'disponivel',
    provedor: 'petromoc',
    combustiveis: [
      { tipo: 'Gasolina', quantidade: 8400, maximo: 15000 },
      { tipo: 'Gasóleo', quantidade: 12100, maximo: 20000 },
    ]
  },
  {
    id: 2,
    nome: 'Galp — Av. Eduardo Mondlane',
    cidade: 'Maputo',
    bairro: 'Alto Maé',
    distancia: 2.8,
    estado: 'baixo',
    provedor: 'galp',
    combustiveis: [
      { tipo: 'Gasolina', quantidade: 900, maximo: 15000 },
      { tipo: 'Gasóleo', quantidade: 5200, maximo: 20000 },
      { tipo: 'GPL', quantidade: 200, maximo: 5000 },
    ]
  },
  {
    id: 3,
    nome: 'Total — Av. Vladimir Lenine',
    cidade: 'Maputo',
    bairro: 'Polana',
    distancia: 3.5,
    estado: 'esgotado',
    provedor: 'total',
    combustiveis: [
      { tipo: 'Gasolina', quantidade: 0, maximo: 15000 },
      { tipo: 'Gasóleo', quantidade: 0, maximo: 20000 },
    ]
  },
  {
    id: 4,
    nome: 'Enacosa — Av. 24 de Julho',
    cidade: 'Maputo',
    bairro: 'Central',
    distancia: 4.1,
    estado: 'disponivel',
    provedor: 'enacosa',
    combustiveis: [
      { tipo: 'Gasolina', quantidade: 11000, maximo: 15000 },
      { tipo: 'Gasóleo', quantidade: 9000, maximo: 20000 },
      { tipo: 'GPL', quantidade: 3000, maximo: 5000 },
    ]
  },
];

function Dashboard() {
  const [bombas, setBombas] = useState(mockBombas);

  const handleFiltrar = (filtros) => {
    let resultado = mockBombas;

    if (filtros.provedor) {
      resultado = resultado.filter(b => b.provedor === filtros.provedor);
    }
    if (filtros.cidade) {
      resultado = resultado.filter(b => b.cidade.toLowerCase().includes(filtros.cidade));
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
            <span className="dashboard-update">Actualizado há 12s</span>
          </div>
          {bombas.length === 0 ? (
            <p className="dashboard-empty">Nenhuma bomba encontrada.</p>
          ) : (
            bombas.map(bomba => (
              <StationCard key={bomba.id} bomba={bomba} />
            ))
          )}
        </div>
        <div className="dashboard-mapa">
          <p>🗺️ Mapa interactivo</p>
          <span>Google Maps será integrado aqui</span>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;