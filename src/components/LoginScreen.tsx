"use client";

import { CSSProperties, useState } from "react";
import { colors } from "@/lib/colors";
import type { Role } from "@/lib/types";

interface Props {
  onLogin: (role: Role, username: string) => void;
}

export default function LoginScreen({ onLogin }: Props) {
  const [role, setRole] = useState<Role>("waiter");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const roleLabel = role === "admin" ? "Admin" : "Waiter";

  const tabBase: CSSProperties = {
    flex: 1,
    padding: "9px",
    border: "none",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: 700,
    cursor: "pointer",
  };

  const tabStyle = (r: Role): CSSProperties => ({
    ...tabBase,
    background: role === r ? "white" : "transparent",
    color: role === r ? colors.dark : colors.muted,
    boxShadow: role === r ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
  });

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(180deg, oklch(0.985 0.004 250), white)",
        padding: "32px",
        gap: "28px",
        minHeight: "100vh",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            background: colors.accent,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: 26,
            fontWeight: 800,
          }}
        >
          A
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color: colors.dark }}>Hotel ABC</div>
        <div style={{ fontSize: 13, color: colors.muted }}>Ordering &amp; Billing</div>
      </div>

      <div
        style={{
          width: "100%",
          maxWidth: 340,
          display: "flex",
          flexDirection: "column",
          gap: 16,
          background: "white",
          border: `1px solid ${colors.border}`,
          borderRadius: 16,
          padding: 24,
          boxShadow: "0 8px 24px oklch(0.2 0.02 260 / 0.06)",
        }}
      >
        <div style={{ display: "flex", background: colors.panelBg, borderRadius: 10, padding: 4 }}>
          <button style={tabStyle("waiter")} onClick={() => setRole("waiter")}>
            Waiter
          </button>
          <button style={tabStyle("admin")} onClick={() => setRole("admin")}>
            Admin
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <label style={{ display: "flex", flexDirection: "column", gap: 5, fontSize: 12, fontWeight: 600, color: colors.muted }}>
            Username
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={`${role}1`}
              style={{
                padding: "11px 12px",
                borderRadius: 9,
                border: `1px solid ${colors.border}`,
                fontSize: 14,
                outline: "none",
              }}
            />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 5, fontSize: 12, fontWeight: 600, color: colors.muted }}>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              style={{
                padding: "11px 12px",
                borderRadius: 9,
                border: `1px solid ${colors.border}`,
                fontSize: 14,
                outline: "none",
              }}
            />
          </label>
        </div>

        <button
          onClick={() => onLogin(role, username)}
          style={{
            padding: 13,
            border: "none",
            borderRadius: 10,
            background: colors.accent,
            color: "white",
            fontWeight: 700,
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          Log In as {roleLabel}
        </button>
        <div style={{ fontSize: 11, color: colors.mutedLighter, textAlign: "center" }}>
          Any username / password works in this prototype
        </div>
      </div>
    </div>
  );
}
