// ============================================
// À REMPLACER dans app/api/dashboard/route.js
// GET défensif : gère le cas où "data" revient comme string au lieu d'objet
// ============================================
export async function GET() {
  try {
    const rows = await sql`SELECT data FROM dashboard_state WHERE id = 1`;
    if (rows.length === 0) {
      return NextResponse.json({ data: null }, { status: 200, headers: NO_CACHE_HEADERS });
    }

    let data = rows[0].data;
    // Filet de sécurité : si la valeur est une chaîne JSON (double encodage), on la parse
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