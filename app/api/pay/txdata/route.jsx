import { getFrameMessage } from "frames.js/next/server";
import { NextResponse } from "next/server";

export async function POST(req) {
  console.log("frames api called");

  const requestURL = req.url;
  const searchParams = new URLSearchParams(requestURL.split("?")[1]);

  const amount = searchParams.get("amount");
  const receiverAddress = searchParams.get("receiverAddress");

  const json = await req.json();
  const frameMessage = await getFrameMessage(json);

  if (!frameMessage) {
    throw new Error("No frame message");
  }

  return NextResponse.json({
    chainId: "eip155:10",
    // chainId: "eip155:11155420",
    method: "eth_sendTransaction",
    params: {
      abi: [],
      to: receiverAddress,
      data: "0x",
      value: amount,
    },
  });
}
