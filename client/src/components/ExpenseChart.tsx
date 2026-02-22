"use client"

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, Rectangle, XAxis } from "recharts"
import { Wallet, Landmark } from "lucide-react";

const chartConfig = {
  totalExpense: {
    label: "Total Expense",
    color: "#2563eb",
    icon: Landmark,
  }
} satisfies ChartConfig

type ChartElement = {
  [key: string]: string | number
}

export function ExpenseChart({ chartData }: { chartData: ChartElement[] }) {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey={Object.keys(chartData[0])[0]}
          tickLine={true}
          tickMargin={10}
          axisLine={true}
          tickFormatter={(value) => value.slice(0, 10)}
        />
        <ChartTooltip contentStyle={{
    backgroundColor: "#2563eb",
    borderColor: "#1e40af",
    color: "gray",
  }}content={<ChartTooltipContent hideLabel indicator='dashed' />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey={Object.keys(chartData[0])[1]} fill="var(--color-totalExpense)" radius={3}></Bar>
      </BarChart>
    </ChartContainer>
  )
}
