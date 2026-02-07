import mercadopago from "../../../lib/mercadopago";
import { connectDB } from "../../../lib/mongodb";
import Site from "../../../models/Site";
import mongoose from "mongoose";

const BASE_URL = process.env.BASE_URL;

export async function POST(req) {
  try {
    const sites = await req.json();

    if (!Array.isArray(sites) || sites.length === 0) {
      return Response.json(
        { error: "No hay sitios para pagar" },
        { status: 400 },
      );
    }

    await connectDB();

    // Convertir ids a ObjectId válidos
    const ids = sites.map((s) => new mongoose.Types.ObjectId(String(s._id)));

    // 🔒 Reserva temporal (bien hecho)
    await Site.updateMany(
      { _id: { $in: ids }, status: "available" },
      { status: "reserved" },
    );

    const pref = {
      items: sites.map((s) => ({
        title: `Sitio ${s.code}`,
        unit_price: Number(s.price),
        quantity: 1,
        currency_id: "CLP",
      })),

      // 🔑 ESTO ES LO MÁS IMPORTANTE
      external_reference: JSON.stringify(sites.map((s) => String(s._id))),

      back_urls: {
        success: `${BASE_URL}/success`,
        failure: `${BASE_URL}/failure`,
        pending: `${BASE_URL}/pending`,
      },
      auto_return: "approved",
    };

    console.log("MP preference:", pref);

    const mpRes = await mercadopago.preferences.create(pref);

    if (!mpRes?.body?.init_point) {
      throw new Error("MercadoPago no devolvió init_point");
    }

    return Response.json({
      url: mpRes.body.init_point,
    });
  } catch (err) {
    console.error("Payment error:", err);

    return Response.json(
      { error: err.message || "Error creando el pago" },
      { status: 500 },
    );
  }
}
