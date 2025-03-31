import Image from "next/image";
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
} from "lucide-react";

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

export const Sidebar = () => {
  return (
    <section>
      <ShadCnSidebar>
        <SidebarHeader className="bg-white p-5">
          <div className="flex flex-row items-center gap-2 cursor-pointer">
            <Image
              src={"/images/logo.svg"}
              width={34}
              height={34}
              alt="Horizon Logo Image"
            />
            <h1 className="text-3xl font-bold text-sky-950 font-ibm-plex-serif">
              Horizon
            </h1>
          </div>
        </SidebarHeader>

        <SidebarContent className="bg-white">
          <SidebarGroup>
            <SidebarMenu>
              {sidebarItems.map(({ icon: Icon, label, route }) => (
                <SidebarMenuItem key={route}>
                  <SidebarMenuButton
                    asChild
                    className="hover:bg-blue-500 hover:text-white active:bg-blue-600 active:text-white h-auto pl-5 py-3 flex items-center group/menu-item"
                  >
                    <Link href={route}>
                      <Icon size={24} className="text-gray-500 group-hover/menu-item:text-white" />
                      <span>{label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarRail/>
      </ShadCnSidebar>
    </section>
  );
};
