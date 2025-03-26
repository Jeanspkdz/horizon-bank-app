import { DoughnutChart } from "@/modules/core/components/doughnut-chart";
import { Heading } from "@/modules/core/components/heading";

const HomePage = () => {
  return (
    <div className="px-4">
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
  );
};

export default HomePage;
