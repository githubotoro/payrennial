import { NextResponse } from "next/server";

async function getResponse(req) {
  return NextResponse.json({ greet: "hello" });
}

export async function GET(req) {
  return getResponse(req);
}

export const dynamic = "force-dynamic";
