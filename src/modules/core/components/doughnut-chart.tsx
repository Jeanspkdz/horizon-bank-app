"use client";
import * as React from "react";
import { Pie, PieChart } from "recharts";

import { Card, CardContent } from "@/modules/core/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/modules/core/components/ui/chart";
import { AnimatedBalance } from "./animated-balance";

// fill -> indicates what color will be used to paint
// const chartData = [
//   { bank: "bank_1", money: 1250, fill: "var(--color-bank_1)" },
//   { bank: "bank_2", money: 2500, fill: "var(--color-bank_2)" },
//   { bank: "bank_3", money: 3750, fill: "var(--color-bank_3)" },
// ];

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

interface DoughnutChartProps<T extends Record<string, unknown>> {
  data: T[];
  dataKey: {
    [K in keyof T]: T[K] extends number ? K : never
  }[keyof T];
  nameKey: keyof T
}

  export function DoughnutChart<T extends Record<string, unknown>>({
  data,
  dataKey,
  nameKey,
}: DoughnutChartProps<T>) {
  const totalBalance = React.useMemo(() => {
    return data.reduce((acc, curr) => {
      const value = curr[dataKey] as number
      return acc += value
    }, 0);
  }, []);

  return (
    <Card className="">
      <CardContent className="flex flex-col xs:flex-row gap-5 py-0">
        <ChartContainer
          config={chartConfig}
          className="aspect-square min-h-[120px] max-h-[150px]"
        >
          <PieChart margin={{ top: -10, left: -10, right: -10, bottom: -10 }}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              dataKey={dataKey as string}
              nameKey={nameKey as string}
              fill="#2265d8"
              innerRadius="50%"
              strokeWidth={5}
              paddingAngle={2}
            ></Pie>
          </PieChart>
        </ChartContainer>

        <div className="flex flex-col justify-between">
          <h4 className="font-semibold text-lg">
            Bank Accounts: <span>{data.length}</span>
          </h4>

          <div>
            <p className="text-slate-700 text-base mb-1 font-medium">
              Total Current Balance
            </p>

            <div className="font-medium text-2xl md:text-4xl">
              <AnimatedBalance amount={totalBalance} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
