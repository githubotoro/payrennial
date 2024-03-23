import {
  FrameButton,
  FrameInput,
  FrameContainer,
  FrameImage,
  getPreviousFrame,
} from "frames.js/next/server";

export default function Page({ searchParams }) {
  const previousFrame = getPreviousFrame(searchParams);

  return (
    // <FrameContainer
    //   postUrl="/test/api"
    //   state={{
    //     pageIndex: 0,
    //   }}
    //   previousFrame={previousFrame}
    // >
    //   <FrameImage src="https://picsum.photos/seed/frames.js/1146/600" />
    //   {/* <FrameInput text="Page 1" /> */}
    // </FrameContainer>
    <div>hello</div>
  );
}
