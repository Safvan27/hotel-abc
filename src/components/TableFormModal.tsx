"use client";

import { useState } from "react";
import { colors } from "@/lib/colors";
import type { TableInput } from "@/lib/api";

interface Props {
  title: string;
  submitLabel: string;
  sections: string[];
  initialSection: string;
  initialSeats: number;
  initialName: string;
  onClose: () => void;
  onSubmit: (input: TableInput) => Promise<void>;
}

export default function TableFormModal({
  title,
  submitLabel,
  sections,
  initialSection,
  initialSeats,
  initialName,
  onClose,
  onSubmit,
}: Props) {
  const [section, setSection] = useState(initialSection);
  const [seats, setSeats] = useState(String(initialSeats));
  const [name, setName] = useState(initialName);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    const seatsNum = Number(seats);
    if (!section) {
      setError("Choose a section");
      return;
    }
    if (!Number.isInteger(seatsNum) || seatsNum < 1) {
      setError("Seats must be a positive number");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await onSubmit({ section, seats: seatsNum, name: name.trim() });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

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
        <div style={{ fontWeight: 800, fontSize: 15 }}>{title}</div>

        <label style={{ display: "flex", flexDirection: "column", gap: 5, fontSize: 12, fontWeight: 600, color: colors.muted }}>
          Section
          <select
            value={section}
            onChange={(e) => setSection(e.target.value)}
            style={{ padding: "10px 12px", borderRadius: 9, border: `1px solid ${colors.border}`, fontSize: 13, outline: "none", background: "white" }}
          >
            {sections.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: 5, fontSize: 12, fontWeight: 600, color: colors.muted }}>
          Number of people
          <input
            type="number"
            min={1}
            value={seats}
            onChange={(e) => setSeats(e.target.value)}
            style={{ padding: "10px 12px", borderRadius: 9, border: `1px solid ${colors.border}`, fontSize: 13, outline: "none" }}
          />
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: 5, fontSize: 12, fontWeight: 600, color: colors.muted }}>
          Name (optional)
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Patio VIP"
            style={{ padding: "10px 12px", borderRadius: 9, border: `1px solid ${colors.border}`, fontSize: 13, outline: "none" }}
          />
        </label>

        {error && <div style={{ fontSize: 12, color: colors.danger, fontWeight: 700 }}>{error}</div>}

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: 11,
              borderRadius: 9,
              border: `1px solid ${colors.border}`,
              background: "white",
              color: colors.muted,
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            style={{
              flex: 1,
              padding: 11,
              borderRadius: 9,
              border: "none",
              background: colors.accent,
              color: "white",
              fontWeight: 700,
              fontSize: 13,
              cursor: submitting ? "default" : "pointer",
              opacity: submitting ? 0.7 : 1,
            }}
          >
            {submitting ? "Saving…" : submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
