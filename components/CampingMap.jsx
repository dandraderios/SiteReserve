"use client";

export default function CampingMap({
  sites,
  selectedIds = [],
  onHover,
  onLeave,
  onSelect,
}) {
  return (
    <svg
      viewBox="0 0 1200 800"
      style={{
        width: "100%",
        maxWidth: 900,
        background: "#f8fafc",
        borderRadius: 16,
        boxShadow: "0 10px 30px rgba(0,0,0,.1)",
      }}
    >
      {/* TERRENOS */}
      {sites.map((site) => {
        const isSelected = selectedIds.includes(site._id);

        const isBlocked = site.status === "sold" || site.status === "reserved";

        const fill =
          site.status === "sold"
            ? "#6b7280" // vendido
            : site.status === "reserved"
              ? "#9ca3af" // reservado backend
              : isSelected
                ? "#3b82f6" // seleccionado (carrito)
                : "#22c55e"; // disponible

        return (
          <g key={site._id}>
            <rect
              x={site.x}
              y={site.y}
              width={site.w}
              height={site.h}
              rx="6"
              fill={fill}
              stroke="#374151"
              strokeWidth={isSelected ? 3 : 2}
              style={{
                cursor: isBlocked ? "not-allowed" : "pointer",
                transition: "all .15s ease",
              }}
              onMouseMove={
                !isBlocked
                  ? (e) =>
                      onHover(site, {
                        x: e.clientX,
                        y: e.clientY,
                      })
                  : undefined
              }
              onMouseLeave={onLeave}
              onClick={!isBlocked ? () => onSelect(site) : undefined}
              className={!isBlocked ? "site-hover" : ""}
            />

            {/* Código del terreno */}
            <text
              x={site.x + site.w / 2}
              y={site.y + site.h / 2 + 4}
              textAnchor="middle"
              fontSize="12"
              fontWeight="bold"
              fill="#ffffff"
              pointerEvents="none"
            >
              {site.code}
            </text>
          </g>
        );
      })}

      {/* LEYENDA */}
      <g transform="translate(300, 720)" style={{ pointerEvents: "none" }}>
        <rect
          x="0"
          y="0"
          width="600"
          height="50"
          rx="12"
          fill="#ffffff"
          stroke="#e5e7eb"
          strokeWidth="2"
        />

        {/* Disponible */}
        <rect x="30" y="15" width="20" height="20" rx="4" fill="#22c55e" />
        <text x="60" y="30" fontSize="14">
          Disponible
        </text>

        {/* Seleccionado */}
        <rect x="200" y="15" width="20" height="20" rx="4" fill="#3b82f6" />
        <text x="230" y="30" fontSize="14">
          Seleccionado
        </text>

        {/* No disponible */}
        <rect x="400" y="15" width="20" height="20" rx="4" fill="#9ca3af" />
        <text x="430" y="30" fontSize="14">
          No disponible
        </text>
      </g>

      {/* HOVER */}
      <style>{`
        .site-hover:hover {
          filter: brightness(1.15);
        }
      `}</style>
    </svg>
  );
}
