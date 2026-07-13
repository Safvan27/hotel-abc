"use client";

import { colors } from "@/lib/colors";

interface Props {
  name: string;
  phone: string;
  onNameChange: (val: string) => void;
  onPhoneChange: (val: string) => void;
  onClose: () => void;
}

export default function CustomerModal({ name, phone, onNameChange, onPhoneChange, onClose }: Props) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 360,
          background: "white",
          borderRadius: 16,
          padding: 20,
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <div style={{ fontWeight: 800, fontSize: 15 }}>Customer details</div>
        <label style={{ display: "flex", flexDirection: "column", gap: 5, fontSize: 12, fontWeight: 600, color: colors.muted }}>
          Name
          <input
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Walk-in"
            style={{ padding: "10px 12px", borderRadius: 9, border: `1px solid ${colors.border}`, fontSize: 13, outline: "none" }}
          />
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: 5, fontSize: 12, fontWeight: 600, color: colors.muted }}>
          Phone
          <input
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            placeholder="9876543210"
            style={{ padding: "10px 12px", borderRadius: 9, border: `1px solid ${colors.border}`, fontSize: 13, outline: "none" }}
          />
        </label>
        <button
          onClick={onClose}
          style={{
            padding: 11,
            borderRadius: 9,
            border: "none",
            background: colors.accent,
            color: "white",
            fontWeight: 700,
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
}
