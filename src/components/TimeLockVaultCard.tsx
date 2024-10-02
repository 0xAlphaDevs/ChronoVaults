import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DollarSign, Timer, TrendingUp } from "lucide-react";
import { bn, BN } from "fuels";
import toast from "react-hot-toast";
import { useActiveWallet } from "@/hooks/useActiveWallet";
import { TimeLockPredicate } from "@/sway-api";

interface TimeLockVault {
  id: number;
  name: string;
  amount: number;
  unlockDate: number;
  predicate: TimeLockPredicate;
  predicateAddress?: string;
}

const TimeLockVaultCard = ({ vault }: { vault: TimeLockVault }) => {
  const { wallet } = useActiveWallet();
  const [loading, setLoading] = useState(false);
  const [isDepositDialogOpen, setIsDepositDialogOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [predicateBalance, setPredicateBalance] = useState<BN>(
    bn.parseUnits("0")
  );

  const usdtAssetId =
    "0x3f007b72f7bcb9b1e9abe2c76e63790cd574b7c34f1c91d6c2f407a5b55676b9";

  // Functions to handle deposit and withdraw
  const handleDeposit = () => {
    // Add your deposit logic here
    setLoading(true);
    console.log(
      `Depositing: ${bn.parseUnits((Number(depositAmount) / 10 ** 3).toString())}`
    );
    transferFundsToPredicate(
      bn.parseUnits((Number(depositAmount) / 10 ** 3).toString())
    );
  };

  const handleWithdraw = () => {
    setLoading(true);
    // Add your withdraw logic here
    unlockPredicateAndWithdrawFunds();
  };

  // Function to get the balance of the predicate contract
  async function getPredicateBalance() {
    // Add your logic to get the balance here
    const predicateBalance = await vault.predicate.getBalance(usdtAssetId);
    console.log(
      `Predicate Balance:  ${vault.predicateAddress} ${predicateBalance}`
    );
    setPredicateBalance(predicateBalance);
  }

  const transferFundsToPredicate = async (amount: BN) => {
    try {
      if (!vault.predicate) {
        return toast.error("Predicate not loaded");
      }

      if (!wallet) {
        return toast.error("Wallet not loaded");
      }

      console.log(
        "Transferring funds to predicate...",
        vault.predicate.address,
        amount,
        usdtAssetId
      );

      const tx = await wallet.transfer(
        vault.predicate.address,
        amount,
        usdtAssetId,
        {
          gasLimit: 10_000,
        }
      );

      const { isStatusSuccess } = await tx.wait();

      if (!isStatusSuccess) {
        toast.error("Failed to fund vault");
      }

      if (isStatusSuccess) {
        toast.success("Funds transferred to vault.");
        await getPredicateBalance();
      }
    } catch (e) {
      console.error(e);
      toast.error("Error transferring funds to vault.");
    }

    setLoading(false);
  };

  const unlockPredicateAndWithdrawFunds = async () => {
    try {
      if (!wallet) {
        return toast.error("Wallet not loaded");
      }

      // Initialize a new predicate instance with receiver and deadline
      const configurable = {
        RECEIVER: {
          bits: wallet.address.toB256(),
        },
        AMOUNT: Number(vault.amount) * 10 ** 6,
        DEADLINE: vault.unlockDate,
      };

      const reInitializePredicate = new TimeLockPredicate({
        provider: wallet.provider,
        configurableConstants: configurable,
        data: [
          configurable.RECEIVER,
          // vault.unlockDate + 1, // only for testing withdrawal before time period
          new Date().getTime() / 1000, // TO DO: uncomment this line for production
        ],
      });

      if (!reInitializePredicate) {
        return toast.error("Failed to initialize predicate");
      }

      // console.log(reInitializePredicate.address.toB256());

      /*
        Try to 'unlock' the predicate and transfer the funds back to the receiver wallet.
       */
      const tx = await reInitializePredicate.transfer(
        wallet.address,
        predicateBalance,
        usdtAssetId
      );
      const { isStatusSuccess } = await tx.wait();

      if (!isStatusSuccess) {
        toast.error("Failed to unlock predicate");
      }

      if (isStatusSuccess) {
        toast.success(
          `$${Math.round(Number(predicateBalance.formatUnits(6)))} withdrawn from vault.`
        );
      }

      await getPredicateBalance();
    } catch (e) {
      console.error(e);
      toast.error("Failed to unlock predicate.");
    }

    setLoading(false);
  };

  useEffect(() => {
    getPredicateBalance();
  }, []);

  return (
    <div>
      <Card
        key={vault.id}
        className="overflow-hidden transition-shadow duration-300 hover:shadow-lg"
      >
        <CardHeader className="bg-gradient-to-r from-yellow-200 to-green-600 text-black">
          <CardTitle className="flex items-center text-4xl font-bold">
            <Timer className="mr-2 h-12 w-12" />
            {vault.name}
          </CardTitle>
          <CardDescription className="text-black text-lg font-semibold text-right">
            Goal : <span className="font-bold text-2xl">${vault.amount}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-500">
                Your Progress
              </span>
              <span className="text-lg font-semibold text-gray-700">
                ${Number(predicateBalance?.formatUnits(6))} /{" "}
                <span className="font-bold text-xl">${vault.amount}</span>
              </span>
            </div>
            <Progress
              value={
                (Number(predicateBalance?.formatUnits(6)) / vault.amount) * 100
              }
              className="h-2 bg-gray-200"
            />
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">
                Unlock Date :{" "}
                <span className="text-lg font-bold text-red-400">
                  {new Date(vault.unlockDate * 1000).toDateString()}
                </span>
              </span>
              <span className=" text-gray-700 font-bold ">
                {Math.round(
                  (Number(predicateBalance?.formatUnits(6)) / vault.amount) *
                    100
                )}
                %
              </span>
            </div>
            {/* Insights of the Vault */}
            <p className="items-center flex">
              {" "}
              <span className="font-semibold text-lg">Vault Insights</span>
            </p>
            <div className="flex flex-col items-left gap-4 text-gray-600">
              <div className="flex items-center text-sm text-gray-600">
                <TrendingUp className="mr-2 h-4 w-4 text-blue-500" />
                <span>
                  You have saved{" "}
                  {Math.round(
                    (Number(predicateBalance?.formatUnits(6)) / vault.amount) *
                      100
                  )}
                  % for your {vault.name} goal.
                </span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <DollarSign className="mr-2 h-4 w-4 text-blue-500" />
                <span>
                  Amount gets unlocked after the unlock date of the vault. Keep
                  saving!
                </span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-gray-50 border-t flex items-center gap-8">
          {/* Deposit Button Dialog */}
          <Dialog
            open={isDepositDialogOpen}
            onOpenChange={setIsDepositDialogOpen}
          >
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full mt-4">
                Add Funds
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Deposit to Vault</DialogTitle>
                <DialogDescription>
                  Enter the amount to deposit into the vault.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <Label htmlFor="depositAmount">Amount</Label>
                <Input
                  id="depositAmount"
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="Enter amount"
                  required
                />
              </div>
              <DialogFooter>
                <Button
                  onClick={handleDeposit}
                  className="bg-green-500 hover:bg-green-600 text-white w-full"
                  disabled={loading}
                >
                  Deposit
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Withdraw Button Dialog */}
          {/* <Dialog
            open={isWithdrawDialogOpen}
            onOpenChange={setIsWithdrawDialogOpen}
          >
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full mt-4">
                Withdraw Funds
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Withdraw from Vault</DialogTitle>
                <DialogDescription>
                  Enter the amount to withdraw from the vault.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <Label htmlFor="withdrawAmount">Amount</Label>
                <Input
                  id="withdrawAmount"
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="Enter amount"
                  required
                />
              </div>
              <DialogFooter>
                <Button
                  onClick={handleWithdraw}
                  className="bg-green-500 hover:bg-green-600 text-white w-full"
                >
                  Withdraw
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog> */}

          <Button
            variant="outline"
            className="w-full mt-4"
            onClick={handleWithdraw}
            disabled={loading || predicateBalance.isZero()}
          >
            Withdraw Funds
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TimeLockVaultCard;
