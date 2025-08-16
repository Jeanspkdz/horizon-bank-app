"use client"
import { BankAccount } from "@/modules/bankAccounts/types"
import { use } from "react"
import { BankCardSelect } from "./bank-card-select"

interface AsyncBankCardSelectProps {
  bankAccontsPromise: Promise<BankAccount[]>
  value: string,
  onValueChange: () => void
}

export const AsyncBankCardSelect = ({bankAccontsPromise, value, onValueChange}: AsyncBankCardSelectProps) => {
  const bankAccounts = use(bankAccontsPromise)

  return (
    <BankCardSelect
        bankAccounts={bankAccounts}
        value={value}
        onValueChange={onValueChange}
    />
  )
}
