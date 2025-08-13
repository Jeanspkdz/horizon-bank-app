import {z} from "zod"

const Transaction = z.object({
  id: z.string(),
  amount: z.number(),
  status: z.string(),
  category: z.string(),
  merchantLogoUrl: z.string(),
  datetime: z.string().datetime(),
  externalTransactionId: z.string(),
  bankAccountId: z.string()
})
const TransactionCreateInput = Transaction.omit({id: true})
const TransactionUpdateInput = Transaction.omit({id: true}).partial()


export type Transaction = z.infer<typeof Transaction>
export type TransactionCreateInput = z.infer<typeof TransactionCreateInput>
export type TransactionUpdateInput = z.infer<typeof TransactionUpdateInput>
export type TransactionId = Transaction["id"]