import { NextResponse } from "next/server";

async function getResponse(req) {
  return NextResponse.json({ greet: "hello" });
}

export async function POST(req) {
  console.log("api called");
  return getResponse(req);
}

export const dynamic = "force-dynamic";
