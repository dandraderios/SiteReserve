// app/api/seed/route.js
import { connectDB } from "../../../lib/mongodb";
import Site from "../../../models/Site";

export async function GET() {
  await connectDB();

  await Site.deleteMany();

  await Site.create([
    {
      code: "A1",
      sector: "A",
      name: "Terreno A1",
      description:
        "Terreno cercano al escenario principal, ideal para carpa grande o motorhome pequeño.",
      price: 25000,
      capacity: 4,
      features: ["Cercano a baños", "Sombra natural", "Acceso vehicular"],
      status: "available",
      x: 100,
      y: 100,
      w: 120,
      h: 80,
    },
    {
      code: "A2",
      sector: "A",
      name: "Terreno A2",
      description:
        "Terreno cercano al escenario principal, ideal para carpa grande o motorhome pequeño.",
      price: 55000,
      capacity: 4,
      features: ["Cercano a baños", "Sombra natural", "Acceso vehicular"],
      status: "available",
      x: 250,
      y: 100,
      w: 120,
      h: 80,
    },
    {
      code: "A3",
      sector: "A",
      name: "Terreno A3",
      description:
        "Terreno cercano al escenario principal, ideal para carpa grande o motorhome pequeño.",
      price: 80000,
      capacity: 4,
      features: ["Cercano a baños", "Sombra natural", "Acceso vehicular"],
      status: "available",
      x: 100,
      y: 200,
      w: 120,
      h: 80,
    },
  ]);

  return Response.json({ ok: true });
}
