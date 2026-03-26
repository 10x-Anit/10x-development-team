# Charts & Data Visualization — Definitive Guide

Recharts is the primary charting library for 10x projects. It is what shadcn/ui's
chart components are built on. Use Recharts for all standard dashboard charts.
Use Plotly only for advanced scientific, 3D, or geo-map visualizations.

All chart colors MUST come from CSS variable design tokens — never hardcode hex values.

---

## 1. Installation

### Recharts (primary)

```bash
npm install recharts
```

### shadcn Chart Component (wraps Recharts with design system)

```bash
npx shadcn@latest add chart
```

This installs:
- `src/components/ui/chart.tsx` — ChartContainer, ChartTooltip, ChartLegend
- Recharts as a dependency (if not already installed)

### Plotly (advanced — only when needed)

```bash
npm install react-plotly.js plotly.js
```

---

## 2. Chart Color Tokens

Define chart colors in `globals.css` alongside your existing design tokens.
shadcn uses `chart-1` through `chart-5` by convention.

```css
:root {
  --chart-1: 222 47% 51%;   /* Primary blue */
  --chart-2: 160 60% 45%;   /* Teal/green */
  --chart-3: 30 80% 55%;    /* Orange */
  --chart-4: 280 65% 60%;   /* Purple */
  --chart-5: 340 75% 55%;   /* Pink/rose */
}

.dark {
  --chart-1: 217 91% 60%;
  --chart-2: 160 70% 50%;
  --chart-3: 30 85% 60%;
  --chart-4: 280 70% 65%;
  --chart-5: 340 80% 60%;
}
```

### Accessing chart colors in components

```tsx
// In Tailwind classes
<div className="bg-[hsl(var(--chart-1))]" />

// In Recharts (inline style — Recharts requires string color values)
const CHART_COLORS = {
  primary: "hsl(var(--chart-1))",
  secondary: "hsl(var(--chart-2))",
  tertiary: "hsl(var(--chart-3))",
  quaternary: "hsl(var(--chart-4))",
  quinary: "hsl(var(--chart-5))",
} as const
```

---

## 3. shadcn Chart Components (Recommended Approach)

The shadcn chart component provides a consistent wrapper around Recharts
that integrates with your design system automatically.

### ChartConfig

Define a config object that maps data keys to labels and colors:

```tsx
import { type ChartConfig } from "@/components/ui/chart"

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
  expenses: {
    label: "Expenses",
    color: "hsl(var(--chart-2))",
  },
  profit: {
    label: "Profit",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig
```

### ChartContainer

Wraps your Recharts chart with responsive sizing and CSS variable injection:

```tsx
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis } from "recharts"

const data = [
  { month: "Jan", revenue: 4200, expenses: 2800 },
  { month: "Feb", revenue: 5100, expenses: 3200 },
  { month: "Mar", revenue: 4800, expenses: 2900 },
  { month: "Apr", revenue: 6200, expenses: 3500 },
  { month: "May", revenue: 5800, expenses: 3100 },
  { month: "Jun", revenue: 7100, expenses: 3800 },
]

export function RevenueChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
      <BarChart data={data} accessibilityLayer>
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          fontSize={12}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          fontSize={12}
          tickFormatter={(value) => `$${value}`}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar
          dataKey="revenue"
          fill="var(--color-revenue)"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="expenses"
          fill="var(--color-expenses)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  )
}
```

Key points:
- `ChartContainer` injects CSS variables like `--color-revenue` based on the config
- Use `var(--color-<key>)` in `fill` and `stroke` props
- `accessibilityLayer` adds ARIA attributes to the chart
- `ChartTooltipContent` auto-formats using config labels

---

## 4. Line Chart — User Growth / Trends

