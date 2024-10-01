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
  KeyIcon,
  LoaderCircle,
} from "lucide-react";
import ConditionalReleaseVaultCard from "@/components/ConditionalReleaseVaultCard";
import { useActiveWallet } from "../hooks/useActiveWallet";
import toast from "react-hot-toast";
import { Provider, bn } from "fuels";
import { ConditionalReleasePredicate } from "@/sway-api";

export const Route = createLazyFileRoute("/conditional-release")({
  component: Index,
});

interface ConditionalReleaseVault {
  id: number;
  name: string;
  amount: number;
  secret: number;
  predicate: ConditionalReleasePredicate;
  predicateAddress?: string;
}

// type for local storage vault data
interface ConditionalReleaseVaultLocalStorage {
  vaultName: string;
  receiver: string;
  amount: string;
  secret: number;
  createdAt: number;
}

const getTruncatedAddress = (address: string) => {
  return address.slice(0, 6) + "..." + address.slice(-4);
};

function Index() {
  const { wallet } = useActiveWallet();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [conditinalReleaseVaults, setConditionalReleaseVaults] =
    useState<ConditionalReleaseVault[]>();
  const [vaultForm, setVaultForm] = useState({
    vaultName: "",
    amount: "",
    secret: "",
    receiver: "",
  });
  const [loading, setLoading] = useState(false);

  // Function to handle vault form input changes
  const handleVaultFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setVaultForm((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // get spending vaults from local storage and refresh
  function refreshVaults() {
    const vaults = JSON.parse(
      localStorage.getItem("conditional-release-vaults") || "[]"
    );

    console.log("Vaults: ", vaults);
    const conditionVaults: ConditionalReleaseVault[] = [];

    vaults.forEach(
      (vault: ConditionalReleaseVaultLocalStorage, index: number) => {
        // calculate predicate address and get balance
        const configurable = {
          RECEIVER: {
            bits: vault.receiver,
          },
          AMOUNT: Number(vault.amount) * 10 ** 6,
          SECRET: vault.secret,
        };

        // send test eth to the predicate
        const predicate = new ConditionalReleasePredicate({
          provider: wallet?.provider as Provider,
          configurableConstants: configurable,
        });

        console.log("Predicate: ", predicate.address.toB256(), vault.vaultName);
        conditionVaults.push({
          id: index,
          name: vault.vaultName,
          amount: Number(vault.amount),
          secret: vault.secret,
          predicate: predicate,
          predicateAddress: predicate.address.toB256(),
        });
      }
    );
    setConditionalReleaseVaults(conditionVaults);
  }

  const handleCreateVault = async () => {
    setLoading(true);
    const unixTimestamp = Math.floor(Date.now() / 1000); // Get current Unix timestamp

    const vaultData: ConditionalReleaseVaultLocalStorage = {
      vaultName: vaultForm.vaultName,
      receiver: vaultForm.receiver,
      amount: vaultForm.amount,
      secret: Number(vaultForm.secret),
      createdAt: unixTimestamp,
    };

    console.log("Vault Data:", vaultData); // Log the vault data
    try {
      if (wallet) {
        const baseAssetId: string = wallet.provider.getBaseAssetId();
        const configurable = {
          RECEIVER: {
            bits: wallet.address.toB256(),
          },
          AMOUNT: Number(vaultForm.amount) * 10 ** 6,
          SECRET: Number(vaultForm.secret),
        };

        // send test eth to the predicate
        const predicate = new ConditionalReleasePredicate({
          provider: wallet?.provider as Provider,
          configurableConstants: configurable,
        });

        console.log(
          "Predicate: ",
          predicate.address.toB256(),
          vaultData.vaultName
        );

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
          localStorage.getItem("conditional-release-vaults") || "[]"
        );
        vaults.push(vaultData);
        localStorage.setItem(
          "conditional-release-vaults",
          JSON.stringify(vaults)
        );
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
      secret: "",
      amount: "",
      receiver: wallet ? wallet.address.toB256() : "",
    });

    setLoading(false);
    // Close the dialog
    setIsDialogOpen(false);
  };

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
            <h1 className="text-4xl font-bold ">Conditional Release Vaults</h1>
            {/* Create vault dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-semibold">
                  <CirclePlusIcon className="h-4 w-4" />
                  <span>Create Conditinal Release Vault</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create Conditional Release Vault</DialogTitle>
                  <DialogDescription>
                    Set up a new conditional release vault with secret.
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
                        placeholder="e.g. Emergency Fund"
                        required
                      />
                    </div>
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
                    <div className="space-y-2">
                      <Label htmlFor="secret">Secret</Label>
                      <div className="relative">
                        <KeyIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input
                          id="secret"
                          value={vaultForm.secret}
                          onChange={handleVaultFormChange}
                          placeholder="******"
                          type="number"
                          max="100"
                          className="pl-10"
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
                    {loading ? "Creating Vault..." : "Create Vault"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
            {conditinalReleaseVaults?.length === 0 && (
              <div className="text-center text-3xl text-gray-500 mt-20">
                No conditional release vaults created yet.
              </div>
            )}
            {conditinalReleaseVaults?.map((vault) => (
              <ConditionalReleaseVaultCard vault={vault} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
