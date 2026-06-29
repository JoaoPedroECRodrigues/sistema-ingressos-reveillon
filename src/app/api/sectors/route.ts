import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    // Faz um JOIN para buscar o setor e o preço do lote que está ativo no momento,
    // e renomeia as colunas (AS) para o padrão que o TableMap.tsx espera.
    const query = `
      SELECT
        s.id,
        s.name,
        s.total_capacity AS total_spots,
        (s.total_capacity - s.current_occupancy) AS available_spots,
        b.price
      FROM sectors s
      LEFT JOIN ticket_batches b ON s.id = b.sector_id AND b.is_active = TRUE
      ORDER BY s.name ASC;
    `;

    const result = await pool.query(query);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar setores:', error);
    return NextResponse.json({ error: 'Erro interno ao buscar dados' }, { status: 500 });
  }
}
