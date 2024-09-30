"use client";

import { createLazyFileRoute } from "@tanstack/react-router";
import { Sidebar } from "@/components/Sidebar";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useActiveWallet } from "../hooks/useActiveWallet";
import { AssetDistributionChart } from "@/components/AssetDistributionChart";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { getAssetDetails } from "@/lib/assets";
import { HermesClient } from "@pythnetwork/hermes-client";

interface WalletBalance {
  symbol: string;
  logo: string;
  balance: number | string;
  value?: number;
}

interface ChartData {
  browser: string;
  visitors: number;
  fill: string;
}

const getTruncatedAddress = (address: string) => {
  return address.slice(0, 6) + "..." + address.slice(-4);
};

export const Route = createLazyFileRoute("/overview")({
  component: Index,
});

function Index() {
  const { wallet, walletBalance } = useActiveWallet();
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [tokenBalances, setTokenBalances] = useState<WalletBalance[]>([]);
  const [nftBalances, setNftBalances] = useState<WalletBalance[]>([]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Address copied to clipboard");
  };

  const fetchPriceUpdateDataAndGetBalances = async () => {
    const connection = new HermesClient("https://hermes.pyth.network/");

    const ETH_PRICE_FEED_ID =
      "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace"; // ETH/USD
    const BTC_PRICE_FEED_ID =
      "0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43";

    // Latest price updates
    const ethPriceUpdates = await connection.getLatestPriceUpdates([
      ETH_PRICE_FEED_ID,
    ]);
    const btcPriceUpdates = await connection.getLatestPriceUpdates([
      BTC_PRICE_FEED_ID,
    ]);

    //@ts-expect-error - price is not defined in the type
    const btcPrice = btcPriceUpdates.parsed[0].price.price / 10 ** 8;
    //@ts-expect-error - price is not defined in the type
    const ethPrice = ethPriceUpdates.parsed[0].price.price / 10 ** 8;

    await getBalances(ethPrice, btcPrice);
  };

  async function getBalances(ethPrice: number, btcPrice: number) {
    await wallet?.getBalances().then((balances) => {
      // console.log(balances.balances);
      balances.balances.forEach((balance) => {
        const asset = getAssetDetails(balance.assetId);
        if (!asset) return;
        if (asset.assetType === "token") {
          const usdValue =
            asset.symbol == "ETH"
              ? Number(balance.amount.formatUnits(asset.decimals)) * ethPrice
              : asset.symbol == "BTC"
                ? Number(balance.amount.formatUnits(asset.decimals)) * btcPrice
                : Number(balance.amount.formatUnits(asset.decimals)) * 1;
          setTokenBalances((prev) => {
            const exists = prev.some((item) => item.symbol === asset.symbol);
            if (exists) {
              return prev;
            }

            return [
              ...prev,
              {
                symbol: asset.symbol,
                logo: asset.logo,
                balance: balance.amount.formatUnits(asset.decimals),
                value: usdValue,
              },
            ];
          });
          setChartData((prev) => {
            const exists = prev.some((item) => item.browser === asset.symbol);
            if (exists) {
              return prev;
            }
            return [
              ...prev,
              {
                browser: asset.symbol,
                visitors: usdValue,
                fill: asset.fill,
              },
            ];
          });
        } else {
          setNftBalances((prev) => {
            const exists = prev.some((item) => item.symbol === asset.symbol);
            if (exists) {
              return prev;
            }

            return [
              ...prev,
              {
                symbol: asset.symbol,
                logo: asset.logo,
                balance: balance.amount.toNumber(),
              },
            ];
          });
        }
      });
    });
  }

  useEffect(() => {
    if (wallet) {
      fetchPriceUpdateDataAndGetBalances();
    }
  }, [wallet]);

  return (
    <>
      <Sidebar />
      <div className="col-start-3 col-end-13 pr-20 pl-96 py-10 flex flex-col gap-4">
        <div className="mb-6 flex justify-between  rounded-lg shadow-md">
          <div className="flex items-center gap-2">
            <Avatar className="h-32 w-32 p-4">
              <AvatarImage src="/logo.png" />
              <AvatarFallback>Avatar</AvatarFallback>
            </Avatar>
            <div>
              {wallet && (
                <div className="flex flex-col gap-2">
                  <div className="text-3xl font-semibold flex justify-center gap-4">
                    {getTruncatedAddress(wallet.address.toB256() as string)}
                    <img
                      src="/copy.svg"
                      alt="copy"
                      className="cursor-pointer h-5 hover:opacity-80 active:scale-[90%]"
                      onClick={() =>
                        copyToClipboard(wallet.address.toB256() as string)
                      }
                    />
                  </div>
                  <span
                    data-testid="wallet-balance"
                    className="text-gray-400 text-lg "
                  >
                    ETH Balance :{" "}
                    {walletBalance?.format({
                      precision: 3,
                    })}{" "}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="w-[40%]">
            <AssetDistributionChart chartData={chartData} />
          </div>
        </div>
        {/* Tabs for Assets, NFTs, Activity */}
        <div className=" border rounded-lg shadow-md p-4 border-none">
          <Tabs defaultValue="assets">
            <TabsList className="bg-black">
              <TabsTrigger value="assets">Assets</TabsTrigger>
              <TabsTrigger value="nfts">NFTs</TabsTrigger>
            </TabsList>

            <TabsContent value="assets">
              <div className="mt-4 flex flex-col gap-4">
                {/* Token List under Assets */}
                {tokenBalances.map((balance) => (
                  <div className="flex justify-between p-4 border border-gray-500 bg-gray-200 bg-opacity-15 rounded-lg shadow-md">
                    <div className="flex items-center gap-2">
                      <img
                        src={balance.logo}
                        alt="Starknet"
                        className="h-6 w-6 rounded-full"
                      />
                      <div>
                        <h3>{balance.symbol}</h3>
                      </div>
                    </div>
                    <div className="text-right">
                      <p>
                        Balance : {balance.balance} {balance.symbol}
                      </p>
                      <p>Value : ${balance.value?.toFixed(3)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="nfts">
              <div className="mt-4 flex flex-col gap-4">
                {/* Token List under Assets */}
                {nftBalances.map((balance) => (
                  <div className="flex justify-between p-4 border border-gray-500 bg-gray-200 bg-opacity-15 rounded-lg shadow-md">
                    <div className="flex items-center gap-2">
                      <img
                        src={balance.logo}
                        alt="Starknet"
                        className="h-6 w-6 rounded-full"
                      />
                      <div>
                        <h3>{balance.symbol}</h3>
                      </div>
                    </div>
                    <div className="text-right">
                      <p>Quantity : {balance.balance} </p>
                      {/* <p>Value : $2,300</p> */}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
