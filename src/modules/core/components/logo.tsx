import Image from "next/image";
import React from "react";
import { cn } from "../lib/utils";

interface LogoProps{
  className?: string
}

export const Logo = ({className}: LogoProps) => {
  return (
    <div className={cn("flex flex-row items-center gap-0.5 cursor-pointer" , className)}>
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
  );
};
