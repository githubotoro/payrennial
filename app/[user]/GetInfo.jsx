"use server";

export async function getInfo({ user }) {
  try {
    const AIRSTACK_API_URL = "https://api.airstack.xyz/graphql";
    const AIRSTACK_API_KEY = process.env.AIRSTACK_API_KEY;

    const query = `
    query MecasterProfile {
      Wallet(input: {identity: "fc_fname:${user}", blockchain: ethereum}) {
        poaps(input: {limit: 10}) {
          id
          tokenUri
        }
        domains(input: {limit: 10}) {
          name
          isPrimary
        }
        xmtp(input: {blockchain: ALL, filter: {owner: {_eq: identity}}}) {
          id
          isXMTPEnabled
          owner {
            identity
            addresses
          }
          blockchain
        }
        socials(input: {filter: {dappName: {_in: [lens, farcaster]}}}) {
          dappName
          userAssociatedAddresses
          fnames
          profileName
          profileDisplayName
          profileImage
          profileUrl
          profileBio
          dappSlug
          coverImageURI
          twitterUserName
          website
          followerCount
          followingCount
          location
        }
      }
    }
    `;

    const profile = await fetch(AIRSTACK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: AIRSTACK_API_KEY,
      },
      body: JSON.stringify({ query }),
    });
    const json = await profile.json();
    const data = json.data;

    return { status: 200, profile: data };
  } catch (err) {
    console.log(err);
    return {
      status: "500",
      message: "Internal Server Error",
    };
  }
}
