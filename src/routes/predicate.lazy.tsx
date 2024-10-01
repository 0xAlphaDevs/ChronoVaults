import { createLazyFileRoute } from "@tanstack/react-router";
import { Button } from "../components/Button";
import { FuelLogo } from "../components/FuelLogo";
import { Input } from "../components/Input";
import { Link } from "../components/Link";
import { useActiveWallet } from "../hooks/useActiveWallet";
import { SpendingBudgetPredicate } from "../sway-api/predicates/index";
import { FAUCET_LINK } from "../lib";
import { BN, InputValue, Predicate } from "fuels";
import { bn } from "fuels";
import { useState } from "react";
import toast from "react-hot-toast";
import useAsync from "react-use/lib/useAsync";

export const Route = createLazyFileRoute("/predicate")({
  component: Index,
});

function Index() {
  let baseAssetId: string;

  const { wallet, walletBalance, refreshWalletBalance } = useActiveWallet();

  const [predicate, setPredicate] = useState<Predicate<InputValue[]>>();

  const [predicateBalance, setPredicateBalance] = useState<BN>();

  const [pin, setPin] = useState<string>();

  const usdtAssetId =
    "0x3f007b72f7bcb9b1e9abe2c76e63790cd574b7c34f1c91d6c2f407a5b55676b9";

  useAsync(async () => {
    if (wallet) {
      baseAssetId = wallet.provider.getBaseAssetId();

      // // Initialize a new Time Lock predicate instance with receiver and deadline
      // const configurable = {
      //   RECEIVER: {
      //     bits: "0xf1462bc68ea62dd89921498b949ab8bdec694fdd184ba466517b0c2eeb26b1c0",
      //   },
      //   DEADLINE: 1727413991, // convert to unix timestamp from selected data
      // };
      // // Initialize a new predicate instance
      // const predicate = new TimeLockPredicate({
      //   provider: wallet.provider,
      //   configurableConstants: configurable,
      // });

      // Initialize a new Spending Budget predicate instance {}
      const configurable = {
        RECEIVER: {
          bits: wallet.address.toB256(),
        },
        AMOUNT: 1 * 10 ** 8,
        START_TIME: 1727456527,
        TIME_PERIOD: 600,
      };
      // Initialize a new predicate instance
      console.log("Initializing Spending Budget Predicate...", configurable);
      const predicate = new SpendingBudgetPredicate({
        provider: wallet.provider,
        configurableConstants: configurable,
      });
      setPredicate(predicate);
      setPredicateBalance(await predicate.getBalance(usdtAssetId));
    }
  }, [wallet]);

  const refreshBalances = async () => {
    await refreshWalletBalance?.();
    setPredicateBalance(await predicate?.getBalance(usdtAssetId));
  };

  const transferFundsToPredicate = async (amount: BN) => {
    try {
      if (!predicate) {
        return toast.error("Predicate not loaded");
      }

      if (!wallet) {
        return toast.error("Wallet not loaded");
      }

      console.log(
        "Transferring funds to predicate...",
        predicate.address,
        amount,
        usdtAssetId
        // baseAssetId
      );

      await wallet.transfer(predicate.address, amount, usdtAssetId, {
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

  const unlockSpendingBudgetPredicateAndTransferFundsBack = async (
    amount: number
  ) => {
    try {
      if (!wallet) {
        return toast.error("Wallet not loaded");
      }

      // Initialize a new predicate instance with receiver and deadline
      const configurable = {
        RECEIVER: {
          bits: wallet.address.toB256(),
        },
        AMOUNT: 1 * 10 ** 8,
        START_TIME: 1727456527,
        TIME_PERIOD: 600,
      };

      console.log(amount);

      const reInitializePredicate = new SpendingBudgetPredicate({
        provider: wallet.provider,
        configurableConstants: configurable,
        data: [
          configurable.RECEIVER,
          amount * 10 ** 8,
          configurable.START_TIME + 700,
        ],
      });

      if (!reInitializePredicate) {
        return toast.error("Failed to initialize predicate");
      }

      console.log(reInitializePredicate.address.toB256());

      /*
        Try to 'unlock' the predicate and transfer the funds back to the wallet.
        If the pin is correct, this transfer transaction will succeed.
        If the pin is incorrect, this transaction will fail.
       */
      const tx = await reInitializePredicate.transfer(
        wallet.address,
        bn.parseUnits("0.001"),
        usdtAssetId
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

  const saveToLocalStorage = () => {
    const data = {
      spendingBudgetVaults: [
        {
          vaultName: "Spending Budget Vault",
          spendingAmount: 1000,
          startTime: 1727456527,
          endTime: 1727456527 + 600,
          predicateAddress:
            "0x3f007b72f7bcb9b1e9abe2c76e63790cd574b7c34f1c91d6c2f407a5b55676b9",
          receiver:
            "0x3f007b72f7bcb9b1e9abe2c76e63790cd574b7c34f1c91d6c2f407a5b55676b9",
          createdAt: Date.now(),
        },
      ],
      timeLockVaults: [],
      conditinalReleaseVaults: [],
    };
    localStorage.setItem("chrono-vaults", JSON.stringify(data));
  };

  const loadFromLocalStorage = () => {
    const data = localStorage.getItem("chrono-vaults");
    console.log(JSON.parse(data as string));
  };

  return (
    <>
      <div className="flex gap-4">
        <FuelLogo />
        <h3 className="text-2xl font-semibold">Predicate</h3>
      </div>

      <div className="mt-12 items-baseline flex gap-2">
        <h5 className="font-semibold text-xl">Wallet Balance:</h5>
        <span className="text-gray-400">
          {walletBalance?.format({
            precision: 3,
          })}{" "}
          ETH
        </span>
      </div>

      <div className="items-baseline flex gap-2">
        <h5 className="font-semibold text-xl">Predicate Balance:</h5>
        <span className="text-gray-400">
          {predicateBalance?.formatUnits(6)} USDT
        </span>
      </div>

      {/* <button onClick={saveToLocalStorage}>Save to localstorage</button>
      <button onClick={loadFromLocalStorage}>Load from localstorage</button> */}

      {/* <Button
        onClick={async () =>
          await transferFundsToPredicate(bn.parseUnits("0.001"))
        }
      >
        Transfer 0.001 ETH to Time Lock Predicate
      </Button> */}

      <Button
        onClick={async () =>
          await transferFundsToPredicate(bn.parseUnits("0.001"))
        }
      >
        Transfer 1 USDT to Spending Budget Predicate
      </Button>

      <Input
        className="w-[300px] mt-8"
        value={pin as string}
        onChange={(e) => setPin(e.target.value)}
        placeholder="Hint - the correct pin is 1337"
      />

      {/* <Button
        onClick={async () =>
          await unlockPredicateAndTransferFundsBack(bn.parseUnits("0.0009"))
        }
      >
        Unlock Predicate and Transfer 0.0009 ETH back to Wallet
      </Button> */}

      <Button
        onClick={async () =>
          await unlockSpendingBudgetPredicateAndTransferFundsBack(0.001)
        }
      >
        Unlock Spending Budget Predicate and Transfer 1 USDT back to Wallet
      </Button>

      <span className="mt-8 w-[400px] text-gray-400">
        Do note that when you 'unlock' a predicate, the predicate also pays for
        the gas of the transaction. <br />
        This is why you will notice that the balance of the predicate gets
        reduced by 0.09 ETH + a nominal gas fee.
      </span>

      <Link
        href="https://docs.fuel.network/docs/fuels-ts/predicates"
        target="_blank"
      >
        Learn more about Predicates
      </Link>

      <Link href="/" className="mt-12">
        Back to Home
      </Link>
    </>
  );
}
