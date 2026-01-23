import { useTranslation } from "react-i18next";
import { ChartAreaInteractive } from "../components/chart-area-interactive";
import { SectionCards } from "../components/section-cards";
import { useDashboardData } from "../hooks/useDashboardData";
import type { CardData } from "../types";
import { Spinner } from "@/shared/components/ui/spinner";

function DashboardPage() {
  const { t } = useTranslation();
  const { data: dashboardData, isPending } = useDashboardData();
  const cardsData: CardData[] = [
    {
      title: t("dashboard.total_earnings"),
      value: `$${dashboardData?.total_earnings ?? 0}`,
      description: t("dashboard.earnings_last_month"),
      caption: t("dashboard.patients_current_month"),
    },
    {
      title: t("dashboard.total_patients"),
      value: dashboardData?.total_patients ?? 0,
      description: t("dashboard.active_patients"),
      caption: t("dashboard.patients_under_care"),
    },
    {
      title: t("dashboard.total_appointments"),
      value: dashboardData?.total_appointments ?? 0,
      description: t("dashboard.appointments_this_month"),
      caption: t("dashboard.scheduled_this_month"),
    },
  ];

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        {isPending ? (
          <Spinner className="size-10 left-1/2 top-1/2 absolute -translate-x-1/2 -translate-y-1/2" />
        ) : (
          <>
            <SectionCards cards={cardsData} />
            <div className="px-4 lg:px-6">
              <ChartAreaInteractive
                chartData={dashboardData?.patients_summary ?? []}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
export default DashboardPage;
