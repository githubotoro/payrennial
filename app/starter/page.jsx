import {
  FrameButton,
  FrameContainer,
  FrameImage,
  getPreviousFrame,
} from "frames.js/next/server";
import { currentURL } from "@/components/Utils";
import Link from "next/link";

const totalPages = 5;
const initialState = { pageIndex: 0 };

const reducer = (state, action) => {
  const buttonIndex = action.postBody?.untrustedData.buttonIndex;

  return {
    pageIndex: buttonIndex
      ? (state.pageIndex + (buttonIndex === 2 ? 1 : -1)) % totalPages
      : state.pageIndex,
  };
};

export default async function Page({ searchParams }) {
  const url = currentURL("/test");
  const previousFrame = getPreviousFrame(searchParams);
  const [state] = useFramesReducer(reducer, initialState, previousFrame);

  return (
    <div>
      <FrameContainer
        pathname="/test"
        postUrl="/test"
        state={state}
        previousFrame={previousFrame}
      >
        <FrameImage>
          <div tw="flex flex-col">
            {/* <img width={573} height={300} src={imageUrl} alt="Image" /> */}
            <div tw="flex">
              This is slide {state.pageIndex + 1} / {totalPages}
            </div>
          </div>
        </FrameImage>
        <FrameButton>←</FrameButton>
        <FrameButton>→</FrameButton>
      </FrameContainer>
    </div>
  );
}
