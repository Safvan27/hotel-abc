import { getPool } from "@/lib/db";

export async function GET() {
  const pool = await getPool();
  const result = await pool.request().query("SELECT id, label FROM dbo.Categories ORDER BY sortOrder");
  return Response.json(result.recordset);
}
