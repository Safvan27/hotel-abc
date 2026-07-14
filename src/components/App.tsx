"use client";

import { useState } from "react";
import { useIsNarrow } from "@/hooks/useIsNarrow";
import { ITEMS, TABLES } from "@/lib/data";
import type { CartItem, HotelTable, Role, Screen, ServeSection } from "@/lib/types";
import LoginScreen from "./LoginScreen";
import TablesScreen from "./TablesScreen";
import OrderScreen from "./OrderScreen";
import AdminScreen from "./AdminScreen";
import NoteModal from "./NoteModal";
import CustomerModal from "./CustomerModal";
import Toast from "./Toast";

export default function App() {
  const isNarrow = useIsNarrow();

  const [screen, setScreen] = useState<Screen>("login");
  const [role, setRole] = useState<Role | null>(null);
  const [userDisplay, setUserDisplay] = useState("");
  const [tables, setTables] = useState<HotelTable[]>(TABLES);
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [serveSection, setServeSection] = useState<ServeSection>("Dine In");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [noteItemId, setNoteItemId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState("");
  const [customerOpen, setCustomerOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [toastMsg, setToastMsg] = useState("");
  const [toastTimer, setToastTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    if (toastTimer) clearTimeout(toastTimer);
    const t = setTimeout(() => setToastMsg(""), 1800);
    setToastTimer(t);
  };

  const selectedTable = tables.find((t) => t.id === selectedTableId) || null;

  const handleLogin = (r: Role, username: string) => {
    setRole(r);
    setUserDisplay(username || (r === "admin" ? "Admin" : "Waiter Raj"));
    setScreen("tables");
  };

  const handleLogout = () => {
    setScreen("login");
    setRole(null);
    setUserDisplay("");
    setSelectedTableId(null);
    setCart([]);
  };

  const handleOpenTable = (tbl: HotelTable) => {
    setScreen("order");
    setSelectedTableId(tbl.id);
    setCart([]);
    setTables((ts) =>
      ts.map((t) => (t.id === tbl.id ? { ...t, status: "occupied", occupiedSince: t.occupiedSince ?? Date.now() } : t))
    );
  };

  const handleAddToCart = (itemId: string) => {
    const item = ITEMS.find((i) => i.id === itemId);
    if (!item) return;
    setCart((c) => {
      const existing = c.find((ci) => ci.itemId === item.id && !ci.note);
      if (existing) {
        return c.map((ci) => (ci === existing ? { ...ci, qty: ci.qty + 1 } : ci));
      }
      return [...c, { cartId: item.id + "-" + Date.now(), itemId: item.id, name: item.name, price: item.price, qty: 1, note: "" }];
    });
  };

  const incQty = (cartId: string) => {
    setCart((c) => c.map((ci) => (ci.cartId === cartId ? { ...ci, qty: ci.qty + 1 } : ci)));
  };
  const decQty = (cartId: string) => {
    setCart((c) => c.map((ci) => (ci.cartId === cartId ? { ...ci, qty: Math.max(0, ci.qty - 1) } : ci)).filter((ci) => ci.qty > 0));
  };

  const openNote = (itemId: string) => {
    const existing = cart.find((c) => c.itemId === itemId);
    setNoteItemId(itemId);
    setNoteDraft(existing ? existing.note : "");
  };
  const closeNote = () => {
    setNoteItemId(null);
    setNoteDraft("");
  };
  const saveNote = () => {
    setCart((c) => c.map((ci) => (ci.itemId === noteItemId ? { ...ci, note: noteDraft } : ci)));
    setNoteItemId(null);
    setNoteDraft("");
  };

  const holdOrder = () => {
    showToast("Order held for Table " + (selectedTable ? selectedTable.num : ""));
    setScreen("tables");
  };
  const sendOrder = () => {
    if (cart.length === 0) {
      showToast("Add items before sending to kitchen");
      return;
    }
    showToast("Sent to kitchen • KOT printed");
  };
  const cancelOrder = () => {
    setCart([]);
    setTables((ts) => ts.map((t) => (t.id === selectedTableId ? { ...t, status: "free", occupiedSince: undefined } : t)));
    showToast("Order cancelled");
  };
  const printBill = () => {
    if (cart.length === 0) {
      showToast("Add items before printing");
      return;
    }
    setTables((ts) => ts.map((t) => (t.id === selectedTableId ? { ...t, status: "billing" } : t)));
    showToast("Bill sent to printer");
  };

  const noteItem = noteItemId ? ITEMS.find((i) => i.id === noteItemId) : null;

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        background: "white",
        fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif",
        color: "oklch(0.22 0.02 260)",
      }}
    >
      {screen === "login" && <LoginScreen onLogin={handleLogin} />}

      {screen === "tables" && role && (
        <TablesScreen
          tables={tables}
          role={role}
          userDisplay={userDisplay}
          onOpenTable={handleOpenTable}
          onGoAdmin={() => setScreen("admin")}
          onLogout={handleLogout}
        />
      )}

      {screen === "order" && selectedTable && (
        <OrderScreen
          table={selectedTable}
          cart={cart}
          serveSection={serveSection}
          customerName={customerName}
          isNarrow={isNarrow}
          onBack={() => setScreen("tables")}
          onServeSectionChange={setServeSection}
          onAddToCart={handleAddToCart}
          onIncQty={incQty}
          onDecQty={decQty}
          onOpenNote={openNote}
          onOpenCustomer={() => setCustomerOpen(true)}
          onHold={holdOrder}
          onSend={sendOrder}
          onPrint={printBill}
          onCancel={cancelOrder}
        />
      )}

      {screen === "admin" && <AdminScreen isNarrow={isNarrow} onBackToTables={() => setScreen("tables")} />}

      {noteItem && (
        <NoteModal itemName={noteItem.name} draft={noteDraft} onDraftChange={setNoteDraft} onClose={closeNote} onSave={saveNote} />
      )}

      {customerOpen && (
        <CustomerModal
          name={customerName}
          phone={customerPhone}
          onNameChange={setCustomerName}
          onPhoneChange={setCustomerPhone}
          onClose={() => setCustomerOpen(false)}
        />
      )}

      <Toast message={toastMsg} />
    </div>
  );
}
