"use client";

import { useState } from "react";
import { colors } from "@/lib/colors";
import type { CartItem, InvoiceTab, ServeSection } from "@/lib/types";

interface Props {
  cart: CartItem[];
  serveSection: ServeSection;
  customerName: string;
  onOpenCustomer: () => void;
  onIncQty: (cartId: string) => void;
  onDecQty: (cartId: string) => void;
  onHold: () => void;
  onSend: () => void;
  onPrint: () => void;
  onCancel: () => void;
  isNarrow: boolean;
  onClose: () => void;
}

const TABS: { id: InvoiceTab; label: string }[] = [
  { id: "invoice", label: "Invoice" },
  { id: "customer", label: "Customer" },
  { id: "held", label: "Held Orders" },
  { id: "transactions", label: "Transactions" },
];

export default function InvoicePanel({
  cart,
  serveSection,
  customerName,
  onOpenCustomer,
  onIncQty,
  onDecQty,
  onHold,
  onSend,
  onPrint,
  onCancel,
  isNarrow,
  onClose,
}: Props) {
  const [tab, setTab] = useState<InvoiceTab>("invoice");

  const subtotal = cart.reduce((sum, c) => sum + c.price * c.qty, 0);
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0 }}>
      <div style={{ flex: "none", display: "flex", gap: 4, padding: "12px 16px 0", overflowX: "auto" }}>
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: "8px 12px",
              border: "none",
              borderBottom: tab === t.id ? `2px solid ${colors.accent}` : "2px solid transparent",
              background: "transparent",
              fontSize: 12,
              fontWeight: 700,
              color: tab === t.id ? colors.accent : colors.muted,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div
        style={{
          flex: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          borderBottom: `1px solid ${colors.borderLighter}`,
        }}
      >
        <button
          onClick={onOpenCustomer}
          style={{
            fontSize: 13,
            fontWeight: 700,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: customerName ? colors.dark : colors.accent,
          }}
        >
          {customerName || "Walk-in · Add customer"}
        </button>
        <span style={{ fontSize: 11, fontWeight: 700, color: colors.muted }}>{serveSection}</span>
      </div>

      {tab === "invoice" ? (
        <>
          <div style={{ flex: 1, overflow: "auto", minHeight: 60 }}>
            {cart.length === 0 ? (
              <div style={{ padding: "40px 16px", textAlign: "center", color: colors.mutedLighter, fontSize: 13 }}>
                No items yet — tap items to add them here
              </div>
            ) : (
              cart.map((c, i) => (
                <div
                  key={c.cartId}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "24px 1fr 60px 60px",
                    gap: 8,
                    alignItems: "center",
                    padding: "10px 16px",
                    borderBottom: `1px solid ${colors.borderLighter}`,
                    fontSize: "12.5px",
                  }}
                >
                  <div style={{ color: colors.mutedLighter }}>{i + 1}</div>
                  <div>
                    <div style={{ fontWeight: 700 }}>{c.name}</div>
                    {c.note && (
                      <div style={{ fontSize: "10.5px", color: colors.accent, fontStyle: "italic", marginTop: 2 }}>
                        {c.note}
                      </div>
                    )}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <button
                      onClick={() => onDecQty(c.cartId)}
                      style={{
                        width: 20,
                        height: 20,
                        border: `1px solid ${colors.border}`,
                        borderRadius: 5,
                        background: "white",
                        cursor: "pointer",
                        fontSize: 11,
                      }}
                    >
                      &minus;
                    </button>
                    <span style={{ fontWeight: 700, minWidth: 14, textAlign: "center" }}>{c.qty}</span>
                    <button
                      onClick={() => onIncQty(c.cartId)}
                      style={{
                        width: 20,
                        height: 20,
                        border: `1px solid ${colors.border}`,
                        borderRadius: 5,
                        background: "white",
                        cursor: "pointer",
                        fontSize: 11,
                      }}
                    >
                      +
                    </button>
                  </div>
                  <div style={{ fontWeight: 700, textAlign: "right" }}>{(c.price * c.qty).toFixed(2)}</div>
                </div>
              ))
            )}
          </div>
          <div
            style={{
              flex: "none",
              padding: "12px 16px",
              borderTop: `1px solid ${colors.borderLighter}`,
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px", color: colors.muted }}>
              <span>Sub Total</span>
              <span>{subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px", color: colors.muted }}>
              <span>Tax (5%)</span>
              <span>{tax.toFixed(2)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 800, marginTop: 4 }}>
              <span>Total</span>
              <span style={{ color: colors.accent }}>&#8377;{total.toFixed(2)}</span>
            </div>
          </div>
          <div style={{ flex: "none", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, padding: "12px 16px 16px" }}>
            <button
              onClick={onHold}
              style={{
                padding: 11,
                borderRadius: 9,
                border: `1px solid ${colors.border}`,
                background: "white",
                fontWeight: 700,
                fontSize: "12.5px",
                cursor: "pointer",
              }}
            >
              Hold Order
            </button>
            <button
              onClick={onSend}
              style={{
                padding: 11,
                borderRadius: 9,
                border: "none",
                background: colors.accent,
                color: "white",
                fontWeight: 700,
                fontSize: "12.5px",
                cursor: "pointer",
              }}
            >
              Send to Kitchen
            </button>
            <button
              onClick={onPrint}
              style={{
                padding: 11,
                borderRadius: 9,
                border: `1px solid ${colors.border}`,
                background: "white",
                fontWeight: 700,
                fontSize: "12.5px",
                cursor: "pointer",
              }}
            >
              Print Bill
            </button>
            <button
              onClick={onCancel}
              style={{
                padding: 11,
                borderRadius: 9,
                border: `1px solid ${colors.dangerBorder}`,
                background: "white",
                color: colors.danger,
                fontWeight: 700,
                fontSize: "12.5px",
                cursor: "pointer",
              }}
            >
              Cancel Order
            </button>
          </div>
        </>
      ) : (
        <div style={{ padding: "30px 16px", textAlign: "center", color: colors.mutedLight, fontSize: 13 }}>
          No records yet in this prototype tab
        </div>
      )}

      {isNarrow && (
        <button
          onClick={onClose}
          style={{
            flex: "none",
            margin: "0 16px 16px",
            padding: 10,
            borderRadius: 9,
            border: "none",
            background: colors.panelBg,
            fontWeight: 700,
            fontSize: "12.5px",
            cursor: "pointer",
          }}
        >
          Close
        </button>
      )}
    </div>
  );
}
