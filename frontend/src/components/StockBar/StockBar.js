import React from 'react';
import './StockBar.css';

function StockBar({ tipo, quantidade, maximo }) {
  const percentagem = Math.min((quantidade / maximo) * 100, 100);

  const getColor = () => {
    if (percentagem > 40) return '#2A9D8F';
    if (percentagem > 15) return '#F0A500';
    return '#E63946';
  };

  return (
    <div className="stockbar">
      <div className="stockbar-info">
        <span className="stockbar-tipo">{tipo}</span>
        <span className="stockbar-quantidade">{quantidade.toLocaleString()} L</span>
      </div>
      <div className="stockbar-track">
        <div
          className="stockbar-fill"
          style={{ width: `${percentagem}%`, background: getColor() }}
        ></div>
      </div>
    </div>
  );
}

export default StockBar;