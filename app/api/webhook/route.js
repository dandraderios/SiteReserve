// app/api/webhook/route.js
import { connectDB } from "../../../lib/mongodb";
import Site from "../../../models/Site";
import mongoose from "mongoose";

export async function POST(req) {
  const body = await req.json();

  // 1️⃣ Ignorar eventos que no sean payment
  if (body.type !== "payment") {
    return Response.json({ ok: true });
  }

  const paymentId = body.data.id;

  // 2️⃣ Consultar pago real en MP
  const mpRes = await fetch(
    `https://api.mercadopago.com/v1/payments/${paymentId}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
      },
    },
  );

  if (!mpRes.ok) {
    const err = await mpRes.text();
    console.error("MP error:", err);
    return Response.json({ ok: false });
  }

  const payment = await mpRes.json();

  // 3️⃣ Validar estado aprobado
  if (payment.status !== "approved") {
    return Response.json({ ok: true });
  }

  // 4️⃣ Parsear external_reference
  let siteIdsRaw;
  try {
    siteIdsRaw = JSON.parse(payment.external_reference);
  } catch (e) {
    console.error("external_reference inválido:", payment.external_reference);
    return Response.json({ ok: false });
  }

  // 5️⃣ Convertir a ObjectId
  const siteIds = siteIdsRaw.map((id) => new mongoose.Types.ObjectId(id));

  console.log("✔ Pagado:", {
    paymentId: payment.id,
    sites: siteIdsRaw,
  });

  await connectDB();

  // 6️⃣ Actualizar Mongo
  const result = await Site.updateMany(
    { _id: { $in: siteIds } },
    {
      $set: {
        status: "sold",
        paid: true,
        paymentId: payment.id,
        paidAt: new Date(),
      },
    },
  );

  console.log("Mongo update:", result);

  return Response.json({ ok: true });
}
