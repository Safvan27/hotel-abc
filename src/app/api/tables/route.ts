import { getPool } from "@/lib/db";

export async function GET() {
  const pool = await getPool();
  const result = await pool.request().query(`
    SELECT t.id, t.num, s.name AS section, t.seats, t.status, t.occupiedSince
    FROM dbo.HotelTables t
    JOIN dbo.Sections s ON s.id = t.sectionId
    ORDER BY t.num
  `);

  const tables = result.recordset.map((row) => ({
    ...row,
    occupiedSince: row.occupiedSince ? new Date(row.occupiedSince).getTime() : undefined,
  }));

  return Response.json(tables);
}
