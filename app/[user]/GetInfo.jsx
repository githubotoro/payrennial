"use server";

export async function getInfo({ user }) {
  try {
    const AIRSTACK_API_URL = "https://api.airstack.xyz/graphql";
    const AIRSTACK_API_KEY = process.env.AIRSTACK_API_KEY;

    const data = {
      status: 200,
      profile: {
        Wallet: {
          poaps: [
            {
              id: "004ec68b0f8d53c7215a0c98cb02eaeb05393963302f1b57e8999f0bea0b150f",
              tokenUri: "https://api.poap.tech/metadata/80393/5860961",
            },
            {
              id: "035ab27caa2009f556846f12eff0581b4bb404a4da8390e4793202027620f8a7",
              tokenUri: "https://api.poap.tech/metadata/79011/5819739",
            },
            {
              id: "0384373c700892200b23c480910007ca89440d60d1f50c788d5245ad268328e6",
              tokenUri: "https://api.poap.tech/metadata/15678/3055722",
            },
            {
              id: "038e47155da2c3f5c2307810e3e0ef73d518959cfd5474b0b49b2a88fbbe37de",
              tokenUri: "https://api.poap.tech/metadata/76134/5766004",
            },
            {
              id: "03910d716be87acbc847d979039462df3409fec9f9b71170d16f9fe1a09f4136",
              tokenUri: "https://api.poap.tech/metadata/149333/6790160",
            },
            {
              id: "03be2ec352765bb7425f9f4e7099c9936c8f5941b05da1a2e856e8b59cbce211",
              tokenUri: "https://api.poap.tech/metadata/117166/6513270",
            },
            {
              id: "0a0c29657bb0737a5fd5d5adb4d49cd4a856ee411de6dfe61fc2e45c3fccdca5",
              tokenUri: "https://api.poap.tech/metadata/6583/952831",
            },
            {
              id: "0ac844b3217f8e7a7f4b2233146404208e2bf22ded34f319ce2386e1cb1760e3",
              tokenUri: "https://api.poap.tech/metadata/74916/5746683",
            },
            {
              id: "0accf1258a5b45b751ae5b2efac31cc4cde5899d0e95ab06cb5766bbce62f323",
              tokenUri: "https://api.poap.tech/metadata/69822/5767495",
            },
            {
              id: "0b11426ba75fdeb27d286657222965e93a9d55cd1ec0aec1029fea1abb9b5a9f",
              tokenUri: "https://api.poap.tech/metadata/68648/5759090",
            },
            {
              id: "004ec68b0f8d53c7215a0c98cb02eaeb05393963302f1b57e8999f0bea0b150f",
              tokenUri: "https://api.poap.tech/metadata/80393/5860961",
            },
            {
              id: "035ab27caa2009f556846f12eff0581b4bb404a4da8390e4793202027620f8a7",
              tokenUri: "https://api.poap.tech/metadata/79011/5819739",
            },
            {
              id: "0384373c700892200b23c480910007ca89440d60d1f50c788d5245ad268328e6",
              tokenUri: "https://api.poap.tech/metadata/15678/3055722",
            },
            {
              id: "038e47155da2c3f5c2307810e3e0ef73d518959cfd5474b0b49b2a88fbbe37de",
              tokenUri: "https://api.poap.tech/metadata/76134/5766004",
            },
            {
              id: "03910d716be87acbc847d979039462df3409fec9f9b71170d16f9fe1a09f4136",
              tokenUri: "https://api.poap.tech/metadata/149333/6790160",
            },
            {
              id: "03be2ec352765bb7425f9f4e7099c9936c8f5941b05da1a2e856e8b59cbce211",
              tokenUri: "https://api.poap.tech/metadata/117166/6513270",
            },
            {
              id: "0a0c29657bb0737a5fd5d5adb4d49cd4a856ee411de6dfe61fc2e45c3fccdca5",
              tokenUri: "https://api.poap.tech/metadata/6583/952831",
            },
            {
              id: "0ac844b3217f8e7a7f4b2233146404208e2bf22ded34f319ce2386e1cb1760e3",
              tokenUri: "https://api.poap.tech/metadata/74916/5746683",
            },
            {
              id: "0accf1258a5b45b751ae5b2efac31cc4cde5899d0e95ab06cb5766bbce62f323",
              tokenUri: "https://api.poap.tech/metadata/69822/5767495",
            },
            {
              id: "0b11426ba75fdeb27d286657222965e93a9d55cd1ec0aec1029fea1abb9b5a9f",
              tokenUri: "https://api.poap.tech/metadata/68648/5759090",
            },
          ],
          domains: [
            {
              name: "quantumdapps.eth",
              isPrimary: false,
            },
            {
              name: "quantumsmartcontracts.eth",
              isPrimary: false,
            },
            {
              name: "tornado-ui.eth",
              isPrimary: false,
            },
            {
              name: "$tmnt.eth",
              isPrimary: false,
            },
            {
              name: "7860000.eth",
              isPrimary: false,
            },
            {
              name: "vitalik.dev.eth",
              isPrimary: false,
            },
            {
              name: "satoshinart.eth",
              isPrimary: false,
            },
            {
              name: "ethereum.enschatbot.eth",
              isPrimary: false,
            },
            {
              name: "eth.soy.eth",
              isPrimary: false,
            },
            {
              name: "zuzaluventure.eth",
              isPrimary: false,
            },
          ],
          xmtp: [
            {
              id: "9b95cd544b48ab401f0ec3d73d5e8e08",
              isXMTPEnabled: true,
              owner: {
                identity: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
                addresses: ["0xd8da6bf26964af9d7eed9e03e53415d37aa96045"],
              },
              blockchain: "ethereum",
            },
            {
              id: "",
              isXMTPEnabled: false,
              owner: {
                identity: "0xadd746be46ff36f10c81d6e3ba282537f4c68077",
                addresses: ["0xadd746be46ff36f10c81d6e3ba282537f4c68077"],
              },
              blockchain: "",
            },
          ],
          socials: [
            {
              dappName: "farcaster",
              userAssociatedAddresses: [
                "0xadd746be46ff36f10c81d6e3ba282537f4c68077",
                "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
              ],
              fnames: ["vitalik.eth", "vbuterin"],
              profileName: "vitalik.eth",
              profileDisplayName: "Vitalik Buterin",
              profileImage: "https://i.imgur.com/IzJxuId.jpg",
              profileUrl: "",
              profileBio: "hullo",
              dappSlug: "farcaster_v2_optimism",
              coverImageURI: "",
              twitterUserName: "",
              website: "",
              followerCount: 177991,
              followingCount: 72,
              location: "",
            },
            {
              dappName: "lens",
              userAssociatedAddresses: [
                "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
              ],
              fnames: null,
              profileName: "lens/@vitalik",
              profileDisplayName: "Vitalik Buterin",
              profileImage:
                "ipfs://QmQP1DyNH8upeBxKJYtfCDdUj3mRcZep8zhJTLe3ePXB7M",
              profileUrl: "",
              profileBio:
                "Ethereum\n\nFable of the Dragon Tyrant (not mine but it's important): https://www.youtube.com/watch?v=cZYNADOHhVY\n\nAbolish daylight savings time and leap seconds",
              dappSlug: "lens_v2_polygon",
              coverImageURI: "",
              twitterUserName: "",
              website: "",
              followerCount: 16688,
              followingCount: 7,
              location: "",
            },
          ],
        },
      },
    };

    return data;

    // const query = `
    // query MecasterProfile {
    //   Wallet(input: {identity: "fc_fname:${user}", blockchain: ethereum}) {
    //     poaps(input: {limit: 10}) {
    //       id
    //       tokenUri
    //     }
    //     domains(input: {limit: 10}) {
    //       name
    //       isPrimary
    //     }
    //     xmtp(input: {blockchain: ALL, filter: {owner: {_eq: identity}}}) {
    //       id
    //       isXMTPEnabled
    //       owner {
    //         identity
    //         addresses
    //       }
    //       blockchain
    //     }
    //     socials(input: {filter: {dappName: {_in: [lens, farcaster]}}}) {
    //       dappName
    //       userAssociatedAddresses
    //       fnames
    //       profileName
    //       profileDisplayName
    //       profileImage
    //       profileUrl
    //       profileBio
    //       dappSlug
    //       coverImageURI
    //       twitterUserName
    //       website
    //       followerCount
    //       followingCount
    //       location
    //     }
    //   }
    // }
    // `;

    // const profile = await fetch(AIRSTACK_API_URL, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: AIRSTACK_API_KEY,
    //   },
    //   body: JSON.stringify({ query }),
    // });
    // const json = await profile.json();
    // const data = json.data;

    // return { status: 200, profile: data };
  } catch (err) {
    console.log(err);
    return {
      status: "500",
      message: "Internal Server Error",
    };
  }
}
