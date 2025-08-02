import { getLoggedInUser} from "@/modules/auth/actions/auth";
import { DoughnutChart } from "@/modules/core/components/doughnut-chart";
import { Heading } from "@/modules/core/components/heading";
import { RightSidebar } from "@/modules/core/components/right-sidebar";
 
const HomePage = async () => {
  const response = await getLoggedInUser()

  if(!response.success){
      throw response.error
  }

  const user = response.data

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
          <DoughnutChart />
        </div>

      </div>

      <div className="hidden lg:block">
        <RightSidebar 
          email={user!.email}
          username={`${user?.firstName} ${user?.lastName}`}
        />
      </div>
    </div>
  );
};

export default HomePage;
