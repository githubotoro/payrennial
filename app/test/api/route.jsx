import { NextResponse } from "next/server";
import { createFrames } from "frames.js/core";

const frames = createFrames();

const handleRequest = frames(async (ctx) => {
  console.log(ctx);
});

export async function GET(req) {
  const body = await req.json();

  console.log(body);

  return handleRequest(req);
}

export const dynamic = "force-dynamic";
