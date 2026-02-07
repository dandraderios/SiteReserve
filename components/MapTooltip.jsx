"use client";

export default function MapTooltip({ site, pos }) {
  if (!site) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: pos.y + 12,
        left: pos.x + 12,
        background: "#111827",
        color: "#fff",
        padding: "8px 12px",
        borderRadius: 8,
        fontSize: 12,
        pointerEvents: "none",
        zIndex: 100,
      }}
    >
      <b>{site.name}</b>
      <br />${site.price.toLocaleString("es-CL")}
    </div>
  );
}
