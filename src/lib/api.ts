import type { CartItem, Category, HotelTable, MenuItem, OrderRecord, OrderStatus, ServeSection, TableStatus } from "./types";

export async function fetchSections(): Promise<string[]> {
  const res = await fetch("/api/sections");
  if (!res.ok) throw new Error("Failed to load sections");
  return res.json();
}

export async function fetchCategories(): Promise<Category[]> {
  const res = await fetch("/api/categories");
  if (!res.ok) throw new Error("Failed to load categories");
  return res.json();
}

export async function fetchItems(): Promise<MenuItem[]> {
  const res = await fetch("/api/items");
  if (!res.ok) throw new Error("Failed to load items");
  return res.json();
}

export async function fetchTables(): Promise<HotelTable[]> {
  const res = await fetch("/api/tables");
  if (!res.ok) throw new Error("Failed to load tables");
  return res.json();
}

export interface TableInput {
  section: string;
  seats: number;
  name?: string;
}

export async function createTable(payload: TableInput): Promise<HotelTable> {
  const res = await fetch("/api/tables", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || "Failed to create table");
  }
  return res.json();
}

export interface TableUpdateInput {
  section?: string;
  seats?: number;
  name?: string;
  status?: TableStatus;
  occupiedSince?: number | null;
}

export async function updateTable(id: string, payload: TableUpdateInput): Promise<void> {
  const res = await fetch(`/api/tables/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || "Failed to update table");
  }
}

export async function deleteTable(id: string): Promise<void> {
  const res = await fetch(`/api/tables/${encodeURIComponent(id)}`, { method: "DELETE" });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || "Failed to delete table");
  }
}

export async function fetchOrderForTable(tableId: string): Promise<OrderRecord | null> {
  const res = await fetch(`/api/orders?tableId=${encodeURIComponent(tableId)}`);
  if (!res.ok) throw new Error("Failed to load order");
  return res.json();
}

export interface SaveOrderPayload {
  tableId: string;
  status: OrderStatus;
  serveSection: ServeSection;
  customerName: string;
  customerPhone: string;
  items: CartItem[];
}

export async function saveOrder(payload: SaveOrderPayload): Promise<{ id: number }> {
  const res = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to save order");
  return res.json();
}
