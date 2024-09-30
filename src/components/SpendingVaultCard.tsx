import { useState } from "react";
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

interface SpendingVault {
  id: number;
  name: string;
  limit: number;
  weeklyPercentage: number;
  spent: number;
}

const SpendingVaultCard = ({ vault }: { vault: SpendingVault }) => {
  const [isDepositDialogOpen, setIsDepositDialogOpen] = useState(false);
  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  // Functions to handle deposit and withdraw
  const handleDeposit = () => {
    console.log(`Depositing: ${depositAmount}`);
    // Add your deposit logic here
    setIsDepositDialogOpen(false);
  };

  const handleWithdraw = () => {
    console.log(`Withdrawing: ${withdrawAmount}`);
    // Add your withdraw logic here
    setIsWithdrawDialogOpen(false);
  };
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
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-500">
                Limit Utilisation
              </span>
              <span className="text-lg font-semibold text-gray-700">
                ${vault.spent} /{" "}
                <span className="font-bold text-xl">${vault.limit}</span>
              </span>
            </div>
            <Progress
              value={(vault.spent / vault.limit) * 100}
              className="h-2 bg-gray-200"
            />
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">
                Vault maturity in <span className="text-lg">29</span> days
              </span>
              <span className=" text-gray-700 font-bold ">
                {Math.round((vault.spent / vault.limit) * 100)}%
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
                  You have used {vault.weeklyPercentage}% of your {vault.name}{" "}
                  Vault.
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
        </CardContent>
        <CardFooter className="bg-gray-50 border-t flex items-center gap-8">
          {/* Deposit Button Dialog */}
          <Dialog
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
          </Dialog>

          {/* Withdraw Button Dialog */}
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
                >
                  Withdraw
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SpendingVaultCard;
