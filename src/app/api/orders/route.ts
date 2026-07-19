import { getPool, sql } from "@/lib/db";
import type { CartItem } from "@/lib/types";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const tableId = request.nextUrl.searchParams.get("tableId");
  if (!tableId) {
    return Response.json({ error: "tableId is required" }, { status: 400 });
  }

  const pool = await getPool();
  const orderResult = await pool
    .request()
    .input("tableId", sql.NVarChar, tableId)
    .query(`
      SELECT TOP 1 id, tableId, status, serveSection, customerName, customerPhone
      FROM dbo.Orders
      WHERE tableId = @tableId AND status NOT IN ('completed', 'cancelled')
      ORDER BY id DESC
    `);

  const order = orderResult.recordset[0];
  if (!order) {
    return Response.json(null);
  }

  const itemsResult = await pool
    .request()
    .input("orderId", sql.Int, order.id)
    .query("SELECT id, itemId, name, price, qty, note FROM dbo.OrderItems WHERE orderId = @orderId");

  return Response.json({
    id: order.id,
    tableId: order.tableId,
    status: order.status,
    serveSection: order.serveSection,
    customerName: order.customerName ?? "",
    customerPhone: order.customerPhone ?? "",
    items: itemsResult.recordset.map((r) => ({
      cartId: String(r.id),
      itemId: r.itemId,
      name: r.name,
      price: r.price,
      qty: r.qty,
      note: r.note ?? "",
    })),
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { tableId, status, serveSection, customerName, customerPhone, items } = body as {
    tableId: string;
    status: string;
    serveSection: string;
    customerName: string;
    customerPhone: string;
    items: CartItem[];
  };

  const pool = await getPool();
  const tx = new sql.Transaction(pool);
  await tx.begin();

  try {
    const existing = await new sql.Request(tx)
      .input("tableId", sql.NVarChar, tableId)
      .query(`
        SELECT TOP 1 id FROM dbo.Orders
        WHERE tableId = @tableId AND status NOT IN ('completed', 'cancelled')
        ORDER BY id DESC
      `);

    let orderId: number;

    if (existing.recordset[0]) {
      orderId = existing.recordset[0].id;
      await new sql.Request(tx)
        .input("id", sql.Int, orderId)
        .input("status", sql.NVarChar, status)
        .input("serveSection", sql.NVarChar, serveSection)
        .input("customerName", sql.NVarChar, customerName ?? "")
        .input("customerPhone", sql.NVarChar, customerPhone ?? "")
        .query(`
          UPDATE dbo.Orders
          SET status = @status, serveSection = @serveSection, customerName = @customerName,
              customerPhone = @customerPhone, updatedAt = SYSDATETIME()
          WHERE id = @id
        `);
      await new sql.Request(tx).input("orderId", sql.Int, orderId).query("DELETE FROM dbo.OrderItems WHERE orderId = @orderId");
    } else {
      const inserted = await new sql.Request(tx)
        .input("tableId", sql.NVarChar, tableId)
        .input("status", sql.NVarChar, status)
        .input("serveSection", sql.NVarChar, serveSection)
        .input("customerName", sql.NVarChar, customerName ?? "")
        .input("customerPhone", sql.NVarChar, customerPhone ?? "")
        .query(`
          INSERT INTO dbo.Orders (tableId, status, serveSection, customerName, customerPhone)
          OUTPUT INSERTED.id
          VALUES (@tableId, @status, @serveSection, @customerName, @customerPhone)
        `);
      orderId = inserted.recordset[0].id;
    }

    for (const item of items) {
      await new sql.Request(tx)
        .input("orderId", sql.Int, orderId)
        .input("itemId", sql.NVarChar, item.itemId)
        .input("name", sql.NVarChar, item.name)
        .input("price", sql.Decimal(10, 2), item.price)
        .input("qty", sql.Int, item.qty)
        .input("note", sql.NVarChar, item.note ?? "")
        .query(`
          INSERT INTO dbo.OrderItems (orderId, itemId, name, price, qty, note)
          VALUES (@orderId, @itemId, @name, @price, @qty, @note)
        `);
    }

    await tx.commit();
    return Response.json({ id: orderId });
  } catch (err) {
    await tx.rollback();
    throw err;
  }
}
