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
import { DollarSign, PiggyBank, TrendingUp } from "lucide-react";
import { SpendingBudgetPredicate } from "@/sway-api";
import { bn, BN } from "fuels";
import toast from "react-hot-toast";
import { useActiveWallet } from "@/hooks/useActiveWallet";

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

const SpendingVaultCard = ({ vault }: { vault: SpendingVault }) => {
  const { wallet } = useActiveWallet();
  const [loading, setLoading] = useState(false);
  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false);
  // const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [predicateBalance, setPredicateBalance] = useState<BN>(
    bn.parseUnits("0")
  );
  const [vaultFunded, setVaultFunded] = useState(false);

  const usdtAssetId =
    "0x3f007b72f7bcb9b1e9abe2c76e63790cd574b7c34f1c91d6c2f407a5b55676b9";

  // Functions to handle deposit and withdraw
  const handleDeposit = () => {
    // Add your deposit logic here
    setLoading(true);
    console.log(
      `Depositing: ${bn.parseUnits((vault.limit / 10 ** 3).toString())}`
    );
    transferFundsToPredicate(bn.parseUnits((vault.limit / 10 ** 3).toString()));
  };

  const handleWithdraw = () => {
    console.log(`Withdrawing: ${withdrawAmount}`);
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
    if (predicateBalance.gt(bn.parseUnits("0"))) {
      // console.log(predicateBalance.formatUnits(6));
      setVaultFunded(true);
      setPredicateBalance(predicateBalance);
    } else {
      setVaultFunded(false);
      setPredicateBalance(predicateBalance);
    }
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
        AMOUNT: Number(vault.limit) * 10 ** 6,
        START_TIME: vault.startTime,
        TIME_PERIOD: vault.timePeriod,
      };

      const reInitializePredicate = new SpendingBudgetPredicate({
        provider: wallet.provider,
        configurableConstants: configurable,
        data: [
          configurable.RECEIVER,
          Number(withdrawAmount) * 10 ** 6,
          new Date().getTime() / 1000, // TO DO: uncomment this line for production
          // new Date().getTime() / 1000 + vault.timePeriod, // only for testing withdrawal before time period
        ],
      });

      if (!reInitializePredicate) {
        return toast.error("Failed to initialize predicate");
      }

      console.log(reInitializePredicate.address.toB256());

      /*
        Try to 'unlock' the predicate and transfer the funds back to the receiver wallet.
       */
      const tx = await reInitializePredicate.transfer(
        wallet.address,
        bn.parseUnits((Number(withdrawAmount) / 10 ** 3).toString()),
        usdtAssetId
      );
      const { isStatusSuccess } = await tx.wait();

      if (!isStatusSuccess) {
        toast.error("Failed to unlock predicate");
      }

      if (isStatusSuccess) {
        toast.success(`$${withdrawAmount} withdrawn from vault.`);
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
            <PiggyBank className="mr-2 h-12 w-12" />
            {vault.name}
          </CardTitle>
          <CardDescription className="text-black text-lg font-semibold text-right">
            Total Spending Limit :{" "}
            <span className="font-bold text-2xl">${vault.limit}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {vaultFunded ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">
                  Limit Utilisation / Deposited Amount
                </span>
                <span className="text-lg font-semibold text-gray-700">
                  ${vault.limit - Number(predicateBalance?.formatUnits(6))} /{" "}
                  <span className="font-bold text-xl">${vault.limit}</span>
                </span>
              </div>
              <Progress
                value={
                  ((vault.limit - Number(predicateBalance?.formatUnits(6))) /
                    vault.limit) *
                  100
                }
                className="h-2 bg-gray-200"
              />
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">
                  Vault maturity in{" "}
                  <span className="text-lg">{vault.daysLeft}</span> days
                </span>
                <span className=" text-gray-700 font-bold ">
                  {Math.round(
                    ((vault.limit - Number(predicateBalance?.formatUnits(6))) /
                      vault.limit) *
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
                    You have used{" "}
                    {((vault.limit - Number(predicateBalance?.formatUnits(6))) /
                      vault.limit) *
                      100}
                    % of your {vault.name} Vault. You can spend upto{" "}
                    {Math.floor(Date.now() / 1000) > vault.endTime
                      ? 100
                      : (
                          (vault.endTime - Math.floor(Date.now() / 1000)) /
                          vault.timePeriod
                        ).toFixed(2)}
                    % of this vault at this time.
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign className="mr-2 h-4 w-4 text-blue-500" />
                  <span>
                    Amount gets linearly unlocked over the time period of the
                    vault. Spend wisely!
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <span className="text-md  text-red-500 font-semibold">
                Vault not funded. Please fund the vault with {vault.limit} USDT
                to start spending.
              </span>
              <Button
                onClick={handleDeposit}
                variant="outline"
                className=" mt-4"
                disabled={loading}
              >
                {loading ? "Funding Vault..." : "Fund Vault"}
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="bg-gray-50 border-t flex items-center gap-8">
          {/* Deposit Button Dialog */}
          {/* <Dialog
            open={isDepositDialogOpen}
            onOpenChange={setIsDepositDialogOpen}
          >
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full mt-4">
                Deposit
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
                >
                  Deposit
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog> */}

          {/* Withdraw Button Dialog */}
          {vaultFunded && (
            <Dialog
              open={isWithdrawDialogOpen}
              onOpenChange={setIsWithdrawDialogOpen}
            >
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full mt-4">
                  Withdraw
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
                    disabled={loading}
                  >
                    {loading ? "Withdrawing..." : "Withdraw"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default SpendingVaultCard;
