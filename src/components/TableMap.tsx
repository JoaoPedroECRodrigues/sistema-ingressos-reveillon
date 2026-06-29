'use client';

import { useEffect, useState } from 'react';

// Definição da estrutura de dados do setor
interface Sector {
  id: number;
  name: string;
  total_spots: number;
  available_spots: number;
  price: number;
}

export default function TableMap() {
  // Estados para armazenamento de dados da API e status de carregamento
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Estados locais para controle de interface e fluxo de seleção/reserva
  const [selectedSector, setSelectedSector] = useState<Sector | null>(null);
  const [isReserving, setIsReserving] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Busca inicial dos setores disponíveis na montagem do componente
  useEffect(() => {
    async function fetchSectors() {
      try {
        const response = await fetch('/api/sectors');
        if (!response.ok) throw new Error('Falha na requisição dos setores.');
        const data = await response.json();
        setSectors(data);
      } catch (err) {
        setError('Erro de conexão com o servidor.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchSectors();
  }, []);

  // Processamento da requisição de reserva do setor selecionado
  const handleReservation = async () => {
    if (!selectedSector) return;

    setIsReserving(true);
    setFeedbackMsg('');

    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Payload da requisição (quantidade hardcoded em 1 para a implementação atual)
        body: JSON.stringify({ sectorId: selectedSector.id, quantity: 1 }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Falha no processamento da reserva.');
      }

      setFeedbackMsg('Reserva temporária confirmada.');

      // TODO: Implementar redirecionamento para o gateway de pagamento
      // window.location.href = '/checkout/pagamento';

    } catch (err: any) {
      setFeedbackMsg(err.message);
    } finally {
      setIsReserving(false);
    }
  };

  // Renderização de estados de fallback (Loading / Error)
  if (loading) return <div className="p-8 text-center text-white">Carregando mapa de setores...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="flex flex-col items-center gap-8 p-6 bg-gray-900 rounded-xl shadow-lg border border-gray-800">
      <h2 className="text-2xl font-bold text-white">Seleção de Setor</h2>

      {/* Renderização do grid de setores mapeados da API */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {sectors.map((sector) => {
          const isSelected = selectedSector?.id === sector.id;
          const isSoldOut = sector.available_spots === 0;

          return (
            <div
              key={sector.id}
              onClick={() => !isSoldOut && setSelectedSector(sector)}
              className={`p-6 rounded-lg border-2 cursor-pointer transition-all duration-200
                ${isSoldOut ? 'bg-red-900/20 border-red-900/50 cursor-not-allowed opacity-60' :
                  isSelected ? 'bg-emerald-900/40 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]' :
                  'bg-gray-800 border-gray-700 hover:border-gray-500'}`}
            >
              <h3 className="text-xl font-semibold text-white mb-2">{sector.name}</h3>
              <p className="text-gray-400 mb-1">
                Disponibilidade: <span className={isSoldOut ? 'text-red-400' : 'text-emerald-400 font-bold'}>{sector.available_spots}</span> / {sector.total_spots}
              </p>
              <p className="text-lg font-bold text-white mt-4">
                R$ {Number(sector.price).toFixed(2)}
              </p>
            </div>
          );
        })}
      </div>

      {/* Renderização condicional do painel de confirmação de reserva */}
      {selectedSector && (
        <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg border border-gray-700 mt-4 flex flex-col items-center">
          <p className="text-gray-300 mb-4 text-center">
            Setor selecionado: <strong className="text-white">{selectedSector.name}</strong>
          </p>

          <button
            onClick={handleReservation}
            disabled={isReserving}
            className={`w-full py-3 px-6 rounded font-bold text-white transition-colors
              ${isReserving ? 'bg-gray-600 cursor-wait' : 'bg-blue-600 hover:bg-blue-500'}`}
          >
            {isReserving ? 'Processando Requisição...' : 'Confirmar Reserva'}
          </button>

          {feedbackMsg && (
            <p className={`mt-4 text-sm font-semibold ${feedbackMsg.includes('confirmada') ? 'text-emerald-400' : 'text-red-400'}`}>
              {feedbackMsg}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