```tsx
"use client"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"

const data = [
  { month: "Jan", users: 1200, active: 980 },
  { month: "Feb", users: 1800, active: 1400 },
  { month: "Mar", users: 2400, active: 1900 },
  { month: "Apr", users: 3100, active: 2500 },
  { month: "May", users: 3800, active: 3100 },
  { month: "Jun", users: 4600, active: 3700 },
]

const chartConfig = {
  users: {
    label: "Total Users",
    color: "hsl(var(--chart-1))",
  },
  active: {
    label: "Active Users",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function UserGrowthChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
      <LineChart data={data} accessibilityLayer>
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="hsl(var(--border))"
        />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          fontSize={12}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          fontSize={12}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line
          type="monotone"
          dataKey="users"
          stroke="var(--color-users)"
          strokeWidth={2}
          dot={{ r: 4, fill: "var(--color-users)" }}
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="active"
          stroke="var(--color-active)"
          strokeWidth={2}
          dot={{ r: 4, fill: "var(--color-active)" }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ChartContainer>
  )
}
```

---

## 5. Area Chart — Revenue Over Time (with Gradient Fill)

```tsx
"use client"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"

const data = [
  { month: "Jan", revenue: 18500, cost: 12000 },
  { month: "Feb", revenue: 22300, cost: 13500 },
  { month: "Mar", revenue: 19800, cost: 11800 },
  { month: "Apr", revenue: 27400, cost: 15200 },
  { month: "May", revenue: 31200, cost: 16800 },
  { month: "Jun", revenue: 35600, cost: 18200 },
]

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
  cost: {
    label: "Cost",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function RevenueAreaChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
      <AreaChart data={data} accessibilityLayer>
        <defs>
          <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0.05} />
          </linearGradient>
          <linearGradient id="fillCost" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-cost)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--color-cost)" stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="hsl(var(--border))"
        />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          fontSize={12}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          fontSize={12}
          tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value) => `$${Number(value).toLocaleString()}`}
            />
          }
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="var(--color-revenue)"
          strokeWidth={2}
          fill="url(#fillRevenue)"
        />
        <Area
          type="monotone"
          dataKey="cost"
          stroke="var(--color-cost)"
          strokeWidth={2}
          fill="url(#fillCost)"
        />
      </AreaChart>
    </ChartContainer>
  )
}
```

---

## 6. Bar Chart — Category Comparison

### Grouped Bar Chart

```tsx
"use client"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis } from "recharts"

const data = [
  { category: "Electronics", thisYear: 42000, lastYear: 35000 },
  { category: "Clothing", thisYear: 31000, lastYear: 28000 },
  { category: "Food", thisYear: 28000, lastYear: 25000 },
  { category: "Books", thisYear: 15000, lastYear: 18000 },
  { category: "Home", thisYear: 22000, lastYear: 19000 },
]

const chartConfig = {
  thisYear: {
    label: "This Year",
    color: "hsl(var(--chart-1))",
  },
  lastYear: {
    label: "Last Year",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

export function CategoryComparisonChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
      <BarChart data={data} accessibilityLayer>
        <XAxis
          dataKey="category"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          fontSize={12}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          fontSize={12}
          tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar
          dataKey="thisYear"
          fill="var(--color-thisYear)"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="lastYear"
          fill="var(--color-lastYear)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  )
}
```

### Stacked Bar Chart

```tsx
export function StackedBarChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
      <BarChart data={data} accessibilityLayer>
        <XAxis
          dataKey="category"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          fontSize={12}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          fontSize={12}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar
          dataKey="thisYear"
          fill="var(--color-thisYear)"
          stackId="a"
          radius={[0, 0, 0, 0]}
        />
        <Bar
          dataKey="lastYear"
          fill="var(--color-lastYear)"
          stackId="a"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  )
}
```

---

## 7. Pie / Donut Chart — Category Breakdown

