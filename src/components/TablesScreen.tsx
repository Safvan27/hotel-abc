"use client";

import { useEffect, useState } from "react";
import { colors, statusColors } from "@/lib/colors";
import type { HotelTable, Role, TableStatus } from "@/lib/types";

const STATUS_FILTERS: { value: TableStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "free", label: "Free" },
  { value: "occupied", label: "Occupied" },
  { value: "billing", label: "Ready to Bill" },
];

interface Props {
  tables: HotelTable[];
  sections: string[];
  role: Role;
  userDisplay: string;
  onOpenTable: (table: HotelTable) => void;
  onGoAdmin: () => void;
  onLogout: () => void;
}

function formatOccupiedDuration(since: number, now: number) {
  const mins = Math.max(0, Math.floor((now - since) / 60000));
  if (mins < 60) return mins + "m";
  const hrs = Math.floor(mins / 60);
  const rem = mins % 60;
  return hrs + "h " + rem + "m";
}

function SeatIcon({ color }: { color: string }) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function ClockIcon({ color }: { color: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}

export default function TablesScreen({ tables, sections, role, userDisplay, onOpenTable, onGoAdmin, onLogout }: Props) {
  const [sectionFilter, setSectionFilter] = useState(sections[0] ?? "");
  const [statusFilter, setStatusFilter] = useState<TableStatus | "all">("all");
  const [now, setNow] = useState(() => Date.now());
  const activeSection = sections.includes(sectionFilter) ? sectionFilter : (sections[0] ?? "");
  const sectionTables = tables.filter((t) => t.section === activeSection);
  const visibleTables = statusFilter === "all" ? sectionTables : sectionTables.filter((t) => t.status === statusFilter);
  const roleLabel = role === "admin" ? "Admin" : "Waiter";

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <div
        style={{
          flex: "none",
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "14px 18px",
          background: colors.accent,
          color: "white",
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 9,
            background: "rgba(255,255,255,0.18)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
          }}
        >
          A
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontWeight: 700, fontSize: 14 }}>Hotel ABC</div>
          <div style={{ fontSize: 11, opacity: 0.85 }}>
            {userDisplay} &middot; {roleLabel}
          </div>
        </div>
        {role === "admin" && (
          <button
            onClick={onGoAdmin}
            style={{
              marginLeft: "auto",
              padding: "8px 14px",
              border: "none",
              borderRadius: 8,
              background: "rgba(255,255,255,0.18)",
              color: "white",
              fontWeight: 600,
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            Admin Dashboard
          </button>
        )}
        <button
          onClick={onLogout}
          style={{
            marginLeft: role === "admin" ? 0 : "auto",
            padding: "8px 14px",
            border: "none",
            borderRadius: 8,
            background: "rgba(255,255,255,0.12)",
            color: "white",
            fontWeight: 600,
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          Log Out
        </button>
      </div>

      <div style={{ flex: "none", display: "flex", gap: 8, padding: "12px 18px 0", overflowX: "auto" }}>
        {sections.map((sec) => (
          <button
            key={sec}
            onClick={() => setSectionFilter(sec)}
            style={{
              padding: "9px 16px",
              borderRadius: 9,
              fontSize: "12.5px",
              fontWeight: 700,
              cursor: "pointer",
              whiteSpace: "nowrap",
              background: activeSection === sec ? colors.accent : "white",
              color: activeSection === sec ? "white" : "oklch(0.35 0.02 260)",
              border: activeSection === sec ? "none" : `1px solid ${colors.border}`,
            }}
          >
            {sec}
          </button>
        ))}
      </div>

      <div style={{ flex: "none", display: "flex", gap: 8, padding: "12px 18px 0", overflowX: "auto" }}>
        {STATUS_FILTERS.map((f) => {
          const active = statusFilter === f.value;
          const count = f.value === "all" ? sectionTables.length : sectionTables.filter((t) => t.status === f.value).length;
          const dotColor = f.value === "all" ? colors.muted : statusColors[f.value].dot;
          return (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "7px 12px",
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                whiteSpace: "nowrap",
                background: active ? colors.panelBg : "white",
                color: active ? colors.text : colors.muted,
                border: `1px solid ${active ? colors.accent : colors.border}`,
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: dotColor, flex: "none" }} />
              {f.label}
              <span style={{ fontWeight: 700, opacity: 0.6 }}>{count}</span>
            </button>
          );
        })}
      </div>

      <div style={{ flex: 1, overflow: "auto", padding: "16px 18px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(158px,1fr))", gap: 14 }}>
          {visibleTables.map((tbl) => {
            const sc = statusColors[tbl.status];
            return (
              <button
                key={tbl.id}
                onClick={() => onOpenTable(tbl)}
                className="table-card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  minHeight: 122,
                  padding: "14px 16px 12px",
                  borderRadius: 14,
                  border: `1px solid ${colors.border}`,
                  borderLeft: `4px solid ${sc.dot}`,
                  background: "white",
                  boxShadow: "0 1px 2px oklch(0.2 0.02 260 / 0.06)",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                  <div style={{ fontSize: 19, fontWeight: 800, color: colors.text, lineHeight: 1.15 }}>
                    Table {tbl.num}
                  </div>
                  <span
                    style={{
                      width: 9,
                      height: 9,
                      borderRadius: "50%",
                      background: sc.dot,
                      marginTop: 6,
                      flex: "none",
                    }}
                  />
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: colors.muted }}>
                  <SeatIcon color={colors.mutedLighter} />
                  {tbl.seats} seats
                </div>

                <div
                  style={{
                    marginTop: "auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 8,
                    paddingTop: 6,
                  }}
                >
                  <span
                    style={{
                      fontSize: 10.5,
                      fontWeight: 700,
                      padding: "3px 10px",
                      borderRadius: 20,
                      background: sc.bg,
                      color: sc.dot,
                    }}
                  >
                    {sc.label}
                  </span>
                  {tbl.status !== "free" && tbl.occupiedSince && (
                    <span
                      style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 10.5, fontWeight: 600, color: colors.mutedLight }}
                      suppressHydrationWarning
                    >
                      <ClockIcon color={colors.mutedLight} />
                      {formatOccupiedDuration(tbl.occupiedSince, now)}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
