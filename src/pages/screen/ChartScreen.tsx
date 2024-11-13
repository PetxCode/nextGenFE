"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { FC } from "react";

const chartConfig = {
  stage1: {
    label: "score",
    color: "hsl(var(--chart-1))",
  },
  stage2: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
  stage3: {
    label: "stage3",
    color: "#172554",
  },
  stage4: {
    label: "stage4",
    color: "purple",
  },
} satisfies ChartConfig;

export const MyChart: FC<any> = ({
  data,
  title,
  stage,
  stage2,
  stage3,
  stage4,
}) => {
  const readData = data?.map((el: any) => {
    return {
      score1: el[`${stage}`],
      score2: el[`${stage2}`],
      score3: el[`${stage3}`],
      score4: el[`${stage4}`],
      name: el?.firstName,
    };
  });

  return (
    <div className="w-full">
      <Card className="w-full ">
        <CardHeader>
          <CardTitle>{title} </CardTitle>
          <CardDescription>Result Chart</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={readData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="name"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                //   tickFormatter={(value) => value.slice(0, 3)}
              />
              <YAxis
                dataKey="score1"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                //   tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" />}
              />
              {/* <Legend /> */}
              <Bar dataKey="score1" fill="var(--color-stage1)" radius={4} />
              {stage2 && (
                <Bar dataKey="score2" fill="var(--color-stage2)" radius={4} />
              )}
              {stage3 && (
                <Bar dataKey="score3" fill="var(--color-stage3)" radius={4} />
              )}
              {stage4 && (
                <Bar dataKey="score4" fill="var(--color-stage4)" radius={4} />
              )}
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            This chart is showing Performance of Participants
            <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            This is the Geneeral outcome of students for far for {title}.
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