```tsx
"use client"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Pie, PieChart, Cell, Label } from "recharts"

const data = [
  { name: "Direct", value: 4200 },
  { name: "Organic", value: 3100 },
  { name: "Referral", value: 2800 },
  { name: "Social", value: 1900 },
  { name: "Email", value: 1200 },
]

const chartConfig = {
  direct: { label: "Direct", color: "hsl(var(--chart-1))" },
  organic: { label: "Organic", color: "hsl(var(--chart-2))" },
  referral: { label: "Referral", color: "hsl(var(--chart-3))" },
  social: { label: "Social", color: "hsl(var(--chart-4))" },
  email: { label: "Email", color: "hsl(var(--chart-5))" },
} satisfies ChartConfig

const COLORS = [
  "var(--color-direct)",
  "var(--color-organic)",
  "var(--color-referral)",
  "var(--color-social)",
  "var(--color-email)",
]

export function TrafficDonutChart() {
  const total = data.reduce((sum, entry) => sum + entry.value, 0)

  return (
    <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[300px]">
      <PieChart accessibilityLayer>
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={60}
          outerRadius={100}
          strokeWidth={2}
          stroke="hsl(var(--background))"
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-2xl font-bold"
                    >
                      {total.toLocaleString()}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 20}
                      className="fill-muted-foreground text-xs"
                    >
                      Visitors
                    </tspan>
                  </text>
                )
              }
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  )
}
```

---

## 8. Composed Chart — Line + Bar Combined

```tsx
"use client"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"

const data = [
  { month: "Jan", sales: 4200, growth: 12 },
  { month: "Feb", sales: 5100, growth: 21 },
  { month: "Mar", sales: 4800, growth: -6 },
  { month: "Apr", sales: 6200, growth: 29 },
  { month: "May", sales: 5800, growth: -6 },
  { month: "Jun", sales: 7100, growth: 22 },
]

const chartConfig = {
  sales: {
    label: "Sales ($)",
    color: "hsl(var(--chart-1))",
  },
  growth: {
    label: "Growth (%)",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

export function SalesGrowthChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
      <ComposedChart data={data} accessibilityLayer>
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="hsl(var(--border))"
        />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          fontSize={12}
        />
        <YAxis
          yAxisId="left"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          fontSize={12}
          tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          fontSize={12}
          tickFormatter={(value) => `${value}%`}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar
          yAxisId="left"
          dataKey="sales"
          fill="var(--color-sales)"
          radius={[4, 4, 0, 0]}
          barSize={32}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="growth"
          stroke="var(--color-growth)"
          strokeWidth={2}
          dot={{ r: 4, fill: "var(--color-growth)" }}
        />
      </ComposedChart>
    </ChartContainer>
  )
}
```

---

## 9. Custom Tooltip Component

When `ChartTooltipContent` does not meet your needs, build a custom tooltip
that matches the design system:

```tsx
import { type TooltipProps } from "recharts"

interface CustomTooltipProps extends TooltipProps<number, string> {
  currencyPrefix?: string
}

function CustomChartTooltip({
  active,
  payload,
  label,
  currencyPrefix = "$",
}: CustomTooltipProps) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg">
      <p className="mb-1 text-xs font-medium text-muted-foreground">{label}</p>
      <div className="space-y-1">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="font-medium text-foreground">
              {currencyPrefix}{Number(entry.value).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Usage
<Tooltip content={<CustomChartTooltip currencyPrefix="$" />} />
```

---

## 10. Stat Cards with Sparklines

Mini inline charts inside dashboard stat cards. Combine a number, trend
indicator, and tiny area chart for at-a-glance metrics.

```tsx
"use client"

import { Area, AreaChart, ResponsiveContainer } from "recharts"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"

interface StatCardProps {
  title: string
  value: string
  change: number
  changeLabel: string
  data: { value: number }[]
  chartColor?: string
}

export function StatCard({
  title,
  value,
  change,
  changeLabel,
  data,
  chartColor = "hsl(var(--chart-1))",
}: StatCardProps) {
  const isPositive = change >= 0

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div
          className={`flex items-center gap-1 text-xs font-medium ${
            isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
          }`}
        >
          {isPositive ? (
            <ArrowUpRight className="h-3.5 w-3.5" />
          ) : (
            <ArrowDownRight className="h-3.5 w-3.5" />
          )}
          {Math.abs(change)}%
        </div>
      </div>

      <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">
        {value}
      </p>
      <p className="text-xs text-muted-foreground">{changeLabel}</p>

      <div className="mt-4 h-12">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`sparkGrad-${title}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColor} stopOpacity={0.2} />
                <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke={chartColor}
              strokeWidth={1.5}
              fill={`url(#sparkGrad-${title})`}
              isAnimationActive={true}
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// Usage
const revenueData = [
  { value: 12 }, { value: 18 }, { value: 15 }, { value: 22 },
  { value: 28 }, { value: 25 }, { value: 32 }, { value: 35 },
]

