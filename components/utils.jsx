import { headers } from "next/headers";

export function currentURL(pathname) {
  const headersList = headers();
  const host = headersList.get("x-forwarded-host") || headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") || "http";

  try {
    return new URL(pathname, `${protocol}://${host}`);
  } catch (error) {
    return new URL("https://payrennial.vercel.app");
  }
}

export function vercelURL() {
  return process.env.VERCEL_URL ? `${process.env.VERCEL_URL}` : undefined;
}
