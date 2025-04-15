import { getLoggedInUser } from "@/modules/auth/actions/auth";
import { Navbar } from "@/modules/core/components/navbar";
import { Sidebar } from "@/modules/core/components/sidebar";
import { SidebarProvider } from "@/modules/core/components/ui/sidebar";
import { redirect } from "next/navigation";

const DashboardLayout = async ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {

  const user = await getLoggedInUser()
  if(!user){
    return redirect("/sign-in")
  }

  return (
    <SidebarProvider className="block">
      <Navbar />

      <main className="w-full h-full flex">
        <Sidebar 
          username={user.name}
          email={user.email}
        />

        <div className="flex-1">{children}</div>
      </main>
    </SidebarProvider>
  );
};

export default DashboardLayout;
