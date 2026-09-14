// ============================================
// FICHIER COMPLET : app/api/dashboard/route.js
// ============================================
import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';
export const runtime = 'nodejs';

const sql = neon(process.env.DATABASE_URL);

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'Pragma': 'no-cache',
  'Expires': '0',
  'Surrogate-Control': 'no-store',
};

export async function GET() {
  try {
    const rows = await sql`SELECT data FROM dashboard_state WHERE id = 1`;
    if (rows.length === 0) {
      return NextResponse.json({ data: null }, { status: 200, headers: NO_CACHE_HEADERS });
    }

    let data = rows[0].data;
    if (typeof data === 'string') {
      try { data = JSON.parse(data); } catch { data = null; }
    }

    return NextResponse.json({ data }, { status: 200, headers: NO_CACHE_HEADERS });
  } catch (err) {
    console.error('GET /api/dashboard error:', err);
    return NextResponse.json(
      { error: 'Erreur lors de la lecture des données.' },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const rows = await sql`
      INSERT INTO dashboard_state (id, data, updated_at)
      VALUES (1, ${body}, now())
      ON CONFLICT (id)
      DO UPDATE SET data = ${body}, updated_at = now()
      RETURNING data
    `;
    return NextResponse.json({ data: rows[0].data }, { status: 200, headers: NO_CACHE_HEADERS });
  } catch (err) {
    console.error('PUT /api/dashboard error:', err);
    return NextResponse.json(
      { error: 'Erreur lors de la sauvegarde des données.' },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}