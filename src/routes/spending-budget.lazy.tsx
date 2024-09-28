"use client";

import { createLazyFileRoute } from "@tanstack/react-router";
// import { Button } from "../components/Button";
// import { Input } from "../components/Input";
// import { Link } from "../components/Link";
// import { useActiveWallet } from "../hooks/useActiveWallet";
// import { TimeLockPredicate } from "../sway-api/predicates/index";
// import { FAUCET_LINK } from "../lib";
// import { BN, InputValue, Predicate } from "fuels";
// import { bn } from "fuels";
import { useState } from "react";
// import toast from "react-hot-toast";
// import useAsync from "react-use/lib/useAsync";
import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { DollarSign, Percent, PiggyBank, TrendingUp, CirclePlusIcon } from 'lucide-react';

export const Route = createLazyFileRoute("/spending-budget")({
  component: Index,
});


// Mock data for existing vaults
const mockSpendingVaults = [
  { id: 1, name: "Monthly Budget", limit: 1000, weeklyPercentage: 25, spent: 750 },
  { id: 2, name: "Groceries", limit: 400, weeklyPercentage: 25, spent: 150 },
  { id: 3, name: "Entertainment", limit: 200, weeklyPercentage: 50, spent: 180 },
];

function Index() {
  // let baseAssetId: string;
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // const { wallet, walletBalance, refreshWalletBalance } = useActiveWallet();

  // const [predicate, setPredicate] = useState<Predicate<InputValue[]>>();

  // const [predicateBalance, setPredicateBalance] = useState<BN>();

  // const [pin, setPin] = useState<string>();

  // useAsync(async () => {
  //   if (wallet) {
  //     baseAssetId = wallet.provider.getBaseAssetId();
  //     // Initialize a new predicate instance with receiver and deadline
  //     const configurable = {
  //       RECEIVER: {
  //         bits: "0xf1462bc68ea62dd89921498b949ab8bdec694fdd184ba466517b0c2eeb26b1c0",
  //       },
  //       DEADLINE: 1727413991,
  //     };
  //     // Initialize a new predicate instance
  //     const predicate = new TimeLockPredicate({
  //       provider: wallet.provider,
  //       configurableConstants: configurable,
  //     });
  //     setPredicate(predicate);
  //     setPredicateBalance(await predicate.getBalance());
  //   }
  // }, [wallet]);

  // const refreshBalances = async () => {
  //   await refreshWalletBalance?.();
  //   setPredicateBalance(await predicate?.getBalance());
  // };

  // const transferFundsToPredicate = async (amount: BN) => {
  //   try {
  //     console.log("Transferring funds to predicate...");
  //     console.log("Predicate: ", predicate);
  //     console.log("Predicate address", predicate?.address);
  //     if (!predicate) {
  //       return toast.error("Predicate not loaded");
  //     }

  //     console.log("Wallet: ", wallet);

  //     if (!wallet) {
  //       return toast.error("Wallet not loaded");
  //     }

  //     await wallet.transfer(predicate.address, amount, baseAssetId, {
  //       gasLimit: 10_000,
  //     });

  //     await refreshBalances();

  //     return toast.success("Funds transferred to predicate.");
  //   } catch (e) {
  //     console.error(e);
  //     toast.error(
  //       <span>
  //         Failed to transfer funds. Please make sure your wallet has enough
  //         funds. You can top it up using the{" "}
  //         <Link href={FAUCET_LINK} target="_blank">
  //           faucet.
  //         </Link>
  //       </span>
  //     );
  //   }
  // };

  // const unlockPredicateAndTransferFundsBack = async (amount: BN) => {
  //   try {
  //     if (!wallet) {
  //       return toast.error("Wallet not loaded");
  //     }

  //     // Initialize a new predicate instance with receiver and deadline
  //     const configurable = {
  //       RECEIVER: {
  //         bits: "0xf1462bc68ea62dd89921498b949ab8bdec694fdd184ba466517b0c2eeb26b1c0",
  //       },
  //       DEADLINE: 1727413991,
  //     };
  //     const reInitializePredicate = new TimeLockPredicate({
  //       provider: wallet.provider,
  //       configurableConstants: configurable,
  //       data: [configurable.RECEIVER, 1727413992],
  //     });

  //     if (!reInitializePredicate) {
  //       return toast.error("Failed to initialize predicate");
  //     }

  //     /*
  //       Try to 'unlock' the predicate and transfer the funds back to the wallet.
  //       If the pin is correct, this transfer transaction will succeed.
  //       If the pin is incorrect, this transaction will fail.
  //      */
  //     const tx = await reInitializePredicate.transfer(
  //       wallet.address,
  //       amount,
  //       baseAssetId
  //     );
  //     const { isStatusSuccess } = await tx.wait();

  //     if (!isStatusSuccess) {
  //       toast.error("Failed to unlock predicate");
  //     }

  //     if (isStatusSuccess) {
  //       toast.success("Predicate unlocked");
  //     }

  //     await refreshBalances();
  //   } catch (e) {
  //     console.error(e);
  //     toast.error(
  //       "Failed to unlock predicate. You probably entered the wrong pin, or the predicate does not have enough balance. Try again."
  //     );
  //   }
  // };

  return (
    <>
      <Sidebar />
      <div className="col-start-3 col-end-13 pr-20 pl-96 py-10 flex flex-col gap-4">
        <div className="container mx-auto p-6  min-h-screen">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold ">Spending Budget Vaults</h1>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-semibold">
                  <CirclePlusIcon className="h-4 w-4" />
                  <span>Create Conditional Release Vault</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create Spending Budget Vault</DialogTitle>
                  <DialogDescription>Set up a new spending budget with monthly limit and weekly percentage.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="vaultName">Vault Name</Label>
                    <Input id="vaultName" placeholder="e.g., Monthly Budget" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="monthlyLimit">Monthly Limit</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input id="monthlyLimit" placeholder="Enter amount" type="number" className="pl-10" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weeklyPercentage">Weekly Percentage</Label>
                    <div className="relative">
                      <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input id="weeklyPercentage" placeholder="25%" type="number" max="100" className="pl-10" />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" className="bg-green-500 hover:bg-green-600 text-white w-full">Create Vault</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
            {mockSpendingVaults.map((vault) => (
              <Card key={vault.id} className="overflow-hidden transition-shadow duration-300 hover:shadow-lg">
                <CardHeader className="bg-gradient-to-r from-yellow-200 to-green-600 text-black">
                  <CardTitle className="flex items-center">
                    <PiggyBank className="mr-2 h-6 w-6" />
                    {vault.name}
                  </CardTitle>
                  <CardDescription className="text-black">Monthly Limit: ${vault.limit}</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-500">Spent</span>
                      <span className="text-lg font-semibold text-gray-700">${vault.spent}</span>
                    </div>
                    <Progress
                      value={(vault.spent / vault.limit) * 100}
                      className="h-2 bg-gray-200"
                    />
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Progress</span>
                      <span className="font-medium text-gray-700">{Math.round((vault.spent / vault.limit) * 100)}%</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <TrendingUp className="mr-2 h-4 w-4 text-blue-500" />
                      <span>Weekly limit: {vault.weeklyPercentage}%</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 border-t flex items-center gap-8">
                  <Button variant="outline" className="w-full mt-4">Deposit</Button>
                  <Button variant="outline" className="w-full mt-4">Withdraw</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
        {/* <div className="flex items-center justify-between">
          <p className="font-semibold text-xl">Spending Budget Vaults</p>
          <Button className="flex items-center gap-2">
            <CirclePlusIcon className="h-4 w-4" />
            <span>Create Spending Budget Vault</span>
          </Button>
        </div>

        <div className="mt-12 items-baseline flex gap-2">
          <h5 className="font-semibold text-xl">Wallet Balance:</h5>
          <span className="text-gray-400">
            {walletBalance?.format({
              precision: 6,
            })}{" "}
            ETH
          </span>
        </div>

        <div className="items-baseline flex gap-2">
          <h5 className="font-semibold text-xl">Predicate Balance:</h5>
          <span className="text-gray-400">
            {predicateBalance?.format({
              precision: 6,
            })}{" "}
            ETH
          </span>
        </div> */}

        {/* <Button
        onClick={async () =>
          await transferFundsToPredicate(bn.parseUnits("0.001"))
        }
      >
        Transfer 0.1 ETH to Predicate
      </Button> */}
        {/* <Button
          onClick={async () =>
            await transferFundsToPredicate(bn.parseUnits("0.001"))
          }
        >
          Transfer 0.001 ETH to Time Lock Predicate
        </Button>

        <Input
          className="w-[300px] mt-8"
          value={pin as string}
          onChange={(e) => setPin(e.target.value)}
          placeholder="Hint - the correct pin is 1337"
        />

        <Button
          onClick={async () =>
            await unlockPredicateAndTransferFundsBack(bn.parseUnits("0.0009"))
          }
        >
          Unlock Predicate and Transfer 0.0009 ETH back to Wallet
        </Button> */}
      </div>
    </>

  );
}
