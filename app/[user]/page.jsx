import {
  FrameButton,
  FrameInput,
  FrameContainer,
  FrameImage,
  getPreviousFrame,
} from "frames.js/next/server";
import { getInfo } from "./GetInfo";
import { createDebugUrl } from "@/components/debug";
import { currentURL } from "@/components/utils";
import Link from "next/link";
import { fetchMetadata } from "frames.js/next";

export async function generateMetadata({ params }) {
  const user = params.user;

  const farcasterProfileRes = await fetch(
    `https://api.web3.bio/profile/farcaster/${user}`
  );
  const farcasterProfileData = await farcasterProfileRes.json();

  return {
    title: "New api example",
    description: "This is a new api example",
    other: {
      ...(await fetchMetadata(
        new URL(
          `/api/pay?frameUsername=${user}&frameUserAddress=${farcasterProfileData.address}`,
          `${process.env.NEXT_PUBLIC_VERCEL_URL}`
        )
      )),
    },
  };
}

// export default async function Home() {
//   const url = currentURL("/vitalik");

//   return (
//     <div>
//       Multi-page example
//       <Link href={createDebugUrl(url)} className="underline">
//         Debug
//       </Link>
//     </div>
//   );
// }

export default async function Page({ params, searchParams }) {
  const user = params.user;
  // const info = await getInfo({ user });
  // const profile = info.profile.Wallet;
  // const previousFrame = getPreviousFrame(searchParams);

  const farcasterProfileRes = await fetch(
    `https://api.web3.bio/profile/farcaster/${user}`
  );
  const farcasterProfileData = await farcasterProfileRes.json();

  const url = currentURL(`/${user}`);

  const initialState = {
    pageIndex: 0,
    frameUsername: params.user,
    frameUserAddress: farcasterProfileData.address,
    pageTag: "home",
  };

  return (
    <div>
      pay page
      <Link href={createDebugUrl(url)} className="underline">
        Debug
      </Link>
    </div>
  );

  return (
    <FrameContainer
      postUrl="/api/user"
      state={initialState}
      previousFrame={previousFrame}
      pathname={`/user/${user}`}
    >
      <FrameImage aspectRatio="1:1">
        <div tw="w-full h-full bg-black text-white justify-center items-center">
          trust me bro
        </div>
      </FrameImage>

      <FrameInput text="Enter Username" />

      <FrameButton action="post">Submit</FrameButton>
      <FrameButton>Pay</FrameButton>
      <FrameButton>Request</FrameButton>
      <FrameButton>✨ Get PayCaster</FrameButton>
    </FrameContainer>
  );
}
