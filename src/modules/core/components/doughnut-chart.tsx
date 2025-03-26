"use client";
import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/modules/core/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/modules/core/components/ui/chart";
import { AnimatedBalance } from "./animated-balance";

// fill -> indicates what color will be used to paint
const chartData = [
  { bank: "bank_1", money: 1250, fill: "var(--color-bank_1)" },
  { bank: "bank_2", money: 2500, fill: "var(--color-bank_2)" },
  { bank: "bank_3", money: 3750, fill: "var(--color-bank_3)" },
];

/* 
it creates CSS variables with chartConfig's object keys (e.g --color-safari)
and the value asigned is the color's value in chartConfig object
*/
const chartConfig = {
  bank_1: {
    label: "Bank 1",
    color: "#0747b6", // Css Variable ( --color-{key} : {color-value} )
  },
  bank_2: {
    label: "Bank 2",
    color: "#2265d8",
  },
  bank_3: {
    label: "Bank 3",
    color: "#2f91fa",
  },
} satisfies ChartConfig;

export function DoughnutChart() {
  const totalBalance = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.money, 0);
  }, []);
  return (
    <Card className="">
      <CardContent className="flex flex-col xs:flex-row gap-2">
        <ChartContainer
          config={chartConfig}
          className="min-h-[120px] h-[120px] aspect-square"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="money"
              nameKey="bank"
              innerRadius={25}
              strokeWidth={5}
              className=""
            ></Pie>
          </PieChart>
        </ChartContainer>

        <div className="flex flex-col justify-between">
          <h4 className="font-semibold">
            Bank Accounts : <span>1</span>
          </h4>

          <div>
            <p className="text-slate-700 text-xs mb-1">Total Current Balance</p>

            <div className="font-bold text-xl">
              <AnimatedBalance
                amount={totalBalance}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
