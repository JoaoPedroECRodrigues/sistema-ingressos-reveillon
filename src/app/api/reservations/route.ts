import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { sectorId, quantity } = await request.json();

    if (!sectorId || !quantity) {
      return NextResponse.json({ error: 'Dados da reserva incompletos ou ausentes.' }, { status: 400 });
    }

    // Estabelece conexão dedicada para controle transacional
    const client = await pool.connect();

    try {
      // Início da transação relacional
      await client.query('BEGIN');

      // Consulta com bloqueio de registro (Row-level lock - FOR UPDATE)
      // Busca a capacidade total e a ocupação atual na tabela sectors
      const sectorResult = await client.query(
        'SELECT total_capacity, current_occupancy FROM sectors WHERE id = $1 FOR UPDATE',
        [sectorId]
      );

      if (sectorResult.rows.length === 0) {
        throw new Error('Setor não localizado no banco de dados.');
      }

      const { total_capacity, current_occupancy } = sectorResult.rows[0];
      const available = total_capacity - current_occupancy;

      // Validação de disponibilidade em tempo real
      if (available < quantity) {
        throw new Error('Vagas insuficientes para a quantidade solicitada.');
      }

      // Atualização do inventário: aumenta a ocupação atual do setor
      await client.query(
        'UPDATE sectors SET current_occupancy = current_occupancy + $1 WHERE id = $2',
        [quantity, sectorId]
      );

      // Confirmação e persistência da transação
      await client.query('COMMIT');

      return NextResponse.json({ message: 'Reserva temporária confirmada com sucesso.' }, { status: 200 });
    } catch (err: any) {
      // Reversão de estado em caso de exceção para manter integridade dos dados
      await client.query('ROLLBACK');
      return NextResponse.json({ error: err.message }, { status: 400 });
    } finally {
      // Liberação da conexão de volta ao pool
      client.release();
    }
  } catch (error) {
    console.error('Erro no processamento da reserva:', error);
    return NextResponse.json({ error: 'Erro interno no processamento da requisição.' }, { status: 500 });
  }
}
