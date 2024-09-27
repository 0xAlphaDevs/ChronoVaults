import { createLazyFileRoute } from "@tanstack/react-router";
import { Button } from "../components/Button";
import { CirclePlusIcon } from "lucide-react";
import { Input } from "../components/Input";
import { Link } from "../components/Link";
import { useActiveWallet } from "../hooks/useActiveWallet";
import { TimeLockPredicate } from "../sway-api/predicates/index";
import { FAUCET_LINK } from "../lib";
import { BN, InputValue, Predicate } from "fuels";
import { bn } from "fuels";
import { useState } from "react";
import toast from "react-hot-toast";
import useAsync from "react-use/lib/useAsync";

export const Route = createLazyFileRoute("/spending-budget")({
  component: Index,
});

function Index() {
  let baseAssetId: string;

  const { wallet, walletBalance, refreshWalletBalance } = useActiveWallet();

  const [predicate, setPredicate] = useState<Predicate<InputValue[]>>();

  const [predicateBalance, setPredicateBalance] = useState<BN>();

  const [pin, setPin] = useState<string>();

  useAsync(async () => {
    if (wallet) {
      baseAssetId = wallet.provider.getBaseAssetId();
      // Initialize a new predicate instance with receiver and deadline
      const configurable = {
        RECEIVER: {
          bits: "0xf1462bc68ea62dd89921498b949ab8bdec694fdd184ba466517b0c2eeb26b1c0",
        },
        DEADLINE: 1727413991,
      };
      // Initialize a new predicate instance
      const predicate = new TimeLockPredicate({
        provider: wallet.provider,
        configurableConstants: configurable,
      });
      setPredicate(predicate);
      setPredicateBalance(await predicate.getBalance());
    }
  }, [wallet]);

  const refreshBalances = async () => {
    await refreshWalletBalance?.();
    setPredicateBalance(await predicate?.getBalance());
  };

  const transferFundsToPredicate = async (amount: BN) => {
    try {
      console.log("Transferring funds to predicate...");
      console.log("Predicate: ", predicate);
      console.log("Predicate address", predicate?.address);
      if (!predicate) {
        return toast.error("Predicate not loaded");
      }

      console.log("Wallet: ", wallet);

      if (!wallet) {
        return toast.error("Wallet not loaded");
      }

      await wallet.transfer(predicate.address, amount, baseAssetId, {
        gasLimit: 10_000,
      });

      await refreshBalances();

      return toast.success("Funds transferred to predicate.");
    } catch (e) {
      console.error(e);
      toast.error(
        <span>
          Failed to transfer funds. Please make sure your wallet has enough
          funds. You can top it up using the{" "}
          <Link href={FAUCET_LINK} target="_blank">
            faucet.
          </Link>
        </span>
      );
    }
  };

  const unlockPredicateAndTransferFundsBack = async (amount: BN) => {
    try {
      if (!wallet) {
        return toast.error("Wallet not loaded");
      }

      // Initialize a new predicate instance with receiver and deadline
      const configurable = {
        RECEIVER: {
          bits: "0xf1462bc68ea62dd89921498b949ab8bdec694fdd184ba466517b0c2eeb26b1c0",
        },
        DEADLINE: 1727413991,
      };
      const reInitializePredicate = new TimeLockPredicate({
        provider: wallet.provider,
        configurableConstants: configurable,
        data: [configurable.RECEIVER, 1727413992],
      });

      if (!reInitializePredicate) {
        return toast.error("Failed to initialize predicate");
      }

      /*
        Try to 'unlock' the predicate and transfer the funds back to the wallet.
        If the pin is correct, this transfer transaction will succeed.
        If the pin is incorrect, this transaction will fail.
       */
      const tx = await reInitializePredicate.transfer(
        wallet.address,
        amount,
        baseAssetId
      );
      const { isStatusSuccess } = await tx.wait();

      if (!isStatusSuccess) {
        toast.error("Failed to unlock predicate");
      }

      if (isStatusSuccess) {
        toast.success("Predicate unlocked");
      }

      await refreshBalances();
    } catch (e) {
      console.error(e);
      toast.error(
        "Failed to unlock predicate. You probably entered the wrong pin, or the predicate does not have enough balance. Try again."
      );
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
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
      </div>

      {/* <Button
        onClick={async () =>
          await transferFundsToPredicate(bn.parseUnits("0.001"))
        }
      >
        Transfer 0.1 ETH to Predicate
      </Button> */}
      <Button
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
      </Button>
    </>
  );
}
