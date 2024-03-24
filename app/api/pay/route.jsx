import { createFrames, Button } from "frames.js/next";
import { sql, sanitizeText } from "@/components/db";
import { sanitizeAmount } from "@/components/db/utilities";
import { getFrameMessage } from "frames.js";
import { getUserDataForFid } from "frames.js";
import { getAddressesForFid } from "frames.js";

const totalPages = 5;

const frames = createFrames({
  basePath: "/api/pay",
});

const handleRequest = frames(async (ctx) => {
  const pageTag = ctx.searchParams.pageTag || "home";
  const frameUser = ctx.searchParams.frameUser;

  console.log(ctx);

  // const query = `
  //   SELECT
  //     *
  //   FROM
  //     users;
  // `;

  // const status = await sql.unsafe(query);

  // console.log(status);

  let userData = null;
  let userAddress = null;

  if (pageTag !== "home") {
    userData = await getUserDataForFid({ fid: ctx.message.requesterFid });

    const addresses = await getAddressesForFid({
      fid: ctx.message.requesterFid,
    });

    for (let i = 0; i < addresses.length; i++) {
      if (addresses[i].type === "verified") {
        userAddress = addresses[i].address;
        break;
      }
    }
  }

  // HOME
  if (pageTag === "home") {
    return {
      image: (
        <div tw="flex flex-col">
          <div tw="flex">home page</div>
        </div>
      ),
      buttons: [
        <Button
          action="post"
          target={{
            query: { pageTag: "pay", frameUser: frameUser },
          }}
        >
          Pay
        </Button>,
        <Button
          action="post"
          target={{
            query: { pageTag: "request", frameUser: frameUser },
          }}
        >
          Request
        </Button>,
      ],
    };
  }
  // PAY
  else if (pageTag === "pay") {
    return {
      image: (
        <div tw="flex flex-col">
          <div tw="flex">pay page</div>
        </div>
      ),
      textInput: "Enter Payment Amount: (OP)",
      buttons: [
        <Button
          action="post"
          target={{
            query: {
              pageTag: "pay-message",
              frameUser: frameUser,
            },
          }}
        >
          Confirm
        </Button>,
        <Button
          action="post"
          target={{
            query: { pageTag: "home", frameUser: frameUser },
          }}
        >
          Home
        </Button>,
      ],
    };
  }
  // PAY MESSAGE
  else if (pageTag === "pay-message") {
    const amount = sanitizeAmount(ctx.message.inputText);

    return {
      image: (
        <div tw="flex flex-col">
          <div tw="flex">pay message page</div>
        </div>
      ),
      textInput: "Add a Message",
      buttons: [
        <Button
          action="post"
          target={{
            query: { pageTag: "pay", frameUser: frameUser },
          }}
        >
          Go Back
        </Button>,
        <Button action="tx" target={`/txdata?`} post_url="/frames">
          Submit
        </Button>,
        <Button
          action="post"
          target={{
            query: { pageTag: "home", frameUser: frameUser },
          }}
        >
          Home
        </Button>,
      ],
    };
  } else if (pageTag === "pay-temp") {
    return {
      image: (
        <div tw="flex flex-col">
          <div tw="flex">pay page</div>
        </div>
      ),
      textInput: "Enter Payment Amount: (OP)",
      buttons: [
        <Button action="tx" target={`/txdata`} post_url="/frames">
          Confirm
        </Button>,
        <Button
          action="post"
          target={{
            query: { pageTag: "home", frameUser: frameUser },
          }}
        >
          Home
        </Button>,
      ],
    };
  } else if (pageTag === "request") {
    return {
      image: (
        <div tw="flex flex-col">
          <div tw="flex">request page</div>
        </div>
      ),
      textInput: "Enter Request Amount: (OP)",
      buttons: [
        <Button
          action="post"
          target={{
            query: {
              pageTag: "request-message",
              frameUser: frameUser,
            },
          }}
        >
          Confirm
        </Button>,
        <Button
          action="post"
          target={{
            query: { pageTag: "home", frameUser: frameUser },
          }}
        >
          Home
        </Button>,
      ],
    };
  } else if (pageTag === "request-message") {
    const amount = sanitizeAmount(ctx.message.inputText);

    return {
      image: (
        <div tw="flex flex-col">
          <div tw="flex">request message page</div>
        </div>
      ),
      textInput: "Add a Message",
      buttons: [
        <Button
          action="post"
          target={{
            query: { pageTag: "request", frameUser: frameUser },
          }}
        >
          Go Back
        </Button>,
        <Button
          action="post"
          target={{
            query: {
              pageTag: "request-submitted",
              inputText: amount,
              frameUser: frameUser,
            },
          }}
        >
          Submit
        </Button>,
        <Button
          action="post"
          target={{
            query: { pageTag: "home", frameUser: frameUser },
          }}
        >
          Home
        </Button>,
      ],
    };
  } else if (pageTag === "request-submitted") {
    const amount = sanitizeAmount(ctx.searchParams.inputText);
    const message = sanitizeText(ctx.message.inputText);
    const timestamp = Math.floor(Date.now() / 1000);

    const query = `
    INSERT INTO users (timestamp, sender_username, receiver_username, receiver_address, amount, message)
    VALUES (
        ${timestamp},
        '${frameUser}',
        '${userData.username}',
        '${userAddress}',
        ${amount},
        '${message}'
    );
    `;

    await sql.unsafe(query);

    return {
      image: (
        <div tw="flex flex-col">
          <div tw="flex">request submitted page</div>
        </div>
      ),
      buttons: [
        <Button
          action="post"
          target={{
            query: { pageTag: "request" },
          }}
        >
          Request More
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
