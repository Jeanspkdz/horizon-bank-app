import { Sidebar } from "@/modules/core/components/sidebar";

const DashboardLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <main>
      <Sidebar/>
      {children}
    </main>
  );
};

export default DashboardLayout;
