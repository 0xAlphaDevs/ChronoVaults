import { createLazyFileRoute } from "@tanstack/react-router";
// import { TestContract } from "../sway-api";
// import contractIds from "../sway-api/contract-ids.json";
// import { bn } from "fuels";
// import { useState } from "react";
// import { Link } from "../components/Link";
import { Button } from "../components/Button";
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
        <div className="flex flex-col gap-4 items-center mt-20">
          <img src="/logo.png" alt="fuel" className="w-20 h-20" />
          <h1 className="text-3xl font-semibold">Welcome to Chrono Vaults</h1>
          <span className="text-gray-400 font-semibold">
            Chrono Vaults is a financial management and asset transfer system using predicates on Fuel.
          </span>

          <Button onClick={connect} className="font-bold text-xl mt-4">Connect Wallet</Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4 items-center">
          <h2 className="text-2xl font-semibold">Now you can create three different kind of vaults</h2>
          {/* <Button onClick={disconnect}>Disconnect Wallet</Button> */}
        </div>
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
