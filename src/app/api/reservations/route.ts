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
      // para prevenção de concorrência e race conditions
      const sectorResult = await client.query(
        'SELECT available_spots FROM sectors WHERE id = $1 FOR UPDATE',
        [sectorId]
      );

      if (sectorResult.rows.length === 0) {
        throw new Error('Setor não localizado no banco de dados.');
      }

      const available = sectorResult.rows[0].available_spots;

      // Validação de disponibilidade em tempo real
      if (available < quantity) {
        throw new Error('Vagas insuficientes para a quantidade solicitada.');
      }

      // Atualização do inventário de vagas do setor
      await client.query(
        'UPDATE sectors SET available_spots = available_spots - $1 WHERE id = $2',
        [quantity, sectorId]
      );

      // Confirmação e persistência da transação
      await client.query('COMMIT');

      return NextResponse.json({ message: 'Reserva temporária efetivada com sucesso.' }, { status: 200 });
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
