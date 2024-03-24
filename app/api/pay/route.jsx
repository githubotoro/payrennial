import { createFrames, Button } from "frames.js/next";
import { sql, sanitizeText } from "@/components/db";
import { sanitizeAmount } from "@/components/db/utilities";
import { getUserDataForFid } from "frames.js";
import { getAddressesForFid } from "frames.js";
import { getFrameMessage } from "frames.js/next/server";

const totalPages = 5;

const frames = createFrames({
  basePath: "/api/pay",
});

const handleRequest = frames(async (ctx) => {
  const pageTag = ctx.searchParams.pageTag || "home";
  const frameUsername = ctx.searchParams.frameUsername;
  const frameUserAddress = ctx.searchParams.frameUserAddress;

  // console.log("ctx is ", ctx);

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
            query: { pageTag: "pay", frameUsername, frameUserAddress },
          }}
        >
          Pay
        </Button>,
        <Button
          action="post"
          target={{
            query: { pageTag: "request", frameUsername, frameUserAddress },
          }}
        >
          Request
        </Button>,
      ],
    };
  }

  // PAY
  else if (pageTag === "pay") {
    if (userData.username === frameUsername) {
      const todo = ctx.searchParams.todo;

      let list = [];
      let query = ``;

      query = `
        SELECT 
          *
        FROM     
          users 
        WHERE
          sender_username = '${userData.username}'
        ORDER BY 
          timestamp desc;
        `;

      list = await sql.unsafe(query);

      if (todo === "decline" && ctx.message.inputText) {
        const payeeId = ctx.message.inputText;

        const deleteId = list[payeeId - 1].id;

        query = `
        DELETE  
        FROM   
          users
        WHERE 
          id = '${deleteId}';
        `;

        await sql.unsafe(query);

        query = `
        SELECT 
          *
        FROM     
          users 
        WHERE
          sender_username = '${userData.username}'
        ORDER BY 
          timestamp desc;
        `;

        list = await sql.unsafe(query);
      }

      let currentPageIndex = ctx.searchParams.currentPageIndex || 0;
      const startIndex = currentPageIndex * 5;
      let currentIndex = startIndex;

      let newlist = [];

      for (
        let i = 0;
        i < list.length && currentIndex < list.length && newlist.length < 5;
        i++
      ) {
        newlist.push(list[currentIndex]);
        currentIndex += 1;
      }

      const totalPages = Math.ceil(list.length / 5);
      console.log(`total pages are `, totalPages);
      currentPageIndex = Math.min(
        Math.max(0, currentPageIndex),
        totalPages - 1
      );
      const nextPageIndex = (currentPageIndex + 1) % totalPages;

      console.log("current page index is ", currentPageIndex);
      console.log("next page index is ", nextPageIndex);

      const deleteValues = {
        totalPages: Math.ceil((list.length - 1) / 5),
        nextPageIndex: (currentPageIndex + 1) % totalPages,
      };

      console.log(newlist);

      return {
        image: (
          <div tw="flex flex-col">
            <div tw="flex">pay page</div>
          </div>
        ),
        textInput: "Enter Payee Id",
        buttons: [
          <Button
            action="post"
            target={{
              query: {
                pageTag: "pay-same",
                frameUsername,
                frameUserAddress,
              },
            }}
          >
            Pay
          </Button>,
          <Button
            action="post"
            target={{
              query: {
                pageTag: "pay",
                frameUsername,
                frameUserAddress,
                todo: "decline",
              },
            }}
          >
            Decline
          </Button>,

          <Button
            action="post"
            target={{
              query: {
                pageTag: "pay",
                frameUsername,
                frameUserAddress,
                currentPageIndex: nextPageIndex,
              },
            }}
          >
            Show More
          </Button>,
          <Button
            action="post"
            target={{
              query: { pageTag: "home", frameUsername, frameUserAddress },
            }}
          >
            Home
          </Button>,
        ],
      };
    } else {
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
                frameUsername,
                frameUserAddress,
              },
            }}
          >
            Confirm
          </Button>,
          <Button
            action="post"
            target={{
              query: { pageTag: "home", frameUsername, frameUserAddress },
            }}
          >
            Home
          </Button>,
        ],
      };
    }
  } else if (pageTag === "pay-same") {
    let list = [];
    let query = ``;

    query = `
        SELECT 
          *
        FROM     
          users 
        WHERE
          sender_username = '${userData.username}'
        ORDER BY 
          timestamp desc;
        `;

    list = await sql.unsafe(query);

    const payeeId = ctx.message.inputText;
    const paymentDetails = list[payeeId - 1];

    console.log(`paymnet id is `, paymentDetails);

    return {
      image: (
        <div tw="flex flex-col">
          <div tw="flex">pay same page</div>
        </div>
      ),
      buttons: [
        <Button
          action="tx"
          target={`/txdata?amount=${paymentDetails.amount}&receiverAddress=${paymentDetails.receiver_address}`}
          post_url={`?pageTag=pay-success&frameUsername=${frameUsername}&frameUserAddress=${frameUserAddress}&todo=delete&payeeId=${paymentDetails.id}`}
        >
          Submit
        </Button>,
        <Button
          action="post"
          target={{
            query: { pageTag: "home", frameUsername, frameUserAddress },
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
            query: { pageTag: "pay", frameUsername, frameUserAddress },
          }}
        >
          Go Back
        </Button>,
        <Button
          action="tx"
          target={`/txdata?amount=${amount}&receiverAddress=${frameUserAddress}`}
          post_url={`?pageTag=pay-success&frameUsername=${frameUsername}&frameUserAddress=${frameUserAddress}`}
        >
          Submit
        </Button>,
        <Button
          action="post"
          target={{
            query: { pageTag: "home", frameUsername, frameUserAddress },
          }}
        >
          Home
        </Button>,
      ],
    };
  }
  // PAY SUCCESS
  else if (pageTag === "pay-success") {
    if (ctx.searchParams.todo === "delete") {
      const deleteId = ctx.searchParams.payeeId;

      const query = `
        DELETE  
        FROM   
          users
        WHERE 
          id = '${deleteId}';
        `;

      await sql.unsafe(query);
    }

    let transactionId = ctx.message.transactionId;

    if (
      transactionId === undefined ||
      transactionId === null ||
      transactionId === ""
    ) {
      console.log("fetching id from search params");
      transactionId = ctx.searchParams.transactionId;
    }

    console.log("transaction id is ", transactionId);

    const datetime = Date.now();
    const fcFrameImageURL = `https://og.onceupon.gg/card/${transactionId}?datetime=${datetime}`;

    return {
      image: (
        <div tw="flex flex-col">
          <img src={fcFrameImageURL} alt="Image" />
        </div>
      ),
      buttons: [
        <Button
          action="post"
          target={{
            query: {
              pageTag: "pay-success",
              transactionId,
              frameUsername,
              frameUserAddress,
            },
          }}
        >
          Refresh
        </Button>,
        <Button
          action="post"
          target={{
            query: { pageTag: "home", frameUsername, frameUserAddress },
          }}
        >
          Home
        </Button>,
      ],
    };
  }

  // REQUEST
  else if (pageTag === "request") {
    if (userData.username === frameUsername) {
      return {
        image: (
          <div tw="flex flex-col">
            <div tw="flex">request page</div>
          </div>
        ),
        textInput: "Enter Payer Username",
        buttons: [
          <Button
            action="post"
            target={{
              query: {
                pageTag: "request-same",
                frameUsername,
                frameUserAddress,
              },
            }}
          >
            Go
          </Button>,
          <Button
            action="post"
            target={{
              query: { pageTag: "home", frameUsername, frameUserAddress },
            }}
          >
            Home
          </Button>,
        ],
      };
    } else {
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
                frameUsername,
                frameUserAddress,
              },
            }}
          >
            Confirm
          </Button>,
          <Button
            action="post"
            target={{
              query: { pageTag: "home", frameUsername, frameUserAddress },
            }}
          >
            Home
          </Button>,
        ],
      };
    }
  } else if (pageTag === "request-same") {
    let otherUsername = ctx.searchParams.otherUsername;

    if (!otherUsername) {
      otherUsername = sanitizeText(ctx.message.inputText);
    }

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
              frameUsername,
              frameUserAddress,
              otherUsername,
            },
          }}
        >
          Confirm
        </Button>,
        <Button
          action="post"
          target={{
            query: { pageTag: "home", frameUsername, frameUserAddress },
          }}
        >
          Home
        </Button>,
      ],
    };
  } else if (pageTag === "request-message") {
    const amount = sanitizeAmount(ctx.message.inputText);
    const otherUsername = ctx.searchParams.otherUsername;

    if (otherUsername) {
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
              query: {
                pageTag: "request-same",
                frameUsername,
                frameUserAddress,
                otherUsername,
              },
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
                frameUsername,
                frameUserAddress,
                otherUsername,
              },
            }}
          >
            Submit
          </Button>,
          <Button
            action="post"
            target={{
              query: { pageTag: "home", frameUsername, frameUserAddress },
            }}
          >
            Home
          </Button>,
        ],
      };
    } else {
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
              query: { pageTag: "request", frameUsername, frameUserAddress },
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
                frameUsername,
                frameUserAddress,
              },
            }}
          >
            Submit
          </Button>,
          <Button
            action="post"
            target={{
              query: { pageTag: "home", frameUsername, frameUserAddress },
            }}
          >
            Home
          </Button>,
        ],
      };
    }
  } else if (pageTag === "request-submitted") {
    const amount = sanitizeAmount(ctx.searchParams.inputText);
    const message = sanitizeText(ctx.message.inputText);
    const timestamp = Math.floor(Date.now() / 1000);
    const otherUsername = ctx.searchParams.otherUsername;

    console.log("other username is ", otherUsername);

    let query = ``;

    if (otherUsername) {
      query = `
      INSERT INTO users (timestamp, sender_username, receiver_username, receiver_address, amount, message)
      VALUES (
          ${timestamp},
          '${otherUsername}',
          '${userData.username}',
          '${userAddress}',
          ${amount},
          '${message}'
      );
      `;
    } else {
      query = `
      INSERT INTO users (timestamp, sender_username, receiver_username, receiver_address, amount, message)
      VALUES (
          ${timestamp},
          '${frameUsername}',
          '${userData.username}',
          '${userAddress}',
          ${amount},
          '${message}'
      );
      `;
    }

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
            query: { pageTag: "request", frameUsername, frameUserAddress },
          }}
        >
          Request More
        </Button>,
        <Button
          action="post"
          target={{
            query: { pageTag: "home", frameUsername, frameUserAddress },
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
