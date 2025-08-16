import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  SelectItemText,
} from "@/modules/core/components/ui/select";
import { formatMoney } from "@/modules/core/lib/format";
import { CreditCard } from "lucide-react";

interface BankCardSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  bankAccounts: {
    accountId: string;
    name: string;
    balance: number 
  }[];
}

export const BankCardSelect = ({bankAccounts, value, onValueChange}: BankCardSelectProps) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="min-w-[190px]">
        <CreditCard className="h-4 w-4 text-blue-500" />
        <SelectValue placeholder="Choose a bank" className="font-bold" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Select a Bank to Display</SelectLabel>
          {bankAccounts.map((bankAccount) => (
            <SelectItem
              value={bankAccount.accountId}
              key={bankAccount.accountId}
              className="px-6"
            >
              <div className="font-semibold">
                <SelectItemText>{bankAccount.name}</SelectItemText>
                <span className="block text-xs text-blue-400">
                  {formatMoney(bankAccount.balance, "USD")}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
