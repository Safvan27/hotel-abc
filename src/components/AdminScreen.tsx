"use client";

import { useState } from "react";
import { colors } from "@/lib/colors";
import { CATEGORIES, ITEMS, SECTIONS, TABLES } from "@/lib/data";
import type { AdminTab } from "@/lib/types";

interface Props {
  isNarrow: boolean;
  onBackToTables: () => void;
}

const NAV_ITEMS: { id: AdminTab; label: string; icon: string }[] = [
  { id: "overview", label: "Overview", icon: "▤" },
  { id: "menu", label: "Menu Items", icon: "☰" },
  { id: "tables", label: "Tables & Sections", icon: "⬚" },
  { id: "staff", label: "Staff", icon: "☺" },
  { id: "reports", label: "Reports", icon: "☷" },
];

function Card({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: 14,
        padding: 18,
        border: `1px solid ${colors.borderLight}`,
        display: "flex",
        flexDirection: "column",
        gap: 6,
        minWidth: 150,
        flex: "1 1 150px",
      }}
    >
      <div style={{ fontSize: "11.5px", fontWeight: 700, color: colors.muted, textTransform: "uppercase", letterSpacing: "0.03em" }}>
        {label}
      </div>
      <div style={{ fontSize: 24, fontWeight: 800 }}>{value}</div>
      <div style={{ fontSize: "11.5px", color: colors.green }}>{sub}</div>
    </div>
  );
}

const STAFF: [string, string, string][] = [
  ["Raj Kumar", "Waiter", "Online"],
  ["Priya S", "Waiter", "Online"],
  ["Arun M", "Waiter", "Offline"],
  ["Meena K", "Admin", "Online"],
];

const REPORT_DAYS: [string, number][] = [
  ["Mon", 60],
  ["Tue", 75],
  ["Wed", 50],
  ["Thu", 90],
  ["Fri", 100],
  ["Sat", 85],
  ["Sun", 65],
];

export default function AdminScreen({ isNarrow, onBackToTables }: Props) {
  const [tab, setTab] = useState<AdminTab>("overview");
  const adminWide = !isNarrow;
  const navWidth = adminWide ? 210 : 56;

  return (
    <div style={{ flex: 1, display: "flex", minHeight: "100vh" }}>
      <div
        style={{
          width: navWidth,
          flex: "none",
          background: colors.darker,
          color: "white",
          display: "flex",
          flexDirection: "column",
          padding: "16px 10px",
          gap: 4,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 8px 18px" }}>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: colors.accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              flex: "none",
            }}
          >
            A
          </div>
          <div style={{ display: adminWide ? "inline" : "none", fontWeight: 800, fontSize: 13 }}>Hotel ABC</div>
        </div>
        {NAV_ITEMS.map((nav) => (
          <button
            key={nav.id}
            onClick={() => setTab(nav.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 10px",
              borderRadius: 9,
              border: "none",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
              textAlign: "left",
              background: tab === nav.id ? colors.accent : "transparent",
              color: "white",
            }}
          >
            <span>{nav.icon}</span>
            <span style={{ display: adminWide ? "inline" : "none" }}>{nav.label}</span>
          </button>
        ))}
        <button
          onClick={onBackToTables}
          style={{
            marginTop: "auto",
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 10px",
            borderRadius: 9,
            border: "none",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 600,
            textAlign: "left",
            background: "rgba(255,255,255,0.08)",
            color: "white",
          }}
        >
          <span>&#8592;</span>
          <span style={{ display: adminWide ? "inline" : "none" }}>Table View</span>
        </button>
      </div>

      <div style={{ flex: 1, overflow: "auto", padding: 24, background: colors.panelBgAlt }}>
        {tab === "overview" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ fontSize: 18, fontWeight: 800 }}>Overview</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
              <Card label="Today's Sales" value="&#8377;12,480" sub="+8% vs yesterday" />
              <Card label="Orders Today" value="64" sub="5 in progress" />
              <Card
                label="Active Tables"
                value={`${TABLES.filter((t) => t.status !== "free").length} / ${TABLES.length}`}
                sub="across 4 sections"
              />
              <Card label="Staff Online" value="5" sub="2 admins, 3 waiters" />
            </div>
          </div>
        )}

        {tab === "menu" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ fontSize: 18, fontWeight: 800 }}>Menu Items & Categories</div>
            {CATEGORIES.map((c) => (
              <div key={c.id} style={{ background: "white", borderRadius: 12, border: `1px solid ${colors.borderLight}`, overflow: "hidden" }}>
                <div
                  style={{
                    padding: "12px 16px",
                    fontWeight: 700,
                    fontSize: 13,
                    background: colors.panelBg,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  {c.label}
                  <span style={{ color: colors.mutedLight, fontWeight: 500 }}>
                    {ITEMS.filter((i) => i.cat === c.id).length} items
                  </span>
                </div>
                <div>
                  {ITEMS.filter((i) => i.cat === c.id).map((i) => (
                    <div
                      key={i.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "9px 16px",
                        borderTop: `1px solid ${colors.panelBg}`,
                        fontSize: "12.5px",
                      }}
                    >
                      <span>{i.name}</span>
                      <span style={{ fontWeight: 700 }}>&#8377;{i.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "tables" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ fontSize: 18, fontWeight: 800 }}>Tables & Sections</div>
            {SECTIONS.map((sec) => (
              <div
                key={sec}
                style={{
                  background: "white",
                  borderRadius: 12,
                  border: `1px solid ${colors.borderLight}`,
                  padding: "14px 16px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: "13.5px" }}>{sec}</div>
                  <div style={{ fontSize: "11.5px", color: colors.mutedLight }}>
                    {TABLES.filter((t) => t.section === sec).length} tables
                  </div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: colors.accent }}>Manage</span>
              </div>
            ))}
          </div>
        )}

        {tab === "staff" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ fontSize: 18, fontWeight: 800 }}>Staff Accounts</div>
            <div style={{ background: "white", borderRadius: 12, border: `1px solid ${colors.borderLight}`, overflow: "hidden" }}>
              {STAFF.map((row, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 16px",
                    borderTop: i ? `1px solid ${colors.panelBg}` : "none",
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: "oklch(0.9 0.02 250)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: 12,
                    }}
                  >
                    {row[0][0]}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 13, flex: 1 }}>{row[0]}</div>
                  <div style={{ fontSize: "11.5px", color: colors.mutedLight, width: 60 }}>{row[1]}</div>
                  <span
                    style={{
                      fontSize: "10.5px",
                      fontWeight: 700,
                      padding: "3px 10px",
                      borderRadius: 20,
                      background: row[2] === "Online" ? "oklch(0.92 0.05 150)" : "oklch(0.93 0.006 250)",
                      color: row[2] === "Online" ? "oklch(0.5 0.13 150)" : colors.mutedLight,
                    }}
                  >
                    {row[2]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "reports" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ fontSize: 18, fontWeight: 800 }}>Sales Reports</div>
            <div
              style={{
                background: "white",
                borderRadius: 12,
                border: `1px solid ${colors.borderLight}`,
                padding: 20,
                display: "flex",
                alignItems: "flex-end",
                gap: 14,
                height: 200,
              }}
            >
              {REPORT_DAYS.map(([d, v]) => (
                <div key={d} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                  <div style={{ width: "100%", height: v, background: colors.accent, borderRadius: "6px 6px 0 0" }} />
                  <div style={{ fontSize: 11, fontWeight: 700, color: colors.muted }}>{d}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
