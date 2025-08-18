import { getLoggedInUser } from "@/modules/auth/actions/auth";
import { syncUserBankData } from "@/modules/core/actions";
import { Navbar } from "@/modules/core/components/navbar";
import { Sidebar } from "@/modules/core/components/sidebar";
import { SidebarProvider } from "@/modules/core/components/ui/sidebar";
import { redirect } from "next/navigation";

const DashboardLayout = async ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {

  const response = await getLoggedInUser()
  
  if(!response.success){
    return redirect("/sign-in")
  }
  
  const user = response.data
  console.log("NANI??");
  
  syncUserBankData(user.id)

  return (
    <SidebarProvider className="block">
      <Navbar />

      <main className="w-full min-h-svh flex">
        <Sidebar 
          username={`${user.firstName} ${user.lastName}`}
          email={user.email}
        />

        <section className="flex-1 bg-[#FCFCFD]">{children}</section>
      </main>
    </SidebarProvider>
  );
};

export default DashboardLayout;
