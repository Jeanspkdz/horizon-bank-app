import Image from "next/image";
import { cn } from "../lib/utils";
import { formatMoney } from "../lib/format";

interface CreditCardProps {
  username: string;
  balance: number | string;
  name: string;
  currency: string;
  className?: string;
}

export const CreditCard = ({
  username,
  balance,
  name,
  currency,
  className,
}: CreditCardProps) => {
  return (
    <article
      className={cn(
        "flex aspect-[32/19] min-h-[190px] max-w-[280px] md:max-w-[320px] lg:max-w-[360px] rounded-xl overflow-hidden border-b border-r border-white relative z-[5]",
        className
      )}
    >
      <div className="flex-9/12 bg-linear-to-r from-[#0179FE]  to-[#4893FF] flex flex-col justify-between text-white font-semibold p-5">
        <div className="font-bold">
          <span className="block">{name}</span>
          <span className="font-ibm-plex-serif">
            {typeof balance == "number" ? `${formatMoney(balance, currency)}` : balance}
          </span>
        </div>

        <div>
          <div className="flex justify-between">
            <span>{username}</span>
            <span>●●/●●</span>
          </div>
          <p>
            ●●●● ●●●● ●●●● <span className="tracking-widest">1234</span>
          </p>
        </div>
      </div>

      <div className="relative flex-3/12 flex flex-col justify-between bg-linear-to-r from-[#0179FE] to-[#4893FF] p-5">
        <Image
          src="/images/Paypass.svg"
          width={20}
          height={24}
          alt="pay"
          className="self-end"
        />
        <Image
          src="/images/mastercard.svg"
          width={45}
          height={32}
          alt="mastercard"
        />

        <Image
          src={"/images/Lines.svg"}
          width={316}
          height={190}
          alt="lines"
          className="absolute inset-0 h-full object-cover object-right"
        />
      </div>
    </article>
  );
};
