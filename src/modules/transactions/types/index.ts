import {z} from "zod"

const Transaction = z.object({
  amount: z.number(),
  status: z.enum(["pending", "success"]),
  date: z.string(),
  category: z.enum(["food", "transport", "utilities", "entertainment", "other"]),  
})