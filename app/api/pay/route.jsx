/* eslint-disable react/jsx-key */
import { createFrames, Button } from "frames.js/next";

const totalPages = 5;

const frames = createFrames({
  basePath: "/api/pay",
});

const handleRequest = frames(async (ctx) => {
  const pageIndex = Number(ctx.searchParams.pageIndex || 0);
  const pageTag = ctx.searchParams.pageTag || "home";

  const imageUrl = `https://picsum.photos/seed/frames.js-${pageIndex}/300/200`;

  if (pageTag === "home") {
    return {
      image: (
        <div tw="flex flex-col">
          <div tw="flex">home page</div>
        </div>
      ),
      // textInput: "Type something!",
      buttons: [
        <Button
          action="post"
          target={{
            query: { pageTag: "pay" },
          }}
        >
          Pay
        </Button>,
        <Button
          action="post"
          target={{
            query: { pageTag: "request" },
          }}
        >
          Request
        </Button>,
      ],
    };
  } else if (pageTag === "pay") {
    return {
      image: (
        <div tw="flex flex-col">
          <div tw="flex">pay page</div>
        </div>
      ),
      textInput: "Enter Payment Amount: (BASE)",
      buttons: [
        <Button action="tx" target="/txdata" post_url="/frames">
          Confirm
        </Button>,
        <Button
          action="post"
          target={{
            query: { pageTag: "home" },
          }}
        >
          Home
        </Button>,
      ],
    };
  }
});

export const GET = handleRequest;
export const POST = handleRequest;
