"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { useTranslation } from "react-i18next";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/shared/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/shared/components/ui/toggle-group";

export const description = "An interactive area chart";

function getChartConfig(t: any) {
  return {
    visitors: {
      label: t("dashboard.chart.title"),
    },
    male: {
      label: t("dashboard.chart.male"),
      color: "var(--primary)",
    },
    female: {
      label: t("dashboard.chart.female"),
      color: "var(--primary)",
    },
  } satisfies ChartConfig;
}

export function ChartAreaInteractive(patients_summary: {
  chartData: Array<{
    date: string;
    M: number;
    F: number;
  }>;
}) {
  const { t, i18n } = useTranslation();
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("90d");
  const rangeLabels: Record<string, string> = {
    "90d": t("dashboard.chart.range_90d"),
    "30d": t("dashboard.chart.range_30d"),
    "7d": t("dashboard.chart.range_7d"),
  };
  const genderData = React.useMemo(
    () =>
      patients_summary.chartData.map(({ date, M, F }) => ({
        date,
        male: M,
        female: F,
      })),
    [patients_summary.chartData],
  );

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  const filteredData = genderData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date();
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  const chartConfig = getChartConfig(t);

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>{t("dashboard.chart.title")}</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            {t("dashboard.chart.description_full", {
              range:
                rangeLabels[timeRange] ??
                t("dashboard.chart.description_short", { range: timeRange }),
            })}
          </span>
          <span className="@[540px]/card:hidden">
            {t("dashboard.chart.description_short", {
              range: rangeLabels[timeRange] ?? timeRange,
            })}
          </span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:px-4! @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">
              {t("dashboard.chart.range_90d")}
            </ToggleGroupItem>
            <ToggleGroupItem value="30d">
              {t("dashboard.chart.range_30d")}
            </ToggleGroupItem>
            <ToggleGroupItem value="7d">
              {t("dashboard.chart.range_7d")}
            </ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder={t("dashboard.chart.range_90d")} />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                {t("dashboard.chart.range_90d")}
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                {t("dashboard.chart.range_30d")}
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                {t("dashboard.chart.range_7d")}
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillMale" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-male)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-male)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillFemale" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-female)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-female)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString(
                  i18n.language === "ar" ? "ar-EG" : "en-US",
                  {
                    month: "short",
                    day: "numeric",
                  },
                );
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString(
                      i18n.language === "ar" ? "ar-EG" : "en-US",
                      {
                        month: "short",
                        day: "numeric",
                      },
                    );
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="female"
              type="natural"
              fill="url(#fillFemale)"
              stroke="var(--color-female)"
              stackId="a"
            />
            <Area
              dataKey="male"
              type="natural"
              fill="url(#fillMale)"
              stroke="var(--color-male)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
