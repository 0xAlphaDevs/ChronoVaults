"use client";

import { createLazyFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
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
import {
  DollarSign,
  CirclePlusIcon,
  User,
  Calendar,
  LoaderCircle,
} from "lucide-react";
import SpendingVaultCard from "@/components/SpendingVaultCard";
import { useActiveWallet } from "../hooks/useActiveWallet";
import { SpendingBudgetPredicate } from "../sway-api/predicates/index";
import toast from "react-hot-toast";
import { bn, Provider } from "fuels";

export const Route = createLazyFileRoute("/spending-budget")({
  component: Index,
});

// To Change
interface SpendingVault {
  id: number;
  name: string;
  limit: number;
  weeklyPercentage: number;
  startTime: number;
  endTime: number;
  timePeriod: number;
  predicate: SpendingBudgetPredicate;
  predicateAddress?: string;
  daysLeft?: number;
}

// type for local storage vault data
interface SpendingBudgetVaultLocalStorage {
  vaultName: string;
  spendingLimit: string;
  receiver: string;
  startTime: number;
  endTime: number;
  timePeriod: number;
  createdAt: number;
}

const getTruncatedAddress = (address: string) => {
  return address.slice(0, 6) + "..." + address.slice(-4);
};

function Index() {
  const { wallet } = useActiveWallet();
  const [spendingVaults, setSpendingVaults] = useState<SpendingVault[]>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [vaultForm, setVaultForm] = useState({
    vaultName: "",
    spendingLimit: "",
    timePeriod: "",
    receiver: "", // Initializing receiver with wallet address,
  });
  const [loading, setLoading] = useState(false);

  // Function to handle vault creation form input change
  const handleVaultFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setVaultForm((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // get spending vaults from local storage and refresh
  async function refreshVaults() {
    const vaults = JSON.parse(
      localStorage.getItem("spending-budget-vaults") || "[]"
    );

    // console.log("Vaults: ", vaults);
    const spendingVaults: SpendingVault[] = [];

    vaults.forEach((vault: SpendingBudgetVaultLocalStorage, index: number) => {
      // calculate predicate address and get balance
      const configurable = {
        RECEIVER: {
          bits: vault.receiver,
        },
        AMOUNT: Number(vault.spendingLimit) * 10 ** 6,
        START_TIME: vault.startTime,
        TIME_PERIOD: vault.timePeriod,
      };

      const predicate = new SpendingBudgetPredicate({
        provider: wallet?.provider as Provider,
        configurableConstants: configurable,
      });

      // console.log("Predicate: ", predicate.address, vault.vaultName);

      spendingVaults.push({
        id: index,
        name: vault.vaultName,
        limit: Number(vault.spendingLimit),
        weeklyPercentage: 0,
        predicate: predicate,
        predicateAddress: predicate.address.toB256(),
        startTime: vault.startTime,
        endTime: vault.endTime,
        timePeriod: vault.timePeriod,
        daysLeft: Math.floor(
          (vault.endTime - Math.floor(Date.now() / 1000)) / 86400
        ),
      });
    });
    setSpendingVaults(spendingVaults);
  }

  // Function to handle vault creation
  const handleCreateVault = async () => {
    setLoading(true);
    const currentUnixTimestamp = Math.floor(Date.now() / 1000);
    const endTimeUnix: number = vaultForm.timePeriod
      ? Math.floor(new Date(vaultForm.timePeriod).getTime() / 1000)
      : 0;

    const vaultData: SpendingBudgetVaultLocalStorage = {
      vaultName: vaultForm.vaultName,
      spendingLimit: vaultForm.spendingLimit,
      receiver: vaultForm.receiver,
      startTime: currentUnixTimestamp,
      endTime: endTimeUnix,
      timePeriod: endTimeUnix - currentUnixTimestamp,
      createdAt: currentUnixTimestamp,
    };

    // console.log("Vault Data: ", vaultData);
    try {
      if (wallet) {
        const baseAssetId: string = wallet.provider.getBaseAssetId();
        const configurable = {
          RECEIVER: {
            bits: wallet.address.toB256(),
          },
          AMOUNT: Number(vaultForm.spendingLimit) * 10 ** 6,
          START_TIME: currentUnixTimestamp,
          TIME_PERIOD: endTimeUnix - currentUnixTimestamp,
        };

        // send test eth to the predicate
        const predicate = new SpendingBudgetPredicate({
          provider: wallet?.provider as Provider,
          configurableConstants: configurable,
        });
        // console.log("Predicate: ", predicate.address, vaultData.vaultName);

        const tx = await wallet.transfer(
          predicate.address,
          bn.parseUnits("0.0001"),
          baseAssetId,
          {
            gasLimit: 10_000,
          }
        );

        const { isStatusSuccess } = await tx.wait();

        if (!isStatusSuccess) {
          toast.error("Failed to create vault");
        }

        if (isStatusSuccess) {
          toast.success(`${vaultData.vaultName} vault created`);
        }

        // save to localstorage
        const vaults = JSON.parse(
          localStorage.getItem("spending-budget-vaults") || "[]"
        );
        vaults.push(vaultData);
        localStorage.setItem("spending-budget-vaults", JSON.stringify(vaults));
        refreshVaults();
      } else {
        toast.error("Please connect your wallet to create a vault");
      }
    } catch (error) {
      console.error("Error creating vault: ", error);
      toast.error("Error creating vault");
    }

    // Reset form and close dialog
    setVaultForm({
      vaultName: "",
      spendingLimit: "",
      timePeriod: "",
      receiver: wallet ? wallet.address.toB256() : "",
    });
    setLoading(false);

    setIsDialogOpen(false);
  };

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    setVaultForm((prev) => ({
      ...prev,
      receiver: wallet ? wallet.address.toB256() : "",
    }));
  }, [wallet]);

  useEffect(() => {
    // Fetch spending vaults from local storage
    if (wallet) {
      refreshVaults();
    }
  }, [wallet]);

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
                    Set up a new spending budget vault with a spending limit and
                    time period.
                  </DialogDescription>
                </DialogHeader>
                {!loading ? (
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
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />

                        <Input
                          className=" pl-10 block w-full text-muted-foreground"
                          id="timePeriod"
                          type="date" // Change to type="date"
                          value={vaultForm.timePeriod || ""} // Set to empty string if undefined
                          onChange={handleVaultFormChange}
                          min={today}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="receiver">Receiver Address</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input
                          id="receiver"
                          value={getTruncatedAddress(vaultForm.receiver)}
                          onChange={handleVaultFormChange}
                          placeholder="Enter receiver address"
                          className="pl-10"
                          disabled
                          required
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center flex-col text-3xl text-gray-500 p-10 gap-2">
                    <LoaderCircle className="animate-spin h-16 w-16" />
                    <p>Creating Vault...</p>
                  </div>
                )}

                <DialogFooter>
                  <Button
                    onClick={handleCreateVault}
                    type="submit"
                    className="bg-green-500 hover:bg-green-600 text-white w-full"
                    disabled={loading}
                  >
                    {loading ? "Creating..." : "Create Vault"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
            {spendingVaults?.length === 0 && (
              <div className="text-center text-3xl text-gray-500 mt-20">
                No spending vaults created yet.
              </div>
            )}
            {spendingVaults?.map((vault) => (
              <SpendingVaultCard vault={vault} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
