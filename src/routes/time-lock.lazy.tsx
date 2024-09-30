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
import TimeLockVaultCard from "@/components/TimeLockVaultCard";

export const Route = createLazyFileRoute("/time-lock")({
  component: Index,
});

interface TimeLockVault {
  id: number;
  name: string;
  saved: number;
  vaultGoal: number;
  lockPeriod: number;
  createdAt: Date;
}

// Mock data for time-locked vaults
const mockTimeLockVaults: TimeLockVault[] = [
  {
    id: 1,
    name: "College Fund",
    saved: 1000,
    vaultGoal: 1000,
    lockPeriod: 30, // lock period in days
    createdAt: new Date("2024-01-01"),
  },
  {
    id: 2,
    name: "Retirement Fund",
    saved: 5000,
    vaultGoal: 10000,
    lockPeriod: 90, // lock period in days
    createdAt: new Date("2024-02-01"),
  },
];

function Index() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [vaultForm, setVaultForm] = useState<{
    vaultName: string;
    receiver: string;
    amount: string;
    lockDate: string | undefined;
  }>({
    vaultName: "",
    receiver: "",
    amount: "",
    lockDate: undefined,
  });

  // Function to handle vault form input changes
  const handleVaultFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setVaultForm((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Function to handle vault creation
  const handleCreateVault = () => {
    console.log("Vault Data: ", vaultForm);
    setIsDialogOpen(false);
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <>
      <Sidebar />
      <div className="col-start-3 col-end-13 pr-20 pl-96 py-10 flex flex-col gap-4">
        <div className="container mx-auto p-6  min-h-screen">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold ">Time Lock Vaults</h1>
            {/* Create vault dialog */}
            {/* Create TimeLock Vault Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-semibold">
                  <CirclePlusIcon className="h-4 w-4" />
                  <span>Create Time Lock Vault</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create Time Lock Vault</DialogTitle>
                  <DialogDescription>
                    Set up a new time lock vault with name, receiver, amount,
                    and lock date.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  {/* Vault Name */}
                  <div className="space-y-2">
                    <Label htmlFor="vaultName">Vault Name</Label>
                    <Input
                      id="vaultName"
                      value={vaultForm.vaultName}
                      onChange={handleVaultFormChange}
                      placeholder="e.g., Vacation Fund"
                      required
                    />
                  </div>

                  {/* Receiver */}
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
                        required
                      />
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        id="amount"
                        value={vaultForm.amount}
                        onChange={handleVaultFormChange}
                        placeholder="Enter amount"
                        type="number"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {/* Date Input for Lock Period */}
                  <div className="space-y-2">
                    <Label htmlFor="lockDate">Lock Date</Label>
                    <Input
                      id="lockDate"
                      type="date" // Change to type="date"
                      value={vaultForm.lockDate || ""} // Set to empty string if undefined
                      onChange={handleVaultFormChange}
                      min={today}
                      required
                    />
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
            {mockTimeLockVaults.map((vault) => (
              <TimeLockVaultCard vault={vault} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
