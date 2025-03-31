import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/modules/core/components/ui/avatar";
import { Button } from "@/modules/core/components/ui/button";
import { Plus } from "lucide-react";
import { CreditCard } from "./credit-card";

const creditCards = [];

export const RightSidebar = () => {
  return (
    <aside className="lg:flex lg:flex-col lg:w-[355px] lg:h-full border-l border-l-slate-400/30">
      <div className="h-32 bg-[url(/images/gradient-mesh.svg)] bg-cover" />

      <div className="p-5">
        <Avatar className="w-24 h-24 -mt-14 mb-4 border-[10px] border-white shadow-md">
          <AvatarImage src="" width={96} height={96} />
          <AvatarFallback>JC</AvatarFallback>
        </Avatar>

        <div>
          <h1 className="text-3xl font-semibold">Jean Ch</h1>
          <span className="text-slate-700">correo@correo.com</span>
        </div>

        <div className="mt-16">
          <div className="flex justify-between">
            <h2 className="font-semibold text-xl">My Banks</h2>

            <Button variant={"ghost"} className="cursor-pointer text-slate-600">
              <Plus />
              Add Bank
            </Button>
          </div>

          <div className="mt-6 relative h-full">
            <div className="z-20 w-11/12 relative">
              <CreditCard username="Jean Ch" />
            </div>

            <div className="z-10 absolute top-[15%] left-[10%] w-11/12">
              <CreditCard username="Jean Ch 2" />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
