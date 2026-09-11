import { NextResponse } from 'next/server';
import { Pool } from 'pg';

export const dynamic = 'force-dynamic';

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Permet la connexion aux bases de données cloud depuis un environnement local
  }
});

export async function GET() {
  try {
    const result = await pool.query('SELECT data FROM dashboard_state WHERE id = 1');
    if (result.rows.length > 0) return NextResponse.json(result.rows[0].data);
    return NextResponse.json({ error: 'No data' }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    await pool.query(
      'INSERT INTO dashboard_state (id, data) VALUES (1, $1) ON CONFLICT (id) DO UPDATE SET data = $1',
      [data]
    );
    return NextResponse.json({ success: true });
  // ... code précédent ...
  } catch (error: any) {
    console.error("Erreur Base de données :", error); // <-- AJOUTEZ CETTE LIGNE
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
