import {z} from "zod"

const BankAccount = z.object({
    id: z.string(),
    accountId: z.string(),
    fundingSourceUrl: z.string(),
    name: z.string(),
    officialName: z.string(),
    type: z.string(),
    subtype: z.string(),
    balance: z.number(),
    bankConnectionId: z.string(),
})
const BankAccountCreateInput = BankAccount.omit({id: true})
const BankAccountUpdateInput = BankAccount.omit({id: true}).partial()

export type BankAccount = z.infer<typeof BankAccount>
export type BankAccountCreateInput = z.infer<typeof BankAccountCreateInput>
export type BankAccountUpdateInput = z.infer<typeof BankAccountUpdateInput>
