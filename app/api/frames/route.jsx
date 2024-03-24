import { TransactionTargetResponse } from "frames.js";
import { getFrameMessage } from "frames.js/next/server";
import { NextRequest, NextResponse } from "next/server";
import {
  Abi,
  createPublicClient,
  encodeFunctionData,
  getContract,
  http,
} from "viem";
import { base } from "viem/chains";

export async function POST(req) {
  console.log("frames api called");

  const json = await req.json();

  const frameMessage = await getFrameMessage(json);

  if (!frameMessage) {
    throw new Error("No frame message");
  }

  const units = 1n;

  const calldata = encodeFunctionData({
    args: [BigInt(frameMessage.requesterFid), units],
  });

  const publicClient = createPublicClient({
    chain: base,
    transport: http(),
  });

  return NextResponse.json({
    chainId: "eip155:8453",
    method: "eth_sendTransaction",
    params: {
      to: "0x3143542219E33D75B57e08E57BC5848bAEaf4DaA",
      data: calldata,
      value: unitPrice.toString(),
    },
  });
}
