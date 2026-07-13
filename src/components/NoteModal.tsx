"use client";

import { colors } from "@/lib/colors";
import { NOTE_CHIPS } from "@/lib/data";

interface Props {
  itemName: string;
  draft: string;
  onDraftChange: (val: string) => void;
  onClose: () => void;
  onSave: () => void;
}

export default function NoteModal({ itemName, draft, onDraftChange, onClose, onSave }: Props) {
  const activeChips = draft.split(", ").filter(Boolean);

  const toggleChip = (label: string) => {
    const has = activeChips.includes(label);
    const next = has ? activeChips.filter((p) => p !== label) : [...activeChips, label];
    onDraftChange(next.join(", "));
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
          maxWidth: 380,
          background: "white",
          borderRadius: 16,
          padding: 20,
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <div style={{ fontWeight: 800, fontSize: 15 }}>Special instructions</div>
        <div style={{ fontSize: 12, color: colors.muted, marginTop: -8 }}>{itemName}</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {NOTE_CHIPS.map((label) => {
            const active = activeChips.includes(label);
            return (
              <button
                key={label}
                onClick={() => toggleChip(label)}
                style={{
                  padding: "7px 12px",
                  borderRadius: 20,
                  border: active ? "none" : `1px solid ${colors.border}`,
                  background: active ? colors.accent : "white",
                  color: active ? "white" : "oklch(0.4 0.02 260)",
                  fontSize: "11.5px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
        <textarea
          value={draft}
          onChange={(e) => onDraftChange(e.target.value)}
          placeholder="Add a custom note…"
          style={{
            width: "100%",
            minHeight: 64,
            padding: "10px 12px",
            borderRadius: 10,
            border: `1px solid ${colors.border}`,
            fontSize: 13,
            fontFamily: "inherit",
            outline: "none",
            resize: "vertical",
          }}
        />
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: 11,
              borderRadius: 9,
              border: `1px solid ${colors.border}`,
              background: "white",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            style={{
              flex: 1,
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
            Save Note
          </button>
        </div>
      </div>
    </div>
  );
}
