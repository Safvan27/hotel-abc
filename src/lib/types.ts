export type Screen = "login" | "tables" | "order" | "admin";
export type Role = "waiter" | "admin";
export type TableStatus = "free" | "occupied" | "billing";
export type ServeSection = "Dine In" | "Parcel" | "Delivery";
export type InvoiceTab = "invoice" | "customer" | "held" | "transactions";
export type AdminTab = "overview" | "menu" | "tables" | "staff" | "reports";

export interface Category {
  id: string;
  label: string;
}

export interface MenuItem {
  id: string;
  cat: string;
  name: string;
  price: number;
}

export interface HotelTable {
  id: string;
  num: number;
  section: string;
  seats: number;
  status: TableStatus;
}

export interface CartItem {
  cartId: string;
  itemId: string;
  name: string;
  price: number;
  qty: number;
  note: string;
}
