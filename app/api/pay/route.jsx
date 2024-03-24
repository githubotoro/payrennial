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

  let userData = null;
  let userAddress = null;
  let frameData = null;

  const frameDataRes = await fetch(
    `https://api.web3.bio/profile/farcaster/${frameUsername}`
  );
  frameData = await frameDataRes.json();

  console.log(frameData);

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
    const imageUrl = `${process.env.NEXT_PUBLIC_VERCEL_URL}/frames/home.png`;
    return {
      image: (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            flexWrap: "nowrap",
            backgroundImage: `linear-gradient(to bottom, #9c60ff, #0a1259)`,
            color: "white",
            // backgroundSize: "100px 100px",
          }}
        >
          <div tw="flex flex-col items-center w-full w-56 h-56 overflow-hidden rounded-full">
            {/* <img src={frameData.avatar} alt="image" tw="object-cover" /> */}
            <img
              src="https://images.rawpixel.com/image_png_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvdjkzNy1hZXctMTY1LnBuZw.png"
              alt="image"
              tw="object-cover absolute"
            />

            <img
              width={224}
              height={224}
              src={frameData.avatar}
              alt="image"
              tw="object-cover bg-transparent z-10"
            />
          </div>
          <div tw="flex flex-col items-center w-full px-5 text-5xl mt-5">{`@${frameUsername}`}</div>
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
        let item = {
          ...list[currentIndex],
          index: currentIndex,
        };

        newlist.push(item);
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
          <div
            style={{
              height: "100%",
              width: "100%",
              display: "flex",
              textAlign: "center",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              flexWrap: "nowrap",
              backgroundImage: `linear-gradient(to bottom, #9c60ff, #0a1259)`,
              color: "white",
              // backgroundSize: "100px 100px",
            }}
          >
            <div tw="flex flex-col items-center w-full px-5 text-3xl">
              {newlist.map((item, key) => {
                const amountInEth = item.amount / Math.pow(10, 18);
                const formattedAmount = new Intl.NumberFormat("en-US", {
                  maximumFractionDigits: 6,
                }).format(amountInEth);

                return (
                  <div
                    key={key}
                    tw="flex flex-row border border-white bg-[#d9d9d9] bg-opacity-20 w-full px-5 py-3 rounded-3xl mt-5"
                  >
                    <div
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      tw="px-3 w-1/12 flex flex-col"
                    >
                      {item.index + 1}
                    </div>
                    <div
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      tw="px-3 w-3/12 flex flex-col"
                    >
                      @{item.receiver_username}
                    </div>

                    <div
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      tw="px-3 w-3/12 flex flex-col"
                    >
                      {formattedAmount} ETH
                    </div>
                    <div
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      tw="px-3 w-5/12"
                    >
                      {item.message}
                    </div>
                  </div>
                );
              })}
            </div>
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
          <div
            style={{
              height: "100%",
              width: "100%",
              display: "flex",
              textAlign: "center",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              flexWrap: "nowrap",
              backgroundImage: `linear-gradient(to bottom, #9c60ff, #0a1259)`,
              color: "white",
              // backgroundSize: "100px 100px",
            }}
          >
            <div tw="flex flex-col items-center w-full w-56 h-56 overflow-hidden rounded-full">
              <img
                src="https://images.rawpixel.com/image_png_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvdjkzNy1hZXctMTY1LnBuZw.png"
                alt="image"
                tw="object-cover absolute"
              />

              <img
                width={224}
                height={224}
                src={frameData.avatar}
                alt="image"
                tw="object-cover w-full h-full bg-transparent z-10"
              />
            </div>

            <div
              style={{
                wordWrap: "break-word",
              }}
              tw="text-5xl mt-12 px-24 max-w-2xl w-full flex flex-col items-center"
            >
              {`How much do you wannna pay to @${frameUsername}?`}
            </div>
          </div>
        ),
        textInput: "Enter Payment Amount: (ETH)",
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
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            flexWrap: "nowrap",
            backgroundImage: `linear-gradient(to bottom, #9c60ff, #0a1259)`,
            color: "white",
            // backgroundSize: "100px 100px",
          }}
        >
          <div tw="flex flex-col items-center w-full w-56 h-56 overflow-hidden rounded-full">
            {/* <img src={frameData.avatar} alt="image" tw="object-cover" /> */}
            <img
              src="https://images.rawpixel.com/image_png_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvdjkzNy1hZXctMTY1LnBuZw.png"
              alt="image"
              tw="object-cover absolute"
            />

            <img
              width={224}
              height={224}
              src={frameData.avatar}
              alt="image"
              tw="object-cover bg-transparent z-10"
            />
          </div>

          <div
            style={{
              wordWrap: "break-word",
            }}
            tw="text-5xl mt-12 px-20 max-w-5xl w-full flex flex-col items-center"
          >
            {`You will be paying ${
              paymentDetails.amount / Math.pow(10, 18)
            } ETH to @${paymentDetails.receiver_username}.`}
          </div>
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
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            flexWrap: "nowrap",
            backgroundImage: `linear-gradient(to bottom, #9c60ff, #0a1259)`,
            color: "white",
            // backgroundSize: "100px 100px",
          }}
        >
          <div tw="flex flex-col items-center w-full w-56 h-56 overflow-hidden rounded-full">
            {/* <img src={frameData.avatar} alt="image" tw="object-cover" /> */}
            <img
              src="https://images.rawpixel.com/image_png_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvdjkzNy1hZXctMTY1LnBuZw.png"
              alt="image"
              tw="object-cover absolute"
            />

            <img
              width={224}
              height={224}
              src={frameData.avatar}
              alt="image"
              tw="object-cover w-full h-full bg-transparent z-10"
            />
          </div>

          <div
            style={{
              wordWrap: "break-word",
            }}
            tw="text-5xl mt-12 px-20 max-w-5xl w-full flex flex-col items-center"
          >
            {`Please add a message to describe your payment of ${amount} ETH.`}
          </div>
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
          target={`/txdata?amount=${
            amount * Math.pow(10, 18)
          }&receiverAddress=${frameUserAddress}`}
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
          <div
            style={{
              height: "100%",
              width: "100%",
              display: "flex",
              textAlign: "center",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              flexWrap: "nowrap",
              backgroundImage: `linear-gradient(to bottom, #9c60ff, #0a1259)`,
              color: "white",
              // backgroundSize: "100px 100px",
            }}
          >
            <div tw="flex flex-col items-center w-full w-56 h-56 overflow-hidden rounded-full">
              {/* <img src={frameData.avatar} alt="image" tw="object-cover" /> */}
              <img
                src="https://images.rawpixel.com/image_png_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvdjkzNy1hZXctMTY1LnBuZw.png"
                alt="image"
                tw="object-cover"
              />
            </div>

            <div tw="text-5xl mt-12 px-24">
              You can send a payment request here. Who are you requesting to?
            </div>
          </div>
        ),
        textInput: "Enter Payer's Farcaster Username",
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
          <div
            style={{
              height: "100%",
              width: "100%",
              display: "flex",
              textAlign: "center",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              flexWrap: "nowrap",
              backgroundImage: `linear-gradient(to bottom, #9c60ff, #0a1259)`,
              color: "white",
              // backgroundSize: "100px 100px",
            }}
          >
            <div tw="flex flex-col items-center w-full w-56 h-56 overflow-hidden rounded-full relative">
              <img
                width={224}
                height={224}
                src={frameData.avatar}
                alt="image"
                tw="object-cover w-full h-full bg-transparent"
              />

              <img
                src="https://images.rawpixel.com/image_png_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvdjkzNy1hZXctMTY1LnBuZw.png"
                alt="image"
                tw="object-cover absolute"
              />
            </div>

            <div
              style={{
                wordWrap: "break-word",
              }}
              tw="text-5xl mt-12 px-20 max-w-3xl w-full flex flex-col items-center"
            >
              {`How much are you requesting from @${frameUsername}?`}
            </div>
          </div>
        ),
        textInput: "Enter Request Amount: (ETH)",
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
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            flexWrap: "nowrap",
            backgroundImage: `linear-gradient(to bottom, #9c60ff, #0a1259)`,
            color: "white",
            // backgroundSize: "100px 100px",
          }}
        >
          <div tw="flex flex-col items-center w-full w-56 h-56 overflow-hidden rounded-full">
            {/* <img src={frameData.avatar} alt="image" tw="object-cover" /> */}
            <img
              src="https://images.rawpixel.com/image_png_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvdjkzNy1hZXctMTY1LnBuZw.png"
              alt="image"
              tw="object-cover"
            />
          </div>

          <div
            style={{
              wordWrap: "break-word",
            }}
            tw="text-5xl mt-12 px-24 max-w-2xl w-full flex flex-col items-center"
          >
            {`How much are you requesting from @${otherUsername}?`}
          </div>
        </div>
      ),
      textInput: "Enter Request Amount: (ETH)",
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
          <div
            style={{
              height: "100%",
              width: "100%",
              display: "flex",
              textAlign: "center",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              flexWrap: "nowrap",
              backgroundImage: `linear-gradient(to bottom, #9c60ff, #0a1259)`,
              color: "white",
              // backgroundSize: "100px 100px",
            }}
          >
            <div tw="flex flex-col items-center w-full w-56 h-56 overflow-hidden rounded-full">
              {/* <img src={frameData.avatar} alt="image" tw="object-cover" /> */}
              <img
                src="https://images.rawpixel.com/image_png_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvdjkzNy1hZXctMTY1LnBuZw.png"
                alt="image"
                tw="object-cover"
              />
            </div>

            <div
              style={{
                wordWrap: "break-word",
              }}
              tw="text-5xl mt-12 px-20 max-w-3xl w-full flex flex-col items-center"
            >
              {`Please add a message to describe your request of ${amount} ETH.`}
            </div>
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
          <div
            style={{
              height: "100%",
              width: "100%",
              display: "flex",
              textAlign: "center",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              flexWrap: "nowrap",
              backgroundImage: `linear-gradient(to bottom, #9c60ff, #0a1259)`,
              color: "white",
              // backgroundSize: "100px 100px",
            }}
          >
            <div tw="flex flex-col items-center w-full w-56 h-56 overflow-hidden rounded-full">
              <img
                width={224}
                height={224}
                src={frameData.avatar}
                alt="image"
                tw="object-cover w-full h-full bg-transparent"
              />

              <img
                src="https://images.rawpixel.com/image_png_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvdjkzNy1hZXctMTY1LnBuZw.png"
                alt="image"
                tw="object-cover absolute"
              />
            </div>

            <div
              style={{
                wordWrap: "break-word",
              }}
              tw="text-5xl mt-12 px-20 max-w-5xl w-full flex flex-col items-center"
            >
              {`Please add a message to describe your request of ${amount} ETH.`}
            </div>
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
          ${parseFloat(amount) * Math.pow(10, 18)},
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
          ${parseFloat(amount) * Math.pow(10, 18)},
          '${message}'
      );
      `;
    }

    await sql.unsafe(query);

    return {
      image: (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            flexWrap: "nowrap",
            backgroundImage: `linear-gradient(to bottom, #00835c, #00835c)`,
            color: "white",
            // backgroundSize: "100px 100px",
          }}
        >
          <div tw="flex flex-col items-center w-full w-48 h-48 overflow-hidden rounded-full">
            {/* <img src={frameData.avatar} alt="image" tw="object-cover" /> */}
            <img
              src={`${process.env.NEXT_PUBLIC_VERCEL_URL}/frames/check.jpg`}
              alt="image"
              tw="object-cover"
            />
          </div>

          <div
            style={{
              wordWrap: "break-word",
            }}
            tw="text-5xl mt-12 px-20 max-w-3xl w-full flex flex-col items-center"
          >
            {`Your request of ${amount} ETH has been submitted to @${frameUsername}.`}
          </div>
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