<StatCard
  title="Total Revenue"
  value="$45,231"
  change={12.5}
  changeLabel="vs last month"
  data={revenueData}
  chartColor="hsl(var(--chart-1))"
/>
```

---

## 11. Dashboard Layout Pattern

Standard dashboard grid with stat cards on top and chart cards below:

```tsx
import { StatCard } from "@/components/stat-card"
import { RevenueAreaChart } from "@/components/charts/revenue-area-chart"
import { UserGrowthChart } from "@/components/charts/user-growth-chart"
import { TrafficDonutChart } from "@/components/charts/traffic-donut-chart"
import { CategoryComparisonChart } from "@/components/charts/category-comparison-chart"

export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        Dashboard
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Overview of your business metrics
      </p>

      {/* Stat cards row */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value="$45,231"
          change={12.5}
          changeLabel="vs last month"
          data={revenueSparkline}
        />
        <StatCard
          title="Active Users"
          value="2,350"
          change={8.2}
          changeLabel="vs last month"
          data={usersSparkline}
        />
        <StatCard
          title="Conversion Rate"
          value="3.24%"
          change={-2.1}
          changeLabel="vs last month"
          data={conversionSparkline}
        />
        <StatCard
          title="Avg Order Value"
          value="$52.40"
          change={4.7}
          changeLabel="vs last month"
          data={aovSparkline}
        />
      </div>

      {/* Main charts row */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-foreground">Revenue Over Time</h3>
          <p className="text-sm text-muted-foreground">Monthly revenue and costs</p>
          <div className="mt-4">
            <RevenueAreaChart />
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-foreground">User Growth</h3>
          <p className="text-sm text-muted-foreground">Total vs active users</p>
          <div className="mt-4">
            <UserGrowthChart />
          </div>
        </div>
      </div>

      {/* Secondary charts row */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-foreground">Traffic Sources</h3>
          <p className="text-sm text-muted-foreground">Where your visitors come from</p>
          <div className="mt-4">
            <TrafficDonutChart />
          </div>
        </div>

        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-foreground">Sales by Category</h3>
          <p className="text-sm text-muted-foreground">Year-over-year comparison</p>
          <div className="mt-4">
            <CategoryComparisonChart />
          </div>
        </div>
      </div>
    </main>
  )
}
```

---

## 12. Activity Heatmap

A GitHub-style contribution heatmap built with plain divs and Tailwind:

```tsx
"use client"

interface HeatmapProps {
  data: { date: string; count: number }[]
  maxCount?: number
}

function getIntensity(count: number, max: number): string {
  if (count === 0) return "bg-muted"
  const ratio = count / max
  if (ratio < 0.25) return "bg-[hsl(var(--chart-1)/0.2)]"
  if (ratio < 0.5) return "bg-[hsl(var(--chart-1)/0.4)]"
  if (ratio < 0.75) return "bg-[hsl(var(--chart-1)/0.6)]"
  return "bg-[hsl(var(--chart-1)/0.9)]"
}

export function ActivityHeatmap({ data, maxCount }: HeatmapProps) {
  const max = maxCount ?? Math.max(...data.map((d) => d.count))

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1">
        {data.map((day) => (
          <div
            key={day.date}
            className={`h-3 w-3 rounded-sm transition-colors ${getIntensity(day.count, max)}`}
            title={`${day.date}: ${day.count} activities`}
            role="img"
            aria-label={`${day.date}: ${day.count} activities`}
          />
        ))}
      </div>
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <span>Less</span>
        <div className="h-3 w-3 rounded-sm bg-muted" />
        <div className="h-3 w-3 rounded-sm bg-[hsl(var(--chart-1)/0.2)]" />
        <div className="h-3 w-3 rounded-sm bg-[hsl(var(--chart-1)/0.4)]" />
        <div className="h-3 w-3 rounded-sm bg-[hsl(var(--chart-1)/0.6)]" />
        <div className="h-3 w-3 rounded-sm bg-[hsl(var(--chart-1)/0.9)]" />
        <span>More</span>
      </div>
    </div>
  )
}
```

---

## 13. Chart Theming and Dark Mode

### Automatic dark mode via CSS variables

Because all chart colors use `hsl(var(--chart-N))`, dark mode works
automatically when you define dark variants in `globals.css`:

```css
:root {
  --chart-1: 222 47% 51%;
}
.dark {
  --chart-1: 217 91% 60%;  /* Brighter in dark mode */
}
```

### Grid and axis styling for dark mode

```tsx
<CartesianGrid
  strokeDasharray="3 3"
  vertical={false}
  stroke="hsl(var(--border))"   /* Adapts automatically */
