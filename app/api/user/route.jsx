import { NextResponse } from "next/server";
import { createFrames, Button } from "frames.js/next";

const totalPages = 5;

let basePath = "/";

const frames = createFrames({
  basePath: `https://e2f6-68-181-16-35.ngrok-free.app/api/user`,
  initialState: {
    pageIndex: 0,
  },
});

const handleRequest = frames(async (ctx) => {
  const pageIndex = Number(ctx.searchParams.pageIndex || 0);

  const data = {
    image: (
      <div tw="flex flex-col">
        <div tw="flex">
          This is slide {pageIndex + 1} / {totalPages}
        </div>
      </div>
    ),
    buttons: [
      <Button
        action="post"
        target={{
          query: { pageIndex: (pageIndex - 1) % totalPages },
        }}
      >
        ←
      </Button>,
      <Button
        action="post"
        target={{
          query: { pageIndex: (pageIndex + 1) % totalPages },
        }}
      >
        →
      </Button>,
    ],
    textInput: "Type something!",
  };

  ctx.url.origin = "https://e2f6-68-181-16-35.ngrok-free.app";
  ctx.url.href = "https://e2f6-68-181-16-35.ngrok-free.app/api/user";

  return data;
});

export async function POST(req) {
  console.log("api called");

  // const url = req.url;
  // const params = new URLSearchParams(new URL(url).search);

  // const keys = params.get("s");
  // const { user } = JSON.parse(keys);

  // console.log(`keys are ${user}`);

  console.log(basePath);

  let data = handleRequest(req);

  return data;
}

export const dynamic = "force-dynamic";
