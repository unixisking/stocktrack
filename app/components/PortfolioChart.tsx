'use client'

import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  LineChart,
  Line,
} from 'recharts'

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { useCallback } from 'react'

export const description = 'A stacked area chart'

const chartData = [
  { month: 'January', position: 186, sp: 80 },
  { month: 'February', position: 305, sp: 200 },
  { month: 'March', position: 237, sp: 120 },
  { month: 'April', position: 73, sp: 190 },
  { month: 'May', position: 209, sp: 130 },
  { month: 'June', position: 214, sp: 140 },
]

const chartConfig = {
  position: {
    label: 'position',
    color: 'hsl(var(--chart-1))',
  },
  sp: {
    label: 'sp',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig

interface PortfolioChartProps {
  variant: 'performance' | 'value'
}

export default function PortfolioChart({ variant }: PortfolioChartProps) {
  const chart = useCallback(() => {
    switch (variant) {
      case 'performance':
        return (
          <>
            <Area
              dataKey="position"
              type="natural"
              fill="var(--color-position)"
              fillOpacity={0.4}
              stroke="var(--color-position)"
              stackId="a"
            />
            <Area
              dataKey="sp"
              type="natural"
              fill="var(--color-sp)"
              fillOpacity={0.4}
              stroke="var(--color-sp)"
              stackId="a"
            />
          </>
        )

      case 'value':
        return (
          <>
            <Line
              dataKey="position"
              type="monotone"
              stroke="var(--color-position)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="sp"
              type="monotone"
              stroke="var(--color-sp)"
              strokeWidth={2}
              dot={false}
            />
          </>
        )
      default:
        return null
    }
  }, [variant])
  return (
    <ChartContainer config={chartConfig}>
      {variant === 'performance' ? (
        <AreaChart
          accessibilityLayer
          data={chartData}
          margin={{
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dot" />}
          />

          {chart()}
        </AreaChart>
      ) : (
        <LineChart
          accessibilityLayer
          data={chartData}
          margin={{
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dot" />}
          />
          {chart()}
        </LineChart>
      )}
    </ChartContainer>
  )
}
