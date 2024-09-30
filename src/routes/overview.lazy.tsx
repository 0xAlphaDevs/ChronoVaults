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

const getTruncatedAddress = (address: string) => {
  return address.slice(0, 6) + "..." + address.slice(-4);
};

export const Route = createLazyFileRoute("/overview")({
  component: Index,
});

function Index() {
  // const chartData = [
  //   { browser: "Asset 1", visitors: 200, fill: "var(--color-chrome)" },
  //   { browser: "Asset 2", visitors: 100, fill: "var(--color-safari)" },
  //   { browser: "Asset 3", visitors: 500, fill: "var(--color-firefox)" },
  //   { browser: "other", visitors: 5000, fill: "var(--color-other)" },
  // ];
  // Data for pie chart
  const { wallet, walletBalance } = useActiveWallet();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Address copied to clipboard");
  };

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
            <AssetDistributionChart />
          </div>
          {/* <Card className="flex flex-col bg-inherit border-none">
            <CardContent className="flex-1 pb-0">
              <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square max-h-[250px] "
              >
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={chartData}
                    dataKey="visitors"
                    nameKey="browser"
                    innerRadius={70}
                    strokeWidth={5}
                  >
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          return (
                            <text
                              x={viewBox.cx}
                              y={viewBox.cy}
                              textAnchor="middle"
                              dominantBaseline="middle"
                              className=" fill-white"
                            >
                              <tspan
                                x={viewBox.cx}
                                y={viewBox.cy}
                                className=" text-white text-3xl font-bold"
                              >
                                ${totalVisitors.toLocaleString()}
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 24}
                                className="fill-white text-white"
                              >
                                Portfolio Value
                              </tspan>
                            </text>
                          );
                        }
                      }}
                    />
                  </Pie>
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card> */}
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
                <div className="flex justify-between p-4 border border-gray-500 bg-gray-200 bg-opacity-15 rounded-lg shadow-md">
                  <div className="flex items-center gap-2">
                    <img
                      src="/logo.png"
                      alt="Starknet"
                      className="h-6 w-6 rounded-full"
                    />
                    <div>
                      <h3>ETH</h3>
                    </div>
                  </div>
                  <div className="text-right">
                    <p>Balance : 0.4997 ETH</p>
                    <p>Value : $2,300</p>
                  </div>
                </div>
                <div className="flex justify-between p-4 border border-gray-500 bg-gray-200 bg-opacity-15 rounded-lg shadow-md">
                  <div className="flex items-center gap-2">
                    <img
                      src="/logo.png"
                      alt="Starknet"
                      className="h-6 w-6 rounded-full"
                    />
                    <div>
                      <h3>ETH</h3>
                    </div>
                  </div>
                  <div className="text-right">
                    <p>Balance : 0.4997 ETH</p>
                    <p>Value : $2,300</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="nfts">
              <div className="mt-4 flex flex-col gap-4">
                {/* Token List under Assets */}
                <div className="flex justify-between p-4 border border-gray-500 bg-gray-200 bg-opacity-15 rounded-lg shadow-md">
                  <div className="flex items-center gap-2">
                    <img
                      src="/logo.png"
                      alt="Starknet"
                      className="h-6 w-6 rounded-full"
                    />
                    <div>
                      <h3>APE NFT</h3>
                    </div>
                  </div>
                  <div className="text-right">
                    <p>Floor Price : 0.4997 ETH</p>
                    <p>Value : $2,300</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