/>
<XAxis
  tick={{ fill: "hsl(var(--muted-foreground))" }}  /* Adapts automatically */
  tickLine={false}
  axisLine={false}
/>
```

### Tooltip dark mode

The custom tooltip component from Section 9 uses `bg-card`, `text-foreground`,
and `border-border` classes which flip automatically in dark mode.

---

## 14. Animation Tips

### Recharts built-in animation

All Recharts components support animation props:

```tsx
<Bar
  dataKey="value"
  fill="var(--color-value)"
  isAnimationActive={true}       /* default: true */
  animationBegin={0}             /* delay in ms */
  animationDuration={800}        /* duration in ms */
  animationEasing="ease-out"     /* ease, ease-in, ease-out, ease-in-out, linear */
/>
```

### Staggered animation per series

Give each series a different `animationBegin` to create a stagger effect:

```tsx
<Bar dataKey="revenue" animationBegin={0} animationDuration={800} />
<Bar dataKey="expenses" animationBegin={200} animationDuration={800} />
<Line dataKey="growth" animationBegin={400} animationDuration={800} />
```

### Animated number display

A counter that animates from 0 to the target value, useful for stat card totals:

```tsx
"use client"

import { useEffect, useState } from "react"

interface AnimatedNumberProps {
  value: number
  duration?: number
  prefix?: string
  suffix?: string
  className?: string
}

export function AnimatedNumber({
  value,
  duration = 1000,
  prefix = "",
  suffix = "",
  className,
}: AnimatedNumberProps) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const startTime = Date.now()
    const startValue = display

    function animate() {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.round(startValue + (value - startValue) * eased)
      setDisplay(current)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [value, duration])

  return (
    <span className={className}>
      {prefix}{display.toLocaleString()}{suffix}
    </span>
  )
}

// Usage
<AnimatedNumber value={45231} prefix="$" className="text-2xl font-bold text-foreground" />
```

### Chart entry with Framer Motion

Wrap chart containers in a Framer Motion `motion.div` for scroll-reveal:

```tsx
"use client"

import { motion } from "framer-motion"

export function AnimatedChartCard({ children, title, description }: {
  children: React.ReactNode
  title: string
  description: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="rounded-xl border border-border bg-card p-6 shadow-sm"
    >
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
      <div className="mt-4">{children}</div>
    </motion.div>
  )
}
```

---

## 15. Plotly — Advanced / Scientific Charts

Use Plotly ONLY when you need capabilities Recharts does not have:
- 3D surface/scatter plots
- Geographic maps (choropleth, scattergeo)
- Scientific plots (contour, heatmap with z-axis, violin, waterfall)
- Interactive zoom/pan on large datasets (10k+ points)

For standard line, bar, area, pie charts — ALWAYS use Recharts.

### Basic setup

```tsx
"use client"

