# Sistema de Venda de Ingressos e Gestão de Lotação (Réveillon)

![Status](https://img.shields.io/badge/Status-Em_Desenvolvimento-blue)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-232F3E?style=flat&logo=amazon-aws&logoColor=white)

## 1. Visão Geral do Projeto

Este repositório contém o código-fonte de um sistema _Full Stack_ dedicado à gestão de vendas de ingressos para eventos de alta demanda. O projeto foi arquitetado para substituir soluções de terceiros, oferecendo uma plataforma própria, otimizada e capaz de suportar picos de tráfego, garantindo integridade transacional e prevenindo _overbooking_.

A principal regra de negócios baseia-se na gestão de capacidade por **Setores** (ex: Salão Principal, Varanda) e na transição dinâmica de **Lotes de Preço**, substituindo o modelo engessado de "mesas fixas" por um controle de lotação inteligente.

## 2. Arquitetura e Stack Tecnológico

A escolha das tecnologias priorizou o equilíbrio entre custo de infraestrutura, robustez em operações de banco de dados e velocidade de entrega de conteúdo (CDN).

- **Frontend:** React.js / Next.js (App Router). Escolhido pela capacidade de renderização Server-Side (SSR) e Static Site Generation (SSG), fundamentais para performance em picos de acesso. Estilização via Tailwind CSS.
- **Backend (API):** Node.js / Java hospedado na Oracle Cloud Infrastructure (OCI - Always Free Tier) para processamento robusto e econômico.
- **Banco de Dados:** PostgreSQL (AWS RDS / Supabase). Mandatório para garantir a propriedade ACID (Atomicidade, Consistência, Isolamento, Durabilidade) nas transações, prevenindo condições de corrida (_race conditions_) durante o bloqueio de ingressos.
- **Hospedagem Frontend:** Vercel (distribuição global via CDN).
- **Processamento de Pagamentos:** Integração via API REST com Gateway de Pagamento, focando no processamento de PIX e confirmação assíncrona via Webhooks.

## 3. Especificação de Requisitos

O escopo do sistema é segmentado em três módulos operacionais:

### 3.1. Módulo do Cliente (Frontend)

- **Apresentação do Evento:** Landing page otimizada com informações essenciais do evento e contagem regressiva.
- **Gestão de Setores (Zonas):** Visualização das áreas do evento. O sistema exibe a disponibilidade baseada na capacidade máxima (Lotação) e não em mesas fixas, permitindo maior flexibilidade física no dia do evento.
- **Sistema de Lotes Dinâmicos:** Os ingressos são vendidos em lotes. O sistema realiza a transição automática de preço quando a cota de um lote se esgota.
- **Controle de Concorrência (Locking):** Ao iniciar o checkout, o ingresso do lote atual é temporariamente reservado (ex: por 10 minutos). O banco de dados impede _overbooking_ através de transações atômicas no PostgreSQL.
- **Checkout e Pagamento (PIX):** Processamento de pagamento integrado a gateway, com geração de QR Code e chave PIX "Copia e Cola".
- **Emissão de E-Ticket:** Após o webhook de confirmação, geração de ingresso digital contendo QR Code único, enviado ao cliente.

### 3.2. Módulo Administrativo (Backoffice)

- **Dashboard de Monitoramento:** Painel exibindo métricas de ocupação real (percentual de lotação por setor) e faturamento em tempo real.
- **Gestão de Lotes:** Interface para o administrador criar, editar preços, definir quantidades e ativar/desativar lotes de ingressos.
- **Emissão de Cortesias:** Ferramenta exclusiva para administradores gerarem ingressos gratuitos. As cortesias são rigorosamente deduzidas da capacidade total do setor para evitar superlotação.
- **Gestão de Compradores:** Interface para consulta de clientes e histórico de transações, com filtros de busca.

### 3.3. Módulo de Controle de Acesso (Portaria)

- **Interface de Validação:** Aplicação web responsiva, leve e otimizada para uso em dispositivos móveis da equipe de recepção.
- **Leitura de QR Code:** Integração com a câmera do dispositivo para leitura rápida dos ingressos.
- **Validação de Integridade:** O sistema consulta o banco de dados para verificar a autenticidade do QR Code e registra o _check-in_, invalidando o código instantaneamente para prevenir fraudes.

## 4. Segurança

- **Transações ACID:** O uso do PostgreSQL garante que as operações de atualização de capacidade e lote sejam atômicas.
- **Isolamento de Backend:** Regras de negócio e chaves de API não residem no cliente. O frontend comunica-se exclusivamente com a API intermediária.
- **Validação de Webhooks:** As rotas que recebem a confirmação de pagamento exigem validação de assinatura criptográfica (HMAC) proveniente do gateway.
- **Proteção de Dados (LGPD):** Conformidade com o princípio do privilégio mínimo e _Privacy by Design_.

## 5. Estrutura de Diretórios

O projeto segue uma arquitetura modularizada dentro do padrão App Router do Next.js:

```text
src/
├── app/               # Rotas da aplicação (Públicas, Admin e API Backend)
├── components/        # Componentes React reutilizáveis (UI)
├── hooks/             # Custom Hooks para encapsulamento de lógica de estado
├── services/          # Integrações com Banco de Dados e APIs externas
├── constants/         # Variáveis de ambiente e constantes de regras de negócio
├── lib/               # Configurações de bibliotecas de terceiros
└── types/             # Definições de tipagem estática (TypeScript)
```
