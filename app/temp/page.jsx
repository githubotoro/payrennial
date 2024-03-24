import { fetchMetadata } from "frames.js/next";

export async function generateMetadata({ params }) {
  const metadata = await fetchMetadata(
    new URL("/api/temp", process.env.NEXT_PUBLIC_VERCEL_URL)
  );

  console.log(metadata);

  return {
    title: "My page",
    ...metadata,
  };
}

export default function Page() {
  return <span>My existing page</span>;
}
