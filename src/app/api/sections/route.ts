import { getPool } from "@/lib/db";

export async function GET() {
  const pool = await getPool();
  const result = await pool.request().query("SELECT name FROM dbo.Sections ORDER BY sortOrder");
  return Response.json(result.recordset.map((r) => r.name as string));
}
