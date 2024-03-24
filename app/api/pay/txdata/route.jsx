import { getFrameMessage } from "frames.js/next/server";
import { NextResponse } from "next/server";

export async function POST(req) {
  console.log("frames api called");

  const json = await req.json();

  const frameMessage = await getFrameMessage(json);

  console.log("frames message is ", frameMessage);

  if (!frameMessage) {
    throw new Error("No frame message");
  }

  return NextResponse.json({
    // chainId: "eip155:10",
    chainId: "eip155:11155420",
    method: "eth_sendTransaction",
    params: {
      abi: [],
      to: "0x3143542219E33D75B57e08E57BC5848bAEaf4DaA",
      data: "0x",
      value: "1000000000",
    },
  });
}
