'use client';

import React, { useState, useEffect } from 'react';

export default function LoginPage() {
  // Estado para gestão do tema atual (Escuro por padrão para alinhar com o projeto)
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Efeito colateral para aplicar as classes de tema no nível de raiz do documento
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Definição de classes dinâmicas com base no estado do tema
  const themeClasses = {
    container: isDarkMode ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900',
    sidebar: isDarkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-gray-100',
    card: isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300',
    input: isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900',
    buttonTheme: isDarkMode ? 'border-gray-700 bg-gray-800 hover:bg-gray-700' : 'border-gray-300 bg-white hover:bg-gray-100',
  };

  return (
    <div className={`min-h-screen flex flex-col md:flex-row transition-colors duration-300 ${themeClasses.container}`}>

      {/* Módulo de Alternância de Tema */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`px-4 py-2 rounded-full border shadow-sm transition-all ${themeClasses.buttonTheme}`}
          aria-label="Alternar tema"
        >
          {isDarkMode ? '🌞 Modo Claro' : '🌙 Modo Escuro'}
        </button>
      </div>

      {/* Módulo do Carrinho / Resumo do Pedido */}
      <div className={`w-full md:w-1/3 p-8 border-b md:border-b-0 md:border-r flex flex-col justify-center transition-colors duration-300 ${themeClasses.sidebar}`}>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          🛒 Resumo da Reserva
        </h2>
        <div className={`p-6 rounded-lg border shadow-sm transition-colors duration-300 ${themeClasses.card}`}>
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold opacity-80">Setor:</span>
            {/* Nota técnica: Estes dados serão substituídos por variáveis do LocalStorage/Context API na integração final */}
            <span className="font-bold">Salão Principal</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold opacity-80">Quantidade:</span>
            <span>1 Mesa</span>
          </div>
          <div className="border-t border-gray-500/30 pt-4 mt-4 flex justify-between items-center font-bold text-lg">
            <span>Total:</span>
            <span className="text-emerald-500">R$ 250,00</span>
          </div>
        </div>

        {/* Temporizador Mockado de Bloqueio de Vaga */}
        <div className="mt-6 bg-blue-900/20 border border-blue-500/30 p-4 rounded-lg text-center">
          <p className="text-sm font-medium text-blue-400">
            A sua reserva está garantida por <span className="font-bold text-xl">10:00</span>
          </p>
          <p className="text-xs opacity-70 mt-1">
            Faça login para concluir o pagamento.
          </p>
        </div>
      </div>

      {/* Módulo de Autenticação */}
      <div className="w-full md:w-2/3 p-8 flex flex-col justify-center items-center">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Identificação</h1>
            <p className="opacity-70">Aceda à sua conta para continuar</p>
          </div>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-medium mb-1 opacity-90">E-mail</label>
              <input
                type="email"
                required
                placeholder="seu@email.com"
                className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${themeClasses.input}`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 opacity-90">Senha</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${themeClasses.input}`}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition-colors"
            >
              Entrar e Continuar
            </button>
          </form>

          <div className="mt-8 text-center text-sm border-t border-gray-500/30 pt-6">
            <p className="opacity-80">
              Ainda não possui cadastro?{' '}
              <a href="#" className="text-blue-500 hover:text-blue-400 font-semibold hover:underline">
                Criar uma conta
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
