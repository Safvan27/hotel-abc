import { getPool, sql } from "@/lib/db";
import type { NextRequest } from "next/server";

export async function GET() {
  const pool = await getPool();
  const result = await pool.request().query(`
    SELECT t.id, t.num, s.name AS section, t.seats, t.status, t.occupiedSince, t.name
    FROM dbo.HotelTables t
    JOIN dbo.Sections s ON s.id = t.sectionId
    ORDER BY t.num
  `);

  const tables = result.recordset.map((row) => ({
    ...row,
    name: row.name ?? undefined,
    occupiedSince: row.occupiedSince ? new Date(row.occupiedSince).getTime() : undefined,
  }));

  return Response.json(tables);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { section, seats, name } = body as { section: string; seats: number; name?: string };

  if (!section || !Number.isInteger(seats) || seats < 1) {
    return Response.json({ error: "section and a positive integer seats are required" }, { status: 400 });
  }

  const pool = await getPool();

  const sectionResult = await pool
    .request()
    .input("section", sql.NVarChar, section)
    .query("SELECT id FROM dbo.Sections WHERE name = @section");
  const sectionRow = sectionResult.recordset[0];
  if (!sectionRow) {
    return Response.json({ error: "Unknown section" }, { status: 400 });
  }

  const numResult = await pool.request().query("SELECT ISNULL(MAX(num), 0) + 1 AS nextNum FROM dbo.HotelTables");
  const nextNum = numResult.recordset[0].nextNum as number;
  const id = "T" + nextNum;

  await pool
    .request()
    .input("id", sql.NVarChar, id)
    .input("num", sql.Int, nextNum)
    .input("sectionId", sql.Int, sectionRow.id)
    .input("seats", sql.Int, seats)
    .input("name", sql.NVarChar, name || null)
    .query(`
      INSERT INTO dbo.HotelTables (id, num, sectionId, seats, status, name)
      VALUES (@id, @num, @sectionId, @seats, 'free', @name)
    `);

  return Response.json({ id, num: nextNum, section, seats, status: "free", name: name || undefined });
}
