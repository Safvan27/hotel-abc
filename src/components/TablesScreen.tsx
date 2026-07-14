"use client";

import { useEffect, useState } from "react";
import { colors, statusColors } from "@/lib/colors";
import { SECTIONS } from "@/lib/data";
import type { HotelTable, Role } from "@/lib/types";

interface Props {
  tables: HotelTable[];
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

export default function TablesScreen({ tables, role, userDisplay, onOpenTable, onGoAdmin, onLogout }: Props) {
  const [sectionFilter, setSectionFilter] = useState(SECTIONS[0]);
  const [now, setNow] = useState(() => Date.now());
  const visibleTables = tables.filter((t) => t.section === sectionFilter);
  const roleLabel = role === "admin" ? "Admin" : "Waiter";

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(id);
  }, []);

  const legendDot = (color: string) => (
    <span style={{ width: 10, height: 10, borderRadius: "50%", background: color, display: "inline-block" }} />
  );

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
        {SECTIONS.map((sec) => (
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
              background: sectionFilter === sec ? colors.accent : "white",
              color: sectionFilter === sec ? "white" : "oklch(0.35 0.02 260)",
              border: sectionFilter === sec ? "none" : `1px solid ${colors.border}`,
            }}
          >
            {sec}
          </button>
        ))}
      </div>

      <div style={{ flex: "none", display: "flex", gap: 14, padding: "14px 18px 0", fontSize: 12, color: colors.muted }}>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {legendDot(statusColors.free.dot)}Free
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {legendDot(statusColors.occupied.dot)}Occupied
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {legendDot(statusColors.billing.dot)}Ready to Bill
        </span>
      </div>

      <div style={{ flex: 1, overflow: "auto", padding: "16px 18px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(120px,1fr))", gap: 12 }}>
          {visibleTables.map((tbl) => {
            const sc = statusColors[tbl.status];
            return (
              <button
                key={tbl.id}
                onClick={() => onOpenTable(tbl)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: 4,
                  padding: 14,
                  borderRadius: 12,
                  border: `1.5px solid ${sc.border}`,
                  background: sc.bg,
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <div style={{ fontSize: 18, fontWeight: 800 }}>Table {tbl.num}</div>
                <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.8 }}>{tbl.seats} seats</div>
                <div
                  style={{
                    marginTop: 4,
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "2px 8px",
                    borderRadius: 20,
                    background: sc.dot,
                    color: "white",
                  }}
                >
                  {sc.label}
                </div>
                {tbl.status !== "free" && tbl.occupiedSince && (
                  <div style={{ fontSize: 10, fontWeight: 600, opacity: 0.7 }}>
                    {formatOccupiedDuration(tbl.occupiedSince, now)}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
