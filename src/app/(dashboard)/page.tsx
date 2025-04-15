import { getLoggedInUser } from "@/modules/auth/actions/auth";
import { DoughnutChart } from "@/modules/core/components/doughnut-chart";
import { Heading } from "@/modules/core/components/heading";
import { RightSidebar } from "@/modules/core/components/right-sidebar";

const HomePage = async () => {
  const user = await getLoggedInUser()
  console.log(user);
  

  return (
    <div className="flex w-full h-full">
      <div className="p-5 flex-1">
        <div className="mb-8">
          <Heading
            type="greeting"
            title="Welcome"
            subtitle="Access and manage your account and transactions efficiently"
            name={user!.name}
          />
        </div>

        <div>
          <DoughnutChart />
        </div>

      </div>

      <div className="hidden lg:block">
        <RightSidebar 
          email={user!.email}
          username={user!.name}
        />
      </div>
    </div>
  );
};

export default HomePage;
