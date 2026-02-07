// models/Site.js
import mongoose from "mongoose";

// 💣 FORZAR recompilación del modelo en Next
delete mongoose.models.Site;

const SiteSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },

    sector: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    capacity: {
      type: Number,
      default: 1,
    },

    features: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: ["available", "reserved", "sold"],
      default: "available",
    },

    paid: {
      type: Boolean,
      default: false,
    },

    paymentId: {
      type: String,
      default: null,
    },

    paidAt: Date,

    x: Number,
    y: Number,
    w: Number,
    h: Number,
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Site", SiteSchema);