import dynamic from "next/dynamic"

// Plotly must be loaded client-side only (no SSR)
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false })

export function ScatterPlot3D() {
  return (
    <Plot
      data={[
        {
          x: [1, 2, 3, 4, 5],
          y: [10, 15, 13, 17, 22],
          z: [5, 8, 6, 9, 12],
          type: "scatter3d",
          mode: "markers",
          marker: {
            size: 6,
            color: "hsl(222, 47%, 51%)",
            opacity: 0.8,
          },
        },
      ]}
      layout={{
        autosize: true,
        margin: { l: 0, r: 0, b: 0, t: 0 },
        paper_bgcolor: "transparent",
        plot_bgcolor: "transparent",
        scene: {
          xaxis: { title: "X Axis" },
          yaxis: { title: "Y Axis" },
          zaxis: { title: "Z Axis" },
        },
      }}
      config={{
        responsive: true,
        displayModeBar: false,
      }}
      style={{ width: "100%", height: "400px" }}
    />
  )
}
```

### Plotly dark mode

```tsx
layout={{
  paper_bgcolor: "transparent",
  plot_bgcolor: "transparent",
  font: { color: "hsl(var(--foreground))" },
  xaxis: { gridcolor: "hsl(var(--border))" },
  yaxis: { gridcolor: "hsl(var(--border))" },
}}
```

---

## 16. Common Patterns Cheat Sheet

| Dashboard need | Chart type | Component |
|----------------|-----------|-----------|
| Revenue over time | Area chart with gradient | `RevenueAreaChart` |
| User growth trend | Multi-line chart | `UserGrowthChart` |
| Traffic sources | Donut chart with center label | `TrafficDonutChart` |
| Category comparison | Grouped bar chart | `CategoryComparisonChart` |
| Sales + growth rate | Composed bar + line | `SalesGrowthChart` |
| Quick metric + trend | Stat card with sparkline | `StatCard` |
| Activity frequency | Heatmap grid | `ActivityHeatmap` |
| Animated totals | Counter animation | `AnimatedNumber` |
| 3D / scientific data | Plotly scatter/surface | `ScatterPlot3D` |

---

## 17. Responsive Chart Sizing

Recharts charts do NOT auto-resize by default. Always wrap them properly.

### With shadcn ChartContainer (preferred)

`ChartContainer` handles responsive sizing internally. Just set dimensions
via className:

```tsx
<ChartContainer config={config} className="min-h-[200px] sm:min-h-[300px] w-full">
  <BarChart data={data}>...</BarChart>
</ChartContainer>
```

### Without shadcn (raw Recharts)

Use `ResponsiveContainer` from Recharts:

```tsx
import { ResponsiveContainer, BarChart, Bar } from "recharts"

<div className="h-[300px] w-full">
  <ResponsiveContainer width="100%" height="100%">
    <BarChart data={data}>
      <Bar dataKey="value" fill="hsl(var(--chart-1))" />
    </BarChart>
  </ResponsiveContainer>
</div>
```

IMPORTANT: `ResponsiveContainer` requires a parent with explicit height.
Always wrap it in a `div` with a height class.

---

## 18. Rules Summary

1. ALWAYS use `hsl(var(--chart-N))` for colors — never hardcode hex
2. ALWAYS use `ChartContainer` (shadcn) or `ResponsiveContainer` (raw) for sizing
3. ALWAYS set `tickLine={false}` and `axisLine={false}` for clean look
4. ALWAYS add `accessibilityLayer` on the root chart component
5. ALWAYS define chart colors in `globals.css` with dark mode variants
6. Use `ChartTooltipContent` for standard tooltips, custom component for advanced
7. Use Recharts for all standard charts, Plotly only for 3D/scientific/geo
8. Wrap chart cards in `motion.div` for scroll-reveal animation (production scope)
9. Use staggered `animationBegin` for multi-series entry effect
10. Keep chart height consistent: `min-h-[300px]` for main charts, `h-12` for sparklines
