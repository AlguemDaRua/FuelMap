import React from 'react';
import StockBar from '../StockBar/StockBar';
import './StationCard.css';

function StationCard({ bomba }) {
  const getBadge = () => {
    if (bomba.estado === 'disponivel') return { texto: 'Disponível', classe: 'badge-green' };
    if (bomba.estado === 'baixo') return { texto: 'Stock Baixo', classe: 'badge-yellow' };
    return { texto: 'Esgotado', classe: 'badge-red' };
  };

  const badge = getBadge();

  return (
    <div className="station-card">
      <div className="station-card-top">
        <div>
          <h3 className="station-name">{bomba.nome}</h3>
          <p className="station-location">{bomba.cidade} · {bomba.bairro} · {bomba.distancia} km</p>
        </div>
        <span className={`badge ${badge.classe}`}>{badge.texto}</span>
      </div>
      <div className="station-stocks">
        {bomba.combustiveis.map((c) => (
          <StockBar
            key={c.tipo}
            tipo={c.tipo}
            quantidade={c.quantidade}
            maximo={c.maximo}
          />
        ))}
      </div>
    </div>
  );
}

export default StationCard;