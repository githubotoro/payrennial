import {
  FrameButton,
  FrameInput,
  FrameContainer,
  FrameImage,
  getPreviousFrame,
} from "frames.js/next/server";

export default function Page({ params, searchParams }) {
  const user = params.user;
  console.log(user);

  const previousFrame = getPreviousFrame(searchParams);

  return (
    <FrameContainer
      postUrl="/test/api"
      state={{
        pageIndex: 0,
      }}
      previousFrame={previousFrame}
      pathname={`/user/${user}`}
    >
      <FrameImage src="https://picsum.photos/seed/frames.js/1146/600" />
    </FrameContainer>
  );
}
