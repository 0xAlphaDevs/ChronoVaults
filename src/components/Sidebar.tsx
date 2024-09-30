"use client";

import { FC } from "react";
// import { Link } from "./Link";
import { CURRENT_ENVIRONMENT, NODE_URL, TESTNET_FAUCET_LINK } from "../lib";
import { useConnectUI, useDisconnect } from "@fuels/react";
import { useBrowserWallet } from "../hooks/useBrowserWallet";
import { useActiveWallet } from "../hooks/useActiveWallet";
import { Button } from "./Button";
import { WalletDisplay } from "./WalletDisplay";
import { bn } from "fuels";
import { useFaucet } from "../hooks/useFaucet";
import toast from "react-hot-toast";

export const Sidebar: FC = () => {
  // const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


  const { faucetWallet } = useFaucet();

  const {
    wallet: browserWallet,
    isConnected: isBrowserWalletConnected,
    network: browserWalletNetwork,
  } = useBrowserWallet();

  const { connect } = useConnectUI();
  const { disconnect } = useDisconnect();

  const { wallet, refreshWalletBalance, walletBalance } = useActiveWallet();

  const topUpWallet = async () => {
    if (!wallet) {
      return console.error("Unable to topup wallet because wallet is not set.");
    }

    /**
     * If the current environment is local, transfer 5 ETH to the wallet
     * from the local faucet wallet
     */
    if (CURRENT_ENVIRONMENT === "local") {
      if (!faucetWallet) {
        return toast.error("Faucet wallet not found.");
      }

      const tx = await faucetWallet?.transfer(
        wallet.address,
        bn.parseUnits("5")
      );
      await tx?.waitForResult();

      toast.success("Wallet topped up!");

      return await refreshWalletBalance?.();
    }

    // If the current environment is testnet, open the testnet faucet link in a new tab
    if (CURRENT_ENVIRONMENT === "testnet") {
      return window.open(
        `${TESTNET_FAUCET_LINK}?address=${wallet.address.toAddress()}`,
        "_blank"
      );
    }
  };

  const showTopUpButton = walletBalance?.lt(bn.parseUnits("5"));

  const showAddNetworkButton =
    browserWallet &&
    browserWalletNetwork &&
    browserWalletNetwork?.url !== NODE_URL;

  const tryToAddNetwork = () => {
    return alert(
      `Please add the network ${NODE_URL} to your Fuel wallet, or swtich to it if you have it already, and refresh the page.`
    );
  };

  return (
    <>
      {/* Larger screens */}
      {/* <nav className="hidden md:flex justify-between items-center p-4 bg-black text-white gap-6">
        <Link href="/">Home</Link>

        <Link href="/faucet">Faucet</Link>
        <Link href="/spending-budget">Spending Budget Vaults</Link>
        <Link href="/time-lock">Time Lock Vaults</Link>
        <Link href="/conditional-release">Conditional Release Vaults</Link>

        {isBrowserWalletConnected && (
          <Button onClick={disconnect}>Disconnect Wallet</Button>
        )}
        {!isBrowserWalletConnected && (
          <Button onClick={connect}>Connect Wallet</Button>
        )}

        {showAddNetworkButton && (
          <Button onClick={tryToAddNetwork} className="bg-red-500">
            Wrong Network
          </Button>
        )}

        <div className="ml-auto">
          <WalletDisplay />
        </div>

        {showTopUpButton && (
          <Button onClick={() => topUpWallet()}>Top-up Wallet</Button>
        )}
      </nav> */}

      <div className="grid fixed top-4 left-4 min-h-screen md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <div className="hidden md:block">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
              <a
                href="/"
                className="flex items-center gap-4 font-bold"

              >
                <img
                  src="/logo.png"
                  width={30}
                  height={30}
                  alt="Picture of the author"
                />
                <span className="text-2xl">
                  Chrono Vaults
                </span>
              </a>
            </div>
            <div className="flex-1">
              <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                <a
                  href="/overview"
                  className={`flex items-center gap-3 rounded-lg px-3 text-lg py-2 my-2 transition-all hover:bg-green-500 ${location.pathname === "/conditional-release" ? "bg-green-600" : ""
                    }`}
                >
                  <span>Overview</span>
                </a>
                <a
                  href="/spending-budget"
                  className={`flex items-center gap-3 rounded-lg px-3 text-lg py-2 my-2 transition-all hover:bg-green-500 ${location.pathname === "/spending-budget" ? "bg-green-600" : ""
                    }`}
                >
                  <span>Spending Budget Vaults</span>
                </a>

                <a
                  href="/time-lock"
                  className={`flex items-center gap-3 rounded-lg px-3 text-lg py-2 my-2 transition-all hover:bg-green-500 ${location.pathname === "/time-lock" ? "bg-green-600" : ""
                    }`}
                >
                  <span>Time Lock Vaults</span>
                </a>

                <a
                  href="/conditional-release"
                  className={`flex items-center gap-3 rounded-lg px-3 text-lg py-2 my-2 transition-all hover:bg-green-500 ${location.pathname === "/conditional-release" ? "bg-green-600" : ""
                    }`}
                >
                  <span>Conditional Release Vaults</span>
                </a>


              </nav>


            </div>
            <div className="pb-12 flex flex-col gap-4">

              {showAddNetworkButton && (
                <Button onClick={tryToAddNetwork} className="bg-red-500">
                  Wrong Network
                </Button>
              )}

              <div className="ml-auto">
                <WalletDisplay />
              </div>

              {isBrowserWalletConnected && (
                <Button onClick={disconnect}>Disconnect Wallet</Button>
              )}
              {!isBrowserWalletConnected && (
                <Button onClick={connect}>Connect Wallet</Button>
              )}





              {showTopUpButton && (
                <Button onClick={() => topUpWallet()}>Top-up Wallet</Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile. Should be a hamburger menu */}
      {/* <nav className="flex flex-col md:hidden p-4 bg-black text-white items-center gap-4">
        <img
          src={isMobileMenuOpen ? "/close.svg" : "/hamburger.svg"}
          alt="menu"
          className="w-8 h-8 ml-auto cursor-pointer"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />

        {isMobileMenuOpen && (
          <>
            <Link href="/">Home</Link>

            <Link href="/faucet">Faucet</Link>

            {isBrowserWalletConnected && (
              <Button onClick={disconnect}>Disconnect Wallet</Button>
            )}
            {!isBrowserWalletConnected && (
              <Button onClick={connect}>Connect Wallet</Button>
            )}

            {showAddNetworkButton && (
              <Button onClick={() => toast.success("Adding network")}>
                Add Network
              </Button>
            )}

            <div>
              <WalletDisplay />
            </div>

            {showTopUpButton && (
              <Button onClick={() => topUpWallet()}>Top-up Wallet</Button>
            )}
          </>
        )}
      </nav> */}
    </>
  );
};
