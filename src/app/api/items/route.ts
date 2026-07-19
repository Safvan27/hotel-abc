import { getPool, sql } from "@/lib/db";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const cat = request.nextUrl.searchParams.get("cat");
  const pool = await getPool();
  const req = pool.request();

  let query = "SELECT id, categoryId AS cat, name, price FROM dbo.MenuItems";
  if (cat) {
    req.input("cat", sql.NVarChar, cat);
    query += " WHERE categoryId = @cat";
  }

  const result = await req.query(query);
  return Response.json(result.recordset);
}
