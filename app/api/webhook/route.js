// app/api/webhook/route.js
import { connectDB } from "../../../lib/mongodb";
import Site from "../../../models/Site";
import mongoose from "mongoose";

export async function POST(req) {
  const body = await req.json();

  // ✅ MercadoPago puede mandar type, topic o action
  if (
    body.type !== "payment" &&
    body.topic !== "payment" &&
    !body.action?.startsWith("payment")
  ) {
    return Response.json({ ok: true });
  }

  const paymentId = body.data?.id;
  if (!paymentId) {
    console.error("❌ Webhook sin paymentId", body);
    return Response.json({ ok: false });
  }

  // 1️⃣ Consultar pago real en MP
  const mpRes = await fetch(
    `https://api.mercadopago.com/v1/payments/${paymentId}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
      },
    },
  );

  const payment = await mpRes.json();

  // 2️⃣ Solo pagos aprobados
  if (payment.status !== "approved") {
    return Response.json({ ok: true });
  }

  // 3️⃣ Leer terrenos desde external_reference
  if (!payment.external_reference) {
    console.error("❌ external_reference vacío", payment);
    return Response.json({ ok: false });
  }

  let siteIds = [];
  try {
    siteIds = JSON.parse(payment.external_reference);
  } catch (e) {
    console.error("❌ external_reference inválido", payment.external_reference);
    return Response.json({ ok: false });
  }

  console.log("✅ Pago aprobado:", {
    paymentId: payment.id,
    siteIds,
  });

  await connectDB();

  // ✅ convertir a ObjectId
  const objectIds = siteIds.map((id) => new mongoose.Types.ObjectId(id));

  // 4️⃣ Marcar terrenos como vendidos
  const result = await Site.updateMany(
    { _id: { $in: objectIds } },
    {
      $set: {
        status: "sold",
        paid: true,
        paymentId: payment.id,
      },
    },
  );

  console.log("🧾 Terrenos actualizados:", result.modifiedCount);

  return Response.json({ ok: true });
}
