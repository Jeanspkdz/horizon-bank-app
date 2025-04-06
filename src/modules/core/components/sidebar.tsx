"use client";

import {
  Sidebar as ShadCnSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "./ui/sidebar";
import Link from "next/link";

import {
  House,
  CircleDollarSign,
  ScrollText,
  CreditCard,
  Handshake,
  LogOut,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { Logo } from "./logo";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { getUserInitials } from "@/modules/auth/lib/util";
import { Button } from "./ui/button";
import { signOut } from "@/modules/auth/actions";

const sidebarItems = [
  {
    icon: House,
    route: "/",
    label: "Home",
  },
  {
    icon: CircleDollarSign,
    route: "/my-banks",
    label: "My Banks",
  },
  {
    icon: ScrollText,
    route: "/transaction-history",
    label: "Transaction History",
  },
  {
    icon: Handshake,
    route: "/payment-transfer",
    label: "Transfer Funds",
  },
  {
    icon: CreditCard,
    route: "/connect-bank",
    label: "Connect Bank",
  },
];

interface SidebarProps {
  username: string;
  email: string;
}

export const Sidebar = ({ username, email }: SidebarProps) => {
  const pathname = usePathname();
  const isActive = (route: string) => pathname == route;

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <section>
      <ShadCnSidebar>
        <SidebarHeader className="bg-white p-5">
          <Logo />
        </SidebarHeader>

        <SidebarContent className="bg-white">
          <SidebarGroup>
            <SidebarMenu>
              {sidebarItems.map(({ icon: Icon, label, route }) => (
                <SidebarMenuItem key={route}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(route)}
                    className="h-auto pl-5 py-3 flex items-center"
                  >
                    <Link
                      href={route}
                      className="hover:bg-blue-500! hover:text-white! active:bg-blue-600! active:text-white! group/menu-button data-[active=true]:bg-blue-600! data-[active=true]:text-white! transition-colors "
                    >
                      <Icon
                        size={24}
                        className="text-gray-500 group-hover/menu-button:text-white group-data-[active=true]/menu-button:text-white transition-colors"
                      />
                      <span className="font-semibold">{label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="bg-white">
          <div className="p-3 flex items-center justify-between">
            <Avatar className="w-10 h-10">
              <AvatarFallback>{getUserInitials(username)}</AvatarFallback>
              <AvatarImage />
            </Avatar>

            <div className="flex flex-col gap-y-0.5">
              <span className="font-semibold text-slate-700">{username}</span>
              <span className="text-sm text-slate-600">{email}</span>
            </div>

            <Button
              variant={"ghost"}
              className="cursor-pointer"
              onClick={handleSignOut}
            >
              <LogOut />
            </Button>
          </div>
        </SidebarFooter>

        <SidebarRail />
      </ShadCnSidebar>
    </section>
  );
};
