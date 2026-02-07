// app/api/sites/route.js
import { connectDB } from "../../../lib/mongodb";
import Site from "../../../models/Site";

export async function GET() {
  await connectDB();
  const sites = await Site.find();
  return Response.json(sites);
}
