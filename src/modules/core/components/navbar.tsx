"use client";

import Image from "next/image";
import { useSidebar } from "./ui/sidebar";
import { Menu } from "lucide-react";

export const Navbar = () => {
  const { toggleSidebar, ...props } = useSidebar();

  return (
    <header className="block md:hidden bg-white z-10 sticky self-start top-0 left-0 w-full py-4 px-5 shadow-md">
      <nav className="flex justify-between items-center">
        <Image
          src={"/images/logo.svg"}
          alt="Horizon Logo"
          width={30}
          height={30}
        />

        <button onClick={() => toggleSidebar()} className="cursor-pointer">
          <Menu />
        </button>
      </nav>
    </header>
  );
};
