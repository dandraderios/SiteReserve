// app/api/webhook/route.js
import { connectDB } from "@/lib/mongodb";
import Site from "@/models/Site";

export async function POST(req) {
  const body = await req.json();

  // MercadoPago envía muchos eventos
  if (body.type !== "payment") {
    return Response.json({ ok: true });
  }

  const paymentId = body.data.id;

  // 1️⃣ Consultar el pago REAL
  const mpRes = await fetch(
    `https://api.mercadopago.com/v1/payments/${paymentId}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
      },
    },
  );

  const payment = await mpRes.json();

  // 2️⃣ Validar estado
  if (payment.status !== "approved") {
    return Response.json({ ok: true });
  }

  // 3️⃣ Leer terrenos desde external_reference
  // (esto lo mandas tú al crear el pago)
  let siteIds = [];
  try {
    siteIds = JSON.parse(payment.external_reference);
  } catch (e) {
    console.error("external_reference inválido");
    return Response.json({ ok: false });
  }

  await connectDB();

  // 4️⃣ Marcar terrenos como vendidos
  await Site.updateMany(
    { _id: { $in: siteIds } },
    {
      $set: {
        status: "reserved",
        paid: true,
        paymentId: payment.id,
      },
    },
  );

  return Response.json({ ok: true });
}
