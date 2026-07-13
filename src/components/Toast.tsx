"use client";

interface Props {
  message: string;
}

export default function Toast({ message }: Props) {
  if (!message) return null;
  return (
    <div
      style={{
        position: "fixed",
        left: "50%",
        bottom: 28,
        transform: "translateX(-50%)",
        zIndex: 200,
        background: "oklch(0.2 0.02 260)",
        color: "white",
        padding: "12px 20px",
        borderRadius: 10,
        fontSize: 13,
        fontWeight: 600,
        animation: "fadeIn 0.2s ease",
        boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
      }}
    >
      {message}
    </div>
  );
}
