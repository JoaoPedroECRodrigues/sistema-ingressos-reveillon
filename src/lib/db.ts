import { Pool } from 'pg';

// Cria a conexão com o banco usando a URL segura do .env.local
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export default pool;
