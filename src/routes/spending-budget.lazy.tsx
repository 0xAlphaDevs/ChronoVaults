"use client";

import { createLazyFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DollarSign, CirclePlusIcon, User } from "lucide-react";
import SpendingVaultCard from "@/components/SpendingVaultCard";
import { useActiveWallet } from "../hooks/useActiveWallet";
import toast from "react-hot-toast";

export const Route = createLazyFileRoute("/spending-budget")({
  component: Index,
});

interface SpendingVault {
  id: number;
  name: string;
  limit: number;
  weeklyPercentage: number;
  spent: number;
}

// Mock data for existing vaults
const mockSpendingVaults: SpendingVault[] = [
  {
    id: 1,
    name: "Monthly Budget",
    limit: 1000,
    weeklyPercentage: 25,
    spent: 750,
  },
  { id: 2, name: "Groceries", limit: 400, weeklyPercentage: 25, spent: 150 },
  {
    id: 3,
    name: "Entertainment",
    limit: 200,
    weeklyPercentage: 50,
    spent: 180,
  },
];

function Index() {
  const { wallet } = useActiveWallet();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [vaultForm, setVaultForm] = useState({
    vaultName: "",
    spendingLimit: "",
    timePeriod: "",
    receiver: wallet ? wallet.address.toB256() : "", // Initializing receiver with wallet address,
  });

  // Function to handle vault creation form input change
  const handleVaultFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setVaultForm((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Function to handle vault creation
  const handleCreateVault = () => {
    const currentUnixTimestamp = Math.floor(Date.now() / 1000);
    const timePeriodUnix = vaultForm.timePeriod
      ? Math.floor(new Date(vaultForm.timePeriod).getTime() / 1000)
      : null;

    const vaultData = {
      vaultName: vaultForm.vaultName,
      spendingLimit: vaultForm.spendingLimit,
      receiver: vaultForm.receiver,
      timePeriod: timePeriodUnix,
      createdAt: currentUnixTimestamp,
    };

    // Show success UI and log the data
    toast.success("Vault Created Successfully!");

    // Print the values to the console
    console.log("Vault Data: ", vaultData);

    // Reset form and close dialog
    setVaultForm({
      vaultName: "",
      spendingLimit: "",
      timePeriod: "",
      receiver: wallet ? wallet.address.toB256() : "",
    });
    setIsDialogOpen(false);
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <>
      <Sidebar />
      <div className="col-start-3 col-end-13 pr-20 pl-96 py-10 flex flex-col gap-4">
        <div className="container mx-auto p-6  min-h-screen">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold ">Spending Budget Vaults</h1>
            {/* Create vault dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-semibold">
                  <CirclePlusIcon className="h-4 w-4" />
                  <span>Create Spending Budget Vault</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create Spending Budget Vault</DialogTitle>
                  <DialogDescription>
                    Set up a new spending budget with monthly limit and weekly
                    percentage.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="vaultName">Vault Name</Label>
                    <Input
                      id="vaultName"
                      value={vaultForm.vaultName}
                      onChange={handleVaultFormChange}
                      placeholder="e.g., Monthly Budget"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="spendingLimit">Spending Limit</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        id="spendingLimit"
                        value={vaultForm.spendingLimit}
                        onChange={handleVaultFormChange}
                        placeholder="Enter amount"
                        type="number"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timePeriod">Time Period</Label>
                    <Input
                      id="timePeriod"
                      type="date" // Change to type="date"
                      value={vaultForm.timePeriod || ""} // Set to empty string if undefined
                      onChange={handleVaultFormChange}
                      min={today}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="receiver">Receiver Address</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        id="receiver"
                        value={vaultForm.receiver}
                        onChange={handleVaultFormChange}
                        placeholder="Enter receiver address"
                        className="pl-10"
                        disabled
                        required
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={handleCreateVault}
                    type="submit"
                    className="bg-green-500 hover:bg-green-600 text-white w-full"
                  >
                    Create Vault
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
            {mockSpendingVaults.map((vault) => (
              <SpendingVaultCard vault={vault} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
