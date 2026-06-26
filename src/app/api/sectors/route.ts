import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    // Faz a consulta SQL para buscar todos os setores ordenados pelo ID
    const result = await pool.query('SELECT * FROM sectors ORDER BY id ASC');

    // Retorna os dados com sucesso para o frontend
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar setores:', error);
    return NextResponse.json({ error: 'Erro interno ao buscar dados' }, { status: 500 });
  }
}
