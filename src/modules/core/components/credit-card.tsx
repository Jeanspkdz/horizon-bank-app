import Image from "next/image";

interface CreditCardProps {
  username: string;
}

export const CreditCard = ({ username }: CreditCardProps) => {
  return (
    <article className="flex h-[190px] rounded-xl overflow-hidden border-b border-r border-white">
      <div className="flex-9/12 bg-linear-to-r from-[#0179FE]  to-[#4893FF] flex flex-col justify-between text-white font-semibold p-5">
        <div className="font-bold">
          <span className="block">{username}</span>
          <span className="font-ibm-plex-serif">$123.50</span>
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
