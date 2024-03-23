import {
  FrameButton,
  FrameInput,
  FrameContainer,
  FrameImage,
  getPreviousFrame,
} from "frames.js/next/server";
import { getInfo } from "./GetInfo";

export default async function Page({ params, searchParams }) {
  const user = params.user;

  const info = await getInfo({ user });

  const profile = info.profile.Wallet;

  console.log(profile);

  const previousFrame = getPreviousFrame(searchParams);

  return (
    <FrameContainer
      postUrl="/api/user"
      state={{
        pageIndex: 0,
      }}
      previousFrame={previousFrame}
      pathname={`/user/${user}`}
    >
      <FrameImage aspectRatio="1:1">
        <div tw="w-full h-full bg-black text-white justify-center items-center">
          Hello world
        </div>
      </FrameImage>
      {/* <FrameButton>💰 Pay/Request</FrameButton>
      <FrameButton>👀 Stalk</FrameButton>
      <FrameButton>✨ Get MeCaster</FrameButton> */}

      <FrameButton>👀 Stalk</FrameButton>
      <FrameButton>Pay</FrameButton>
      <FrameButton>Request</FrameButton>
      <FrameButton>✨ Get MeCaster</FrameButton>
    </FrameContainer>
  );
}
