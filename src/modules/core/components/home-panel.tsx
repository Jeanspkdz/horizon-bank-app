import { getLoggedInUser } from "@/modules/auth/actions/auth";
import { getBankAccountsByUser } from "@/modules/bankAccounts/actions";
import { DoughnutChart } from "@/modules/core/components/doughnut-chart";
import { Heading } from "@/modules/core/components/heading";
import { RightSidebar } from "@/modules/core/components/right-sidebar";

export const HomePanel = async () => {
   const response = await getLoggedInUser()

  if(!response.success){
      throw response.error
  }
  const user = response.data

  const bankAccounts = await getBankAccountsByUser({
    userId: user.id
  })

    return (
      <div className="flex w-full h-full">
        <div className="flex-1 p-5">
          <div className="mb-8">
            <Heading
              type="greeting"
              title="Welcome"
              subtitle="Access and manage your account and transactions efficiently"
              name={`${user?.firstName} ${user?.lastName}`}
            />
          </div>

          <div>
            <DoughnutChart
              data={bankAccounts}
              dataKey={"balance"}
              nameKey={"name"}
            />
          </div>

        </div>

        <div className="hidden lg:block">
          <RightSidebar 
            bankAccounts={bankAccounts}
            email={user!.email}
            username={`${user?.firstName} ${user?.lastName}`}
          />
        </div>
      </div>
    )
}
