1. Visão Geral do Projeto
   A plataforma foi desenhada para atender a eventos com público estimado entre 1.300 e 1.600 pessoas, exigindo controle rigoroso de concorrência e alta disponibilidade. O núcleo do sistema gerencia o mapa do estabelecimento, o bloqueio temporário de assentos, a integração com gateways de pagamento e a emissão e validação de ingressos via QR Code.

2. Arquitetura e Stack Tecnológico
   A escolha das tecnologias priorizou o equilíbrio entre custo de infraestrutura, robustez em operações de banco de dados e velocidade de entrega de conteúdo (CDN).

Frontend: React.js / Next.js (App Router). Escolhido pela capacidade de renderização Server-Side (SSR) e Static Site Generation (SSG), fundamentais para performance e SEO. Estilização via Tailwind CSS.

Backend & Banco de Dados: Supabase (PostgreSQL). A escolha de um banco relacional é mandatória neste projeto para garantir a propriedade ACID (Atomicidade, Consistência, Isolamento, Durabilidade) nas transações, prevenindo condições de corrida (race conditions) durante a reserva de mesas.

Hospedagem Frontend: Vercel (distribuição global via CDN).

Processamento de Pagamentos: Integração via API REST com [Nome do Gateway - ex: Mercado Pago/Stripe], com foco em processamento de PIX e confirmação assíncrona via Webhooks.

Autenticação e Autorização: Supabase Auth.

3. Especificação de Requisitos
   O escopo do sistema é segmentado em três módulos operacionais:

3.1. Módulo do Cliente (Frontend)
Apresentação do Evento: Landing page otimizada com informações essenciais do evento.

Mapa Interativo e Tempo Real: Interface visual (baseada em SVG) representando a planta do local. O status das mesas (Livre, Em Reserva, Vendida) deve ser atualizado em tempo real (via WebSockets/Supabase Realtime) para todos os clientes conectados.

Controle de Concorrência (Locking): Ao iniciar o processo de checkout, a mesa selecionada é bloqueada (status "Em Reserva") por um período determinado (ex: 10 minutos). O sistema deve impedir que múltiplos usuários iniciem o checkout para o mesmo recurso simultaneamente.

Checkout e Pagamento: Formulário para coleta de dados do titular (Nome, CPF, Contato) e geração de payload para a API de pagamento. Exibição de QR Code e chave PIX para pagamento imediato.

Emissão de E-Ticket: Após a confirmação do webhook de pagamento, o sistema gera um ingresso digital contendo os dados da compra e um QR Code único, enviado ao cliente via E-mail/WhatsApp.

3.2. Módulo Administrativo (Backoffice)
Dashboard de Monitoramento: Painel consolidado exibindo métricas de ocupação (percentual de mesas vendidas) e faturamento em tempo real.

Gestão de Inventário: Ferramenta para o administrador alterar o status das mesas manualmente (bloqueios administrativos, reservas offline).

Gestão de Compradores: Interface para consulta de clientes, histórico de transações e status de pagamento, com filtros de busca (Nome, CPF, ID da Mesa).

3.3. Módulo de Controle de Acesso (Portaria)
Interface de Validação: Aplicação web responsiva, otimizada para uso em dispositivos móveis.

Leitura de QR Code: Integração com a câmera do dispositivo para leitura dos ingressos.

Validação de Integridade: O sistema deve consultar o banco de dados para verificar a autenticidade do QR Code e registrar o check-in, invalidando o código para prevenir reuso ou fraudes.

4. Segurança
   A comunicação com o banco de dados para reserva de mesas utiliza Row-Level Security (RLS) e operações atômicas para garantir que o lock de uma mesa seja concedido a apenas uma sessão.

As rotas de Webhook responsáveis por alterar o status de pagamento exigem validação de assinatura criptográfica (HMAC) proveniente do gateway.

A aplicação deve estar em conformidade com as diretrizes de proteção de dados, armazenando informações de identificação pessoal (PII) de forma segura.
