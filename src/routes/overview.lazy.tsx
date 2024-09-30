"use client";

import { createLazyFileRoute } from "@tanstack/react-router";
import { Sidebar } from "@/components/Sidebar";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../components/ui/tabs";
import { Check, Copy } from "lucide-react";
import { PieChart, Pie } from "recharts";
// import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { AssetDistributionChart } from "@/components/overview/AssetDistributionChart";

export const Route = createLazyFileRoute("/overview")({
  component: Index,
});

function Index() {
  // Data for pie chart
  const data = [{ name: "STRK", value: 100 }];
  const COLORS = ["#003399"];
  const [isCopied, setIsCopied] = useState(false);
  const walletAddress = "0x01b1...F406";

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    });
  };

  return (
    <>
      <Sidebar />
      <div className="col-start-3 col-end-13 pr-20 pl-96 py-10 flex flex-col gap-4">
        {/* <div className=" flex relative mb-6 items-center gap-2 rounded-lg max-w-md">
          <Search size={20} className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
          <Input
            placeholder="Search for vault"
            className="flex-1 pl-10"
          />
        </div> */}

        <div className="flex justify-between items-center">
          {/* Account Info Section */}

          <div className="mb-6 flex justify-between items-center p-4 rounded-lg shadow-md">
            <div className="flex items-center gap-2">
              <Avatar className="h-28 w-28">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-semibold">
                  {walletAddress}
                  <button onClick={handleCopy} className="ml-2">
                    {isCopied ? (
                      <>
                        <Check
                          size={20}
                          className="inline-block text-green-500  font-bold"
                        />
                      </>
                    ) : (
                      <>
                        <Copy size={20} className="inline-block font-bold" />
                      </>
                    )}
                  </button>
                </h2>
                <p className="text-xl">$0.23</p>
              </div>
            </div>
            {/* <div className="flex gap-2">
            <Button variant="outline" className="px-4 py-2 rounded-lg bg-gray-100 text-black">
              Remove account
            </Button>
            <Button variant="outline" className="px-4 py-2 rounded-lg bg-gray-100 text-black">
              Send to
            </Button>
          </div> */}
          </div>
          <AssetDistributionChart />
        </div>
        {/* Tabs for Assets, NFTs, Activity */}
        <div className=" border rounded-lg shadow-md p-4">
          <Tabs defaultValue="assets">
            <TabsList className="bg-black">
              <TabsTrigger value="assets">Assets</TabsTrigger>
              <TabsTrigger value="nfts">NFTs</TabsTrigger>
            </TabsList>

            <TabsContent value="assets">
              <div className="mt-4">
                {/* Token List under Assets */}
                <div className="flex justify-between p-4 border rounded-lg shadow-md">
                  <div className="flex items-center gap-2">
                    <img
                      src="/starknet.png"
                      alt="Starknet"
                      className="h-6 w-6 rounded-full"
                    />
                    <div>
                      <h3>VAULT</h3>
                    </div>
                  </div>
                  <div>
                    <p>0.4997</p>
                    <p>$0.23</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="nfts">
              <div className="mt-4">
                {/* NFTs Content */}
                <div className="flex justify-between p-4 border rounded-lg shadow-md">
                  <p>No NFTs available</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
