"use client";

import { useEffect, useState } from "react";
import CampingMap from "../components/CampingMap";
import SiteModal from "../components/SiteModal";
import MapTooltip from "../components/MapTooltip";

export default function Home() {
  const [sites, setSites] = useState([]);
  const [selected, setSelected] = useState([]);
  const [activeSite, setActiveSite] = useState(null);

  const [hoverSite, setHoverSite] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    fetch("/api/sites", { cache: "no-store" })
      .then((r) => r.json())
      .then(setSites);
  }, []);

  const total = selected.reduce((s, i) => s + i.price, 0);

  const pagar = async () => {
    const res = await fetch("/api/payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(selected),
    });

    const data = await res.json();
    window.location.href = data.url;
  };

  const agregar = (site) => {
    const id = String(site._id);

    if (!selected.find((s) => String(s._id) === id)) {
      setSelected((prev) => [...prev, site]);
    }

    setActiveSite(null);
  };

  return (
    <main style={{ padding: 40 }}>
      <h1>Reserva de sitios</h1>

      <CampingMap
        sites={sites}
        selectedIds={selected.map((s) => String(s._id))} // ✅ CLAVE
        onHover={(site, pos) => {
          setHoverSite(site);
          setMousePos(pos);
        }}
        onLeave={() => setHoverSite(null)}
        onSelect={setActiveSite}
      />

      <MapTooltip site={hoverSite} pos={mousePos} />

      {activeSite && (
        <SiteModal
          site={activeSite}
          onAdd={() => agregar(activeSite)}
          onClose={() => setActiveSite(null)}
        />
      )}

      <hr />

      <h3>Total: ${total.toLocaleString("es-CL")}</h3>

      <button
        disabled={!selected.length}
        onClick={pagar}
        style={{
          padding: 12,
          background: "#22c55e",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          fontWeight: "bold",
          opacity: selected.length ? 1 : 0.6,
          cursor: selected.length ? "pointer" : "not-allowed",
        }}
      >
        Pagar
      </button>
    </main>
  );
}
