/**
 * Normaliza um station da API para o formato esperado pelos componentes.
 * API: { id, name, city, district, provider, fuels: [{type, stock_liters, max_capacity}] }
 * UI:  { id, nome, cidade, bairro, provedor, estado, combustiveis: [{tipo, quantidade, maximo}] }
 */
export const normalizeStation = (station) => {
  const combustiveis = (station.fuels || []).map(f => ({
    tipo: f.type,
    quantidade: f.stock_liters,
    maximo: f.max_capacity,
    preco: f.price,
    fuelId: f.id
  }));

  const getEstado = () => {
    if (combustiveis.length === 0) return 'esgotado';
    const pcts = combustiveis.map(c => c.maximo > 0 ? c.quantidade / c.maximo : 0);
    const minPct = Math.min(...pcts);
    if (minPct === 0) return 'esgotado';
    if (minPct < 0.2) return 'baixo';
    return 'disponivel';
  };

  return {
    id: station.id,
    nome: station.name,
    cidade: station.city || 'Maputo',
    bairro: station.district || '',
    provedor: station.provider || '',
    latitude: station.latitude,
    longitude: station.longitude,
    estado: getEstado(),
    combustiveis,
    distancia: null
  };
};

/**
 * Normaliza um registo de abastecimento da API para o formato de tabela.
 */
export const normalizeRecord = (record) => ({
  id: record.id,
  hora: record.refuel_time ? record.refuel_time.slice(0, 5) : '--:--',
  data: record.refuel_date,
  tipo: record.fuel_type,
  litros: record.quantity,
  operador: record.operator_name || 'Desconhecido',
  observacoes: record.observations || ''
});
