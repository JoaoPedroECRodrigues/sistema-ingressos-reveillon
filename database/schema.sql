-- ==============================================================================
-- 1. ESTRUTURA DAS TABELAS (DDL)
-- ==============================================================================

-- Tabela: sectors (Setores do evento)
CREATE TABLE sectors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    total_capacity INTEGER NOT NULL,
    current_occupancy INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabela: ticket_batches (Lotes de Venda)
CREATE TABLE ticket_batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sector_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    quantity_total INTEGER NOT NULL,
    quantity_available INTEGER NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    -- FK: Associa o lote ao setor em que ele é válido.
    -- ON DELETE CASCADE garante que, se o setor for excluído, os lotes também serão.
    CONSTRAINT fk_sector
        FOREIGN KEY (sector_id)
        REFERENCES sectors(id)
        ON DELETE CASCADE
);

-- Tabela: customers (Clientes)
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(255) NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20)
);

-- Tabela: tickets (Ingressos emitidos)
CREATE TABLE tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL,
    batch_id UUID NOT NULL,
    sector_id UUID NOT NULL,
    type VARCHAR(50) NOT NULL,
    payment_status VARCHAR(50) NOT NULL,
    qr_code_token VARCHAR(255) UNIQUE NOT NULL,
    is_used BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- CHECK Constraints para garantir a integridade dos domínios (Enums simplificados)
    CONSTRAINT chk_ticket_type CHECK (type IN ('paid', 'complimentary')),
    CONSTRAINT chk_payment_status CHECK (payment_status IN ('pending', 'approved', 'failed', 'free')),

    -- FK: Vincula o ingresso ao cliente comprador (RESTRICT evita deletar o cliente se ele tiver ingressos)
    CONSTRAINT fk_customer
        FOREIGN KEY (customer_id)
        REFERENCES customers(id)
        ON DELETE RESTRICT,

    -- FK: Vincula o ingresso ao lote de origem para fins financeiros/auditoria
    CONSTRAINT fk_batch
        FOREIGN KEY (batch_id)
        REFERENCES ticket_batches(id)
        ON DELETE RESTRICT,

    -- FK: Vincula o ingresso ao setor para controle rápido de acesso e lotação
    CONSTRAINT fk_ticket_sector
        FOREIGN KEY (sector_id)
        REFERENCES sectors(id)
        ON DELETE RESTRICT
);

-- ==============================================================================
-- 2. DADOS INICIAIS MOCKADOS (DML) - Para Testes no Frontend
-- ==============================================================================
-- Nota: Utilizei UUIDs fixos aqui exclusivamente para facilitar o teste.
-- Ao inserir no mundo real, o `gen_random_uuid()` cuidará da criação e você fará a vinculação na aplicação.

-- Inserindo 2 Setores
INSERT INTO sectors (id, name, total_capacity, current_occupancy)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'Salão Principal', 1000, 0),
    ('22222222-2222-2222-2222-222222222222', 'Camarote VIP', 300, 0);

-- Inserindo 2 Lotes para cada Setor
INSERT INTO ticket_batches (id, sector_id, name, price, quantity_total, quantity_available, is_active)
VALUES
    -- Lotes do Salão Principal (sector_id = 1111...)
    ('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', '1º Lote', 250.00, 500, 500, TRUE),
    ('44444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', '2º Lote', 350.00, 500, 500, FALSE), -- Desativado (ainda não abriu)

    -- Lotes do Camarote VIP (sector_id = 2222...)
    ('55555555-5555-5555-5555-555555555555', '22222222-2222-2222-2222-222222222222', 'Lote Promocional', 600.00, 100, 100, TRUE),
    ('66666666-6666-6666-6666-666666666666', '22222222-2222-2222-2222-222222222222', '1º Lote VIP', 800.00, 200, 200, FALSE);
