"use client";

import { useEffect, useState } from "react";
import { useIsNarrow } from "@/hooks/useIsNarrow";
import { fetchCategories, fetchItems, fetchOrderForTable, fetchSections, fetchTables, saveOrder } from "@/lib/api";
import type { CartItem, Category, HotelTable, MenuItem, OrderStatus, Role, Screen, ServeSection } from "@/lib/types";
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
  const [tables, setTables] = useState<HotelTable[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [sections, setSections] = useState<string[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [dataError, setDataError] = useState<string | null>(null);
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

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [t, i, c, s] = await Promise.all([fetchTables(), fetchItems(), fetchCategories(), fetchSections()]);
        if (cancelled) return;
        setTables(t);
        setItems(i);
        setCategories(c);
        setSections(s);
        setDataLoaded(true);
      } catch (err) {
        if (cancelled) return;
        setDataError(err instanceof Error ? err.message : "Failed to load data");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

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

  const handleOpenTable = async (tbl: HotelTable) => {
    setScreen("order");
    setSelectedTableId(tbl.id);
    setTables((ts) =>
      ts.map((t) => (t.id === tbl.id ? { ...t, status: "occupied", occupiedSince: t.occupiedSince ?? Date.now() } : t))
    );

    const existing = await fetchOrderForTable(tbl.id).catch(() => null);
    if (existing) {
      setCart(existing.items);
      setServeSection(existing.serveSection);
      setCustomerName(existing.customerName);
      setCustomerPhone(existing.customerPhone);
    } else {
      setCart([]);
      setServeSection("Dine In");
      setCustomerName("");
      setCustomerPhone("");
    }
  };

  const persistOrder = (status: OrderStatus) => {
    if (!selectedTableId) return Promise.resolve();
    return saveOrder({ tableId: selectedTableId, status, serveSection, customerName, customerPhone, items: cart });
  };

  const handleAddToCart = (itemId: string) => {
    const item = items.find((i) => i.id === itemId);
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

  const holdOrder = async () => {
    await persistOrder("held");
    showToast("Order held for Table " + (selectedTable ? selectedTable.num : ""));
    setScreen("tables");
  };
  const sendOrder = async () => {
    if (cart.length === 0) {
      showToast("Add items before sending to kitchen");
      return;
    }
    await persistOrder("sent");
    showToast("Sent to kitchen • KOT printed");
  };
  const cancelOrder = async () => {
    await persistOrder("cancelled");
    setCart([]);
    setTables((ts) => ts.map((t) => (t.id === selectedTableId ? { ...t, status: "free", occupiedSince: undefined } : t)));
    showToast("Order cancelled");
  };
  const printBill = async () => {
    if (cart.length === 0) {
      showToast("Add items before printing");
      return;
    }
    await persistOrder("billing");
    setTables((ts) => ts.map((t) => (t.id === selectedTableId ? { ...t, status: "billing" } : t)));
    showToast("Bill sent to printer");
  };

  const noteItem = noteItemId ? items.find((i) => i.id === noteItemId) : null;

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

      {screen !== "login" && dataError && (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center" }}>
          Failed to load data from the server: {dataError}
        </div>
      )}

      {screen !== "login" && !dataLoaded && !dataError && (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>Loading…</div>
      )}

      {screen === "tables" && role && dataLoaded && (
        <TablesScreen
          tables={tables}
          sections={sections}
          role={role}
          userDisplay={userDisplay}
          onOpenTable={handleOpenTable}
          onGoAdmin={() => setScreen("admin")}
          onLogout={handleLogout}
        />
      )}

      {screen === "order" && selectedTable && dataLoaded && (
        <OrderScreen
          table={selectedTable}
          items={items}
          categories={categories}
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

      {screen === "admin" && dataLoaded && (
        <AdminScreen
          isNarrow={isNarrow}
          tables={tables}
          items={items}
          categories={categories}
          sections={sections}
          onBackToTables={() => setScreen("tables")}
        />
      )}

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
