'use client';

import { useEffect, useState } from 'react';

// Define o formato dos dados que vão chegar do banco
interface Sector {
  id: number;
  name: string;
  capacity: number;
  available_spots: number;
  price: string;
}

export default function TableMap() {
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Busca os dados da AWS assim que o componente carrega na tela
  useEffect(() => {
    async function loadSectors() {
      try {
        const response = await fetch('/api/sectors');
        if (!response.ok) {
          throw new Error('Falha ao carregar os setores');
        }
        const data = await response.json();
        setSectors(data);
      } catch (err) {
        console.error(err);
        setError('Não foi possível carregar o mapa de mesas no momento.');
      } finally {
        setLoading(false);
      }
    }

    loadSectors();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-white text-xl animate-pulse">
        Carregando o mapa do Réveillon...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-400 p-8 bg-red-900/20 rounded-lg border border-red-500/30">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-900 rounded-xl shadow-2xl border border-slate-800 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-amber-400 mb-8">
        Mapa de Mesas - Réveillon
      </h2>

      {/* Representação do Palco */}
      <div className="w-2/3 mx-auto h-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-b-3xl shadow-[0_10px_40px_rgba(124,58,237,0.4)] flex items-center justify-center mb-12">
        <span className="text-white font-black tracking-widest uppercase">Palco Principal</span>
      </div>

      {/* Grid de Setores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sectors.map((sector) => {
          // Calcula a porcentagem de ocupação para mudar a cor dinamicamente
          const isSoldOut = sector.available_spots === 0;
          const isAlmostSoldOut = sector.available_spots > 0 && sector.available_spots <= 10;

          return (
            <div
              key={sector.id}
              className={`relative overflow-hidden rounded-xl border-2 p-6 transition-all duration-300 hover:-translate-y-1
                ${isSoldOut
                  ? 'bg-slate-800 border-slate-700 opacity-70 cursor-not-allowed'
                  : 'bg-slate-800 border-slate-600 hover:border-amber-400 cursor-pointer shadow-lg'}`}
            >
              {/* Etiqueta de Esgotado */}
              {isSoldOut && (
                <div className="absolute top-4 right-[-35px] bg-red-600 text-white text-xs font-bold px-10 py-1 rotate-45 shadow-md">
                  ESGOTADO
                </div>
              )}

              <h3 className="text-xl font-bold text-white mb-2">{sector.name}</h3>

              <div className="space-y-2 mt-4 text-sm text-slate-300">
                <p className="flex justify-between">
                  <span>Preço:</span>
                  <span className="text-green-400 font-semibold">R$ {sector.price}</span>
                </p>

                <div className="h-px bg-slate-700 my-2"></div>

                <p className="flex justify-between">
                  <span>Capacidade total:</span>
                  <span className="text-white">{sector.capacity}</span>
                </p>

                <p className="flex justify-between items-center pt-1">
                  <span>Vagas disponíveis:</span>
                  <span className={`text-lg font-bold px-2 py-1 rounded
                    ${isSoldOut ? 'text-red-500 bg-red-500/10' :
                      isAlmostSoldOut ? 'text-amber-500 bg-amber-500/10' :
                      'text-emerald-400 bg-emerald-400/10'}`}>
                    {sector.available_spots}
                  </span>
                </p>
              </div>

              {!isSoldOut && (
                <button className="w-full mt-6 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold py-2 rounded transition-colors">
                  Selecionar Mesa
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
