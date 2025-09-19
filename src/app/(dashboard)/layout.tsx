import { getLoggedInUser } from "@/modules/auth/actions/auth";
import { Navbar } from "@/modules/core/components/navbar";
import { Sidebar } from "@/modules/core/components/sidebar";
import { SidebarProvider } from "@/modules/core/components/ui/sidebar";
import { UserUpdateManager } from "@/modules/core/components/user-update-manager";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Toaster } from "sonner";

const DashboardLayout = async ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const response = await getLoggedInUser();

  if (!response.success) {
    return redirect("/sign-in");
  }

  const user = response.data;

  return (
    <SidebarProvider className="block">
      <Navbar />

      <main className="max-w-dvw min-h-svh flex">
        <Sidebar
          username={`${user.firstName} ${user.lastName}`}
          email={user.email}
        />
        <section className=" bg-[#FCFCFD]  max-w-full flex-1">{children}</section>
      </main>

      <Toaster richColors/>
      <Suspense fallback={null}>
        <UserUpdateManager />
      </Suspense>
    </SidebarProvider>
  );
};

export default DashboardLayout;
