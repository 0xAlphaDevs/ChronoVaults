import toast from "react-hot-toast";
import { useActiveWallet } from "../hooks/useActiveWallet";

const getTruncatedAddress = (address: string) => {
  return address.slice(0, 6) + "..." + address.slice(-4);
};

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
  toast.success("Address copied to clipboard");
};

export const WalletDisplay = () => {
  const { wallet } = useActiveWallet();

  return (
    wallet && (
      <div className="flex gap-4 justify-center">
        <span className="text-gray-400">
          Wallet : {getTruncatedAddress(wallet.address.toB256() as string)}
        </span>
        <img
          src="/copy.svg"
          alt="copy"
          className="cursor-pointer h-5 hover:opacity-80 active:scale-[90%]"
          onClick={() => copyToClipboard(wallet.address.toB256() as string)}
        />
        {/* <span data-testid="wallet-balance" className="text-gray-400">
          Balance:{" "}
          {walletBalance?.format({
            precision: 3,
          })}{" "}
          ETH
        </span> */}
      </div>
    )
  );
};
