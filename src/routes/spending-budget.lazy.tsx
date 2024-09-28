"use client";

import { createLazyFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { DollarSign, Percent, PiggyBank, TrendingUp, CirclePlusIcon } from 'lucide-react';

export const Route = createLazyFileRoute("/spending-budget")({
  component: Index,
});

// Mock data for existing vaults
const mockSpendingVaults = [
  { id: 1, name: "Monthly Budget", limit: 1000, weeklyPercentage: 25, spent: 750 },
  { id: 2, name: "Groceries", limit: 400, weeklyPercentage: 25, spent: 150 },
  { id: 3, name: "Entertainment", limit: 200, weeklyPercentage: 50, spent: 180 },
];

function Index() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDepositDialogOpen, setIsDepositDialogOpen] = useState(false);
  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [vaultForm, setVaultForm] = useState({
    vaultName: '',
    monthlyLimit: '',
    weeklyPercentage: '',
  });

  // Function to handle vault creation form input change
  const handleVaultFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setVaultForm((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Function to handle vault creation
  const handleCreateVault = () => {
    console.log("Vault Data: ", vaultForm);
    setIsDialogOpen(false);
  };

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
    <>
      <Sidebar />
      <div className="col-start-3 col-end-13 pr-20 pl-96 py-10 flex flex-col gap-4">
        <div className="container mx-auto p-6  min-h-screen">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold ">Spending Budget Vaults</h1>
            {/* Create vault dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-semibold">
                  <CirclePlusIcon className="h-4 w-4" />
                  <span>Create Spending Budget Vault</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create Spending Budget Vault</DialogTitle>
                  <DialogDescription>Set up a new spending budget with monthly limit and weekly percentage.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="vaultName">Vault Name</Label>
                    <Input
                      id="vaultName"
                      value={vaultForm.vaultName}
                      onChange={handleVaultFormChange}
                      placeholder="e.g., Monthly Budget"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="monthlyLimit">Monthly Limit</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        id="monthlyLimit"
                        value={vaultForm.monthlyLimit}
                        onChange={handleVaultFormChange}
                        placeholder="Enter amount"
                        type="number"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weeklyPercentage">Weekly Percentage</Label>
                    <div className="relative">
                      <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        id="weeklyPercentage"
                        value={vaultForm.weeklyPercentage}
                        onChange={handleVaultFormChange}
                        placeholder="25%"
                        type="number"
                        max="100"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={handleCreateVault}
                    type="submit"
                    className="bg-green-500 hover:bg-green-600 text-white w-full"
                  >
                    Create Vault
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
            {mockSpendingVaults.map((vault) => (
              <Card key={vault.id} className="overflow-hidden transition-shadow duration-300 hover:shadow-lg">
                <CardHeader className="bg-gradient-to-r from-yellow-200 to-green-600 text-black">
                  <CardTitle className="flex items-center">
                    <PiggyBank className="mr-2 h-6 w-6" />
                    {vault.name}
                  </CardTitle>
                  <CardDescription className="text-black">Monthly Limit: ${vault.limit}</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-500">Spent</span>
                      <span className="text-lg font-semibold text-gray-700">${vault.spent}</span>
                    </div>
                    <Progress
                      value={(vault.spent / vault.limit) * 100}
                      className="h-2 bg-gray-200"
                    />
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Progress</span>
                      <span className="font-medium text-gray-700">{Math.round((vault.spent / vault.limit) * 100)}%</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <TrendingUp className="mr-2 h-4 w-4 text-blue-500" />
                      <span>Weekly limit: {vault.weeklyPercentage}%</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 border-t flex items-center gap-8">
                  {/* Deposit Button Dialog */}
                  <Dialog open={isDepositDialogOpen} onOpenChange={setIsDepositDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full mt-4">Deposit</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Deposit to Vault</DialogTitle>
                        <DialogDescription>Enter the amount to deposit into the vault.</DialogDescription>
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
                        <Button onClick={handleDeposit} className="bg-green-500 hover:bg-green-600 text-white w-full">Deposit</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  {/* Withdraw Button Dialog */}
                  <Dialog open={isWithdrawDialogOpen} onOpenChange={setIsWithdrawDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full mt-4">Withdraw</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Withdraw from Vault</DialogTitle>
                        <DialogDescription>Enter the amount to withdraw from the vault.</DialogDescription>
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
                        <Button onClick={handleWithdraw} className="bg-green-500 hover:bg-green-600 text-white w-full">Withdraw</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>

  );
}
