interface Assets {
  [key: string]: Asset;
}

interface Asset {
  symbol: string;
  decimals: number;
  name: string;
  assetId: string;
  assetType: string;
  logo: string;
  fill: string;
}
const ASSETS: Assets = {
  "0xf8f8b6283d7fa5b672b530cbb84fcccb4ff8dc40f8176ef4544ddb1f1952ad07": {
    symbol: "ETH",
    decimals: 9,
    name: "Ethereum",
    assetId:
      "0xf8f8b6283d7fa5b672b530cbb84fcccb4ff8dc40f8176ef4544ddb1f1952ad07",
    assetType: "token",
    logo: "/eth.svg",
    fill: "var(--color-chrome)",
  },
  "0x3f007b72f7bcb9b1e9abe2c76e63790cd574b7c34f1c91d6c2f407a5b55676b9": {
    symbol: "USDT",
    decimals: 6,
    name: "Tether USD",
    assetId:
      "0x3f007b72f7bcb9b1e9abe2c76e63790cd574b7c34f1c91d6c2f407a5b55676b9",
    assetType: "token",
    logo: "/usdt.svg",
    fill: "var(--color-safari)",
  },
  "0xce90621a26908325c42e95acbbb358ca671a9a7b36dfb6a5405b407ad1efcd30": {
    symbol: "BTC",
    decimals: 8,
    name: "Bitcoin",
    assetId:
      "0xce90621a26908325c42e95acbbb358ca671a9a7b36dfb6a5405b407ad1efcd30",
    assetType: "token",
    logo: "/btc.svg",
    fill: "var(--color-firefox)",
  },
  "0x0ac6ebd4b71f052c63d7a65d7951f0d378e10cecdc5efae7b814cfffba8196bb": {
    symbol: "FNS (Fuel Name Service)",
    decimals: 0,
    name: "Fuel Name Service Domain",
    assetId:
      "0x0ac6ebd4b71f052c63d7a65d7951f0d378e10cecdc5efae7b814cfffba8196bb",
    assetType: "nft",
    logo: "/fns.svg",
    fill: "var(--color-other)",
  },
};

export function getAssetDetails(assetId: string) {
  return ASSETS[assetId];
}
