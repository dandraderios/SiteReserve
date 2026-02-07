"use client";

export default function SiteModal({ site, onClose, onAdd }) {
  return (
    <div style={overlay}>
      <div style={modal}>
        <h2>{site.name}</h2>

        <p style={{ color: "#374151", marginBottom: 12 }}>{site.description}</p>

        {site.features?.length > 0 && (
          <ul style={{ marginBottom: 12 }}>
            {site.features.map((f) => (
              <li key={f}>✔ {f}</li>
            ))}
          </ul>
        )}

        <p>
          <b>Capacidad:</b> {site.capacity} personas
        </p>
        <p>
          <b>Precio:</b> ${site.price.toLocaleString("es-CL")}
        </p>
        <p>
          <b>Estado:</b>{" "}
          {site.status === "available"
            ? "Disponible"
            : site.status === "reserved"
              ? "Reservado"
              : "Vendido"}
        </p>
        <p>
          <b>Ubicación:</b> Sector {site.sector}, Código {site.code}
        </p>
        <p>
          <b>Descripción:</b> {site.description}
        </p>

        <button onClick={onAdd} style={btnPrimary}>
          Agregar al carrito
        </button>

        <button onClick={onClose} style={btnSecondary}>
          Cerrar
        </button>
      </div>
    </div>
  );
}

/* ====== ESTILOS ====== */

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,.45)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modal = {
  background: "#ffffff",
  borderRadius: 14,
  padding: 24,
  width: 340,
  maxWidth: "90%",
  boxShadow: "0 25px 50px rgba(0,0,0,.25)",
};

const btnPrimary = {
  marginTop: 16,
  width: "100%",
  padding: 12,
  background: "#22c55e",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  fontWeight: "bold",
  cursor: "pointer",
};

const btnSecondary = {
  marginTop: 8,
  width: "100%",
  padding: 10,
  background: "#e5e7eb",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
};
