import { getPool, sql } from "@/lib/db";
import type { NextRequest } from "next/server";

const VALID_STATUSES = ["free", "occupied", "ordered", "billing"];

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const { section, seats, name, status, occupiedSince } = body as {
    section?: string;
    seats?: number;
    name?: string;
    status?: string;
    occupiedSince?: number | null;
  };

  if (seats !== undefined && (!Number.isInteger(seats) || seats < 1)) {
    return Response.json({ error: "Seats must be a positive integer" }, { status: 400 });
  }
  if (status !== undefined && !VALID_STATUSES.includes(status)) {
    return Response.json({ error: "Invalid status" }, { status: 400 });
  }

  const pool = await getPool();

  let sectionId: number | undefined;
  if (section !== undefined) {
    const sectionResult = await pool
      .request()
      .input("section", sql.NVarChar, section)
      .query("SELECT id FROM dbo.Sections WHERE name = @section");
    if (!sectionResult.recordset[0]) {
      return Response.json({ error: "Unknown section" }, { status: 400 });
    }
    sectionId = sectionResult.recordset[0].id;
  }

  const req = pool.request().input("id", sql.NVarChar, id);
  const sets: string[] = [];
  if (sectionId !== undefined) {
    sets.push("sectionId = @sectionId");
    req.input("sectionId", sql.Int, sectionId);
  }
  if (seats !== undefined) {
    sets.push("seats = @seats");
    req.input("seats", sql.Int, seats);
  }
  if (name !== undefined) {
    sets.push("name = NULLIF(@name, '')");
    req.input("name", sql.NVarChar, name);
  }
  if (status !== undefined) {
    sets.push("status = @status");
    req.input("status", sql.NVarChar, status);
  }
  if (occupiedSince !== undefined) {
    sets.push("occupiedSince = @occupiedSince");
    req.input("occupiedSince", sql.DateTime2, occupiedSince === null ? null : new Date(occupiedSince));
  }

  if (sets.length === 0) {
    return Response.json({ error: "No fields to update" }, { status: 400 });
  }

  const result = await req.query(`UPDATE dbo.HotelTables SET ${sets.join(", ")} WHERE id = @id`);
  if (result.rowsAffected[0] === 0) {
    return Response.json({ error: "Table not found" }, { status: 404 });
  }

  return Response.json({ ok: true });
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pool = await getPool();

  const statusResult = await pool.request().input("id", sql.NVarChar, id).query("SELECT status FROM dbo.HotelTables WHERE id = @id");
  const row = statusResult.recordset[0];
  if (!row) {
    return Response.json({ error: "Table not found" }, { status: 404 });
  }
  if (row.status !== "free") {
    return Response.json({ error: "Table must be free before it can be removed" }, { status: 409 });
  }

  try {
    await pool.request().input("id", sql.NVarChar, id).query("DELETE FROM dbo.HotelTables WHERE id = @id");
    return Response.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    if (message.includes("REFERENCE constraint") || message.includes("conflicted")) {
      return Response.json({ error: "Can't remove a table with existing order history" }, { status: 409 });
    }
    throw err;
  }
}
