import { createFrames, Button } from "frames.js/next";

const frames = createFrames();
const handleRequest = frames(async () => {
  return {
    image: (
      <div tw="flex flex-col">
        <div tw="flex">This is a page</div>
      </div>
    ),
    buttons: [<Button action="post">Click me</Button>],
  };
});

export async function GET(req) {
  console.log("get api called");
  return handleRequest(req);
}
