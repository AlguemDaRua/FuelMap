import React, { useState } from 'react';
import './FilterBar.css';

function FilterBar({ onFiltrar }) {
  const [filtros, setFiltros] = useState({
    provedor: '',
    combustivel: '',
    provincia: '',
    cidade: '',
    bairro: '',
    pesquisa: ''
  });

  const handleChange = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onFiltrar(filtros);
  };

  return (
    <div className="filterbar">
      <select name="provedor" onChange={handleChange} className="filter-select">
        <option value="">Provedor</option>
        <option value="petromoc">Petromoc</option>
        <option value="galp">Galp</option>
        <option value="total">Total</option>
        <option value="enacosa">Enacosa</option>
      </select>

      <select name="combustivel" onChange={handleChange} className="filter-select">
        <option value="">Combustível</option>
        <option value="gasolina">Gasolina</option>
        <option value="gasoleo">Gasóleo</option>
        <option value="gpl">GPL</option>
        <option value="jet">Jet A1</option>
      </select>

      <select name="provincia" onChange={handleChange} className="filter-select">
        <option value="">Província</option>
        <option value="maputo">Maputo</option>
        <option value="sofala">Sofala</option>
        <option value="nampula">Nampula</option>
      </select>

      <select name="cidade" onChange={handleChange} className="filter-select">
        <option value="">Cidade</option>
        <option value="maputo">Maputo Cidade</option>
        <option value="matola">Matola</option>
        <option value="beira">Beira</option>
      </select>

      <input
        name="pesquisa"
        placeholder="Nome da bomba..."
        onChange={handleChange}
        className="filter-input"
      />

      <button onClick={handleSubmit} className="filter-btn">
        Pesquisar
      </button>
    </div>
  );
}

export default FilterBar;