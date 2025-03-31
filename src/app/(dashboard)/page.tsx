import { DoughnutChart } from "@/modules/core/components/doughnut-chart";
import { Heading } from "@/modules/core/components/heading";
import { RightSidebar } from "@/modules/core/components/right-sidebar";
import { SidebarTrigger } from "@/modules/core/components/ui/sidebar";

const HomePage = () => {
  return (
    <div className="flex w-full h-full">
      <div className="p-5 flex-1">
        <div className="mb-8">
          <Heading
            type="greeting"
            title="Welcome"
            subtitle="Access and manage your account and transactions efficiently"
            name="Jean"
          />
        </div>

        <div>
          <DoughnutChart />
        </div>

      </div>

      <div className="hidden lg:block">
        <RightSidebar />
      </div>
    </div>
  );
};

export default HomePage;
