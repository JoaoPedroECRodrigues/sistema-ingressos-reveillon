

export const metadata = {
  title: 'Sistema de Ingressos - Réveillon',
  description: 'Reserva de mesas para o evento de Réveillon',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}
