import { createLazyFileRoute } from "@tanstack/react-router";
// import { TestContract } from "../sway-api";
// import contractIds from "../sway-api/contract-ids.json";
// import { bn } from "fuels";
// import { useState } from "react";
// import { Link } from "../components/Link";
import { Button } from "../components/Button";
import { Card, CardDescription, CardHeader } from "../components/ui/card";
// import toast from "react-hot-toast";
// import { useActiveWallet } from "../hooks/useActiveWallet";
// import useAsync from "react-use/lib/useAsync";
// import {
//   CURRENT_ENVIRONMENT,
//   DOCS_URL,
//   Environments,
//   FAUCET_LINK,
//   TESTNET_CONTRACT_ID,
// } from "../lib";

import { useConnectUI } from "@fuels/react";
import { useBrowserWallet } from "../hooks/useBrowserWallet";
import { Sidebar } from "@/components/Sidebar";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

// const contractId =
//   CURRENT_ENVIRONMENT === Environments.LOCAL
//     ? contractIds.testContract
//     : TESTNET_CONTRACT_ID; // Testnet Contract ID

function Index() {
  // const { wallet, walletBalance, refreshWalletBalance } = useActiveWallet();
  // const [contract, setContract] = useState<TestContract>();
  // const [counter, setCounter] = useState<number>();

  const { isConnected: isBrowserWalletConnected } = useBrowserWallet();
  const { connect } = useConnectUI();
  // const { disconnect } = useDisconnect();

  /**
   * useAsync is a wrapper around useEffect that allows us to run asynchronous code
   * See: https://github.com/streamich/react-use/blob/master/docs/useAsync.md
   */
  // useAsync(async () => {
  //   if (wallet) {
  //     // Create a new instance of the contract
  //     const testContract = new TestContract(contractId, wallet);
  //     setContract(testContract);

  //     // Read the current value of the counter
  //     const { value } = await testContract.functions.get_count().get();
  //     setCounter(value.toNumber());
  //   }
  // }, [wallet]);

  // const onIncrementPressed = async () => {
  //   if (!contract) {
  //     return toast.error("Contract not loaded");
  //   }

  //   if (walletBalance?.eq(0)) {
  //     return toast.error(
  //       <span>
  //         Your wallet does not have enough funds. Please top it up using the{" "}
  //         <Link href={FAUCET_LINK} target="_blank">
  //           faucet.
  //         </Link>
  //       </span>,
  //     );
  //   }

  //   // Call the increment_counter function on the contract
  //   const { waitForResult } = await contract.functions
  //     .increment_counter(bn(1))
  //     .call();

  //   // Wait for the transaction to be mined, and then read the value returned
  //   const { value } = await waitForResult();

  //   setCounter(value.toNumber());

  //   await refreshWalletBalance?.();
  // };

  return (
    <>
      {!isBrowserWalletConnected ? (
        <div className="flex flex-col gap-4 items-center mt-24">
          <img src="/logo.png" alt="fuel" className="w-20 h-20" />
          <h1 className="text-3xl font-semibold">Welcome to Chrono Vaults</h1>
          <span className="text-gray-400 font-semibold">
            Chrono Vaults is a financial management and asset transfer system
            using predicates on Fuel.
          </span>

          <Button onClick={connect} className="font-bold text-xl mt-4">
            Connect Wallet
          </Button>
          <div className="grid grid-cols-3 gap-8 px-20 mt-20">
            <Card className="shadow-sm border-none h-full w-full rounded-lg bg-green-300 bg-opacity-15 border cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-110">
              <CardHeader>
                <CardDescription className="text-center pt-1 text-lg text-white">
                  This is a feature description of Chrono Vaults
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="shadow-sm border-none h-full w-full rounded-lg bg-green-300 bg-opacity-15 border cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-110">
              <CardHeader>
                <CardDescription className="text-center pt-1 text-lg text-white">
                  This is a feature description of Chrono Vaults
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="shadow-sm border-none h-full w-full rounded-lg bg-green-300 bg-opacity-15 border cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-110">
              <CardHeader>
                <CardDescription className="text-center pt-1 text-lg text-white">
                  This is a feature description of Chrono Vaults
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
          <div className="fixed mx-[39%] bottom-4">
            <div className="flex justify-center items-center">
              <p className="text-muted-foreground">
                &copy;{" "}
                <a href="https://www.alphadevs.dev/" target="_blank">
                  Team AlphaDevs
                </a>{" "}
                | All rights reserved
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
          <Sidebar />
          <div className="flex flex-col gap-4 items-center mt-60 pl-40">
            <h2 className="text-5xl font-semibold">This is Chrono Vaults</h2>
            <p className="text-3xl">
              Manage your onchain assets using predicates on Fuel.
            </p>
            <p className="text-lg">
              Select your desired vault from the left panel.
            </p>
          </div>
        </>
      )}

      {/*
      <>
        <h3 className="text-xl font-semibold">Counter</h3>

        <span data-testid="counter" className="text-gray-400 text-6xl">
          {counter}
        </span>

        <Button onClick={onIncrementPressed} className="mt-6">
          Increment Counter
        </Button>
      </>

      <Link href="/predicate" className="mt-4">
        Predicate Example
      </Link>

      <Link href="/script" className="mt-4">
        Script Example
      </Link>
      <Link href={DOCS_URL} target="_blank" className="mt-12">
        Fuel Docs
      </Link> */}
    </>
  );
}
