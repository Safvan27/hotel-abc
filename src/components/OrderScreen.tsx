"use client";

import { useState } from "react";
import { colors } from "@/lib/colors";
import type { CartItem, Category, HotelTable, MenuItem, ServeSection } from "@/lib/types";
import InvoicePanel from "./InvoicePanel";

interface Props {
  table: HotelTable;
  items: MenuItem[];
  categories: Category[];
  cart: CartItem[];
  serveSection: ServeSection;
  customerName: string;
  isNarrow: boolean;
  onBack: () => void;
  onServeSectionChange: (val: ServeSection) => void;
  onAddToCart: (itemId: string) => void;
  onIncQty: (cartId: string) => void;
  onDecQty: (cartId: string) => void;
  onOpenNote: (itemId: string) => void;
  onOpenCustomer: () => void;
  onHold: () => void;
  onSend: () => void;
  onPrint: () => void;
  onCancel: () => void;
}

export default function OrderScreen({
  table,
  items,
  categories,
  cart,
  serveSection,
  customerName,
  isNarrow,
  onBack,
  onServeSectionChange,
  onAddToCart,
  onIncQty,
  onDecQty,
  onOpenNote,
  onOpenCustomer,
  onHold,
  onSend,
  onPrint,
  onCancel,
}: Props) {
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id ?? "");
  const [search, setSearch] = useState("");
  const [cartOpen, setCartOpen] = useState(false);

  const q = search.trim().toLowerCase();
  const catItems = items.filter((it) => it.cat === activeCategory);
  const filteredItems = q ? items.filter((it) => it.name.toLowerCase().includes(q)) : catItems;

  const subtotal = cart.reduce((sum, c) => sum + c.price * c.qty, 0);
  const total = subtotal * 1.05;
  const cartCount = cart.reduce((sum, c) => sum + c.qty, 0);

  const invoiceProps = {
    cart,
    serveSection,
    customerName,
    onOpenCustomer,
    onIncQty,
    onDecQty,
    onHold: () => {
      onHold();
      setCartOpen(false);
    },
    onSend: () => {
      onSend();
      setCartOpen(false);
    },
    onPrint,
    onCancel: () => {
      onCancel();
      setCartOpen(false);
    },
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <div
        style={{
          flex: "none",
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "12px 16px",
          background: "white",
          borderBottom: `1px solid ${colors.borderLight}`,
        }}
      >
        <button
          onClick={onBack}
          style={{
            width: 36,
            height: 36,
            borderRadius: 9,
            border: `1px solid ${colors.border}`,
            background: "white",
            fontSize: 16,
            cursor: "pointer",
          }}
        >
          &larr;
        </button>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontWeight: 800, fontSize: 14 }}>Table {table.num}</div>
          <div style={{ fontSize: 11, color: colors.muted }}>{table.section}</div>
        </div>
        <select
          value={serveSection}
          onChange={(e) => onServeSectionChange(e.target.value as ServeSection)}
          style={{
            marginLeft: "auto",
            padding: "8px 10px",
            borderRadius: 8,
            border: `1px solid ${colors.border}`,
            fontSize: 12,
            fontWeight: 600,
            background: colors.panelBgAlt,
          }}
        >
          <option value="Dine In">Dine In</option>
          <option value="Parcel">Parcel</option>
          <option value="Delivery">Delivery</option>
        </select>
      </div>

      <div style={{ flex: "none", padding: "10px 16px 0" }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search items…"
          style={{
            width: "100%",
            padding: "10px 14px",
            borderRadius: 10,
            border: `1px solid ${colors.border}`,
            fontSize: 13,
            outline: "none",
          }}
        />
      </div>

      <div style={{ flex: "none", display: "flex", gap: 8, padding: "12px 16px 0", overflowX: "auto" }}>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            style={{
              padding: "9px 15px",
              borderRadius: 20,
              border: "none",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              whiteSpace: "nowrap",
              background: activeCategory === cat.id ? colors.accent : colors.panelBg,
              color: activeCategory === cat.id ? "white" : "oklch(0.4 0.02 260)",
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
        <div style={{ flex: 1, overflow: "auto", padding: "14px 16px 100px", minWidth: 280 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(128px,1fr))", gap: 12 }}>
            {filteredItems.map((it) => {
              const inCartEntry = cart.find((c) => c.itemId === it.id);
              return (
                <div
                  key={it.id}
                  style={{
                    background: "white",
                    border: `1px solid ${colors.borderLight}`,
                    borderRadius: 12,
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: "0 1px 2px oklch(0.2 0.02 260 / 0.04)",
                  }}
                >
                  <div
                    style={{
                      height: 72,
                      background:
                        "repeating-linear-gradient(135deg, oklch(0.95 0.01 250), oklch(0.95 0.01 250) 10px, oklch(0.97 0.006 250) 10px, oklch(0.97 0.006 250) 20px)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 20,
                      fontWeight: 800,
                      color: "oklch(0.75 0.02 250)",
                      fontFamily: "ui-monospace, monospace",
                    }}
                  >
                    {it.name.slice(0, 1)}
                  </div>
                  <div style={{ padding: "9px 10px 4px", fontSize: "12.5px", fontWeight: 700, lineHeight: 1.25, minHeight: 32 }}>
                    {it.name}
                  </div>
                  <div style={{ padding: "0 10px", fontSize: "12.5px", fontWeight: 700, color: "oklch(0.5 0.15 250)" }}>
                    &#8377;{it.price}
                  </div>
                  <div style={{ display: "flex", gap: 6, padding: "8px 10px 10px" }}>
                    <button
                      onClick={() => onAddToCart(it.id)}
                      style={{
                        flex: 1,
                        padding: 8,
                        border: "none",
                        borderRadius: 8,
                        background: colors.accent,
                        color: "white",
                        fontWeight: 700,
                        fontSize: 12,
                        cursor: "pointer",
                      }}
                    >
                      {inCartEntry ? `In cart · ${inCartEntry.qty}` : "Add"}
                    </button>
                    {inCartEntry && (
                      <button
                        onClick={() => onOpenNote(it.id)}
                        title="Add note"
                        style={{
                          width: 34,
                          border: `1px solid ${colors.border}`,
                          borderRadius: 8,
                          background: "white",
                          fontSize: 13,
                          cursor: "pointer",
                        }}
                      >
                        &#9998;
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {isNarrow ? (
          <>
            {cartOpen && (
              <div
                style={{
                  position: "fixed",
                  inset: 0,
                  background: "rgba(0,0,0,0.35)",
                  zIndex: 40,
                  display: "flex",
                  alignItems: "flex-end",
                }}
                onClick={() => setCartOpen(false)}
              >
                <div
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    width: "100%",
                    maxHeight: "88%",
                    background: "white",
                    borderRadius: "18px 18px 0 0",
                    display: "flex",
                    flexDirection: "column",
                    animation: "slideUp 0.25s ease",
                    boxShadow: "0 -8px 30px rgba(0,0,0,0.2)",
                  }}
                >
                  <InvoicePanel {...invoiceProps} isNarrow onClose={() => setCartOpen(false)} />
                </div>
              </div>
            )}
            <button
              onClick={() => setCartOpen(true)}
              style={{
                position: "fixed",
                right: 18,
                bottom: 18,
                zIndex: 30,
                padding: "14px 20px",
                border: "none",
                borderRadius: 30,
                background: colors.accent,
                color: "white",
                fontWeight: 800,
                fontSize: 14,
                boxShadow: "0 8px 20px oklch(0.2 0.02 260 / 0.25)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span>&#128722; {cartCount}</span>
              <span>&#8377;{total.toFixed(2)}</span>
            </button>
          </>
        ) : (
          <div
            style={{
              width: 360,
              flex: "none",
              background: "white",
              borderLeft: `1px solid ${colors.borderLight}`,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <InvoicePanel {...invoiceProps} isNarrow={false} onClose={() => {}} />
          </div>
        )}
      </div>
    </div>
  );
}
