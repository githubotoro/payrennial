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

export default async function Page({ params, searchParams }) {
  const user = params.user;
  const info = await getInfo({ user });
  const profile = info.profile.Wallet;
  const previousFrame = getPreviousFrame(searchParams);

  const url = currentURL(`/${user}`);

  const initialState = { pageIndex: 0, user: params.user };

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
