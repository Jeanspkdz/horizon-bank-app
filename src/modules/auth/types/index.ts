import {z} from "zod"

const User = z.object({
  id: z.string(),        
  firstName: z.string(),            
  lastName: z.string(),
  email: z.string(),
  address: z.string(),
  city: z.string(),
  dateOfBirth: z.string(),       
  postalCode: z.string(),
  ssn: z.string(),
  state: z.string(),
  dwollaCustomerUrl: z.string(),
  accountId: z.string(), //References Appwrite Auth's user.$id
});
const UserCreateInput = User.partial({id: true}) 


export type User = z.infer<typeof User>
export type UserCreateInput =  z.infer<typeof UserCreateInput>
