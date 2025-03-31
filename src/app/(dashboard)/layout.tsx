import { Navbar } from "@/modules/core/components/navbar";
import { Sidebar } from "@/modules/core/components/sidebar";
import { SidebarProvider } from "@/modules/core/components/ui/sidebar";

const DashboardLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <SidebarProvider className="block">
      <Navbar />

      <main className="w-full h-full flex">
        <Sidebar />

        <div className="flex-1">{children}</div>
      </main>
    </SidebarProvider>
  );
};

export default DashboardLayout;
