import CountUp from "react-countup";

interface AnimatedBalanceProps {
  amount: number;
}

export const AnimatedBalance = ({ amount }: AnimatedBalanceProps) => {
  return <CountUp start={0} end={amount} decimals={2} prefix="$"  />;
};
