import { ChartAreaInteractive } from "../components/charts/chart-area-interactive";
import { DataTable } from "../components/tables/data-table";
import { SectionCards } from "../components/cards/section-cards";

import { useDashboardData } from "../hooks/useDashboardData";
import mockData from "../data.json";
import type { CardData } from "../types";

export function DashboardPage() {
  const { data: dashboardData } = useDashboardData();
  const cardsData: CardData[] = [
    {
      title: "Total Earnings",
      value: `$${dashboardData?.total_earnings ?? 0}`,
      description: "Earnings for the last month",
      trend: +12.5,
      caption: "Patients for the current month",
    },
    {
      title: "Total Patients",
      value: dashboardData?.total_patients ?? 0,
      description: "Active patients",
      trend: +5,
      caption: "Patients under care",
    },
    {
      title: "Total Appointments",
      value: dashboardData?.total_appointments ?? 0,
      description: "Appointments this month",
      trend: -3,
      caption: "Scheduled this month",
    },
  ];
  // const tableData = dashboardData?.latest_appointments ?? [];

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <SectionCards cards={cardsData} />
        <div className="px-4 lg:px-6">
          <ChartAreaInteractive />
        </div>
        <DataTable data={mockData} />
      </div>
    </div>
  );
}
