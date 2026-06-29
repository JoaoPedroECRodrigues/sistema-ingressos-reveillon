import Link from 'next/link';
import TableMap from '@/components/TableMap';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-white">

      {/* 1. Header / Navbar de Navegação */}
      <header className="w-full py-4 px-6 md:px-12 flex justify-between items-center border-b border-gray-800 bg-gray-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="text-2xl font-bold bg-gradient-to-r from-amber-200 to-yellow-500 bg-clip-text text-transparent">
          Réveillon VIP
        </div>
        <nav>
          {/* Link direcionando para a página de auth/login que criamos */}
          <Link
            href="/auth/login"
            className="px-6 py-2 rounded-full border border-gray-700 hover:border-gray-400 hover:bg-gray-800 transition-all text-sm font-semibold"
          >
            Fazer Login
          </Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center">

        {/* 2. Hero Section (Apresentação do Evento) */}
        <section className="w-full py-24 px-4 text-center flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-800 via-gray-950 to-gray-950">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight text-white">
            Celebre a Virada em <span className="text-emerald-400">Grande Estilo</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-10">
            Garanta o seu lugar no evento mais exclusivo do ano. Mesas limitadas com vista privilegiada e atendimento premium.
          </p>

          {/* Botão de âncora que rola a página suavemente até ao mapa */}
          <a
            href="#mapa-mesas"
            className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-full shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all transform hover:scale-105"
          >
            Escolher Minha Mesa
          </a>
        </section>

        {/* 3. Secção do Mapa de Mesas */}
        <section id="mapa-mesas" className="w-full max-w-7xl px-4 py-16 scroll-mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Mapa do Evento</h2>
            <p className="text-gray-400">Selecione o setor desejado no mapa abaixo para iniciar a sua reserva.</p>
          </div>

          {/* O nosso componente inteligente com acesso ao banco de dados */}
          <TableMap />

        </section>

      </main>

      {/* 4. Footer Simples */}
      <footer className="w-full py-8 text-center border-t border-gray-800 text-gray-600 text-sm">
        <p>&copy; {new Date().getFullYear()} Sistema de Ingressos. Todos os direitos reservados.</p>
      </footer>

    </div>
  );
}
