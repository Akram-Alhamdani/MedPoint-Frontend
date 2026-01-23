import { ModeToggle } from "@/shared/components/ModeToggle";
import { LanguageToggle } from "../../LanguageToggle";
import { Separator } from "@/shared/components/ui/separator";
import { SidebarTrigger } from "@/shared/components/ui/sidebar";
import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function SiteHeader() {
  const location = useLocation();

  const { t } = useTranslation();
  const pageTitle = useMemo(() => {
    const pathname = location.pathname.replace(/\/$/, "");
    if (pathname.endsWith("/doctor/dashboard")) return t("sidebar.dashboard");
    if (pathname.endsWith("/doctor/dashboard/appointments"))
      return t("sidebar.appointments");
    if (pathname.endsWith("/doctor/dashboard/profile"))
      return t("header.profile");
    if (pathname.endsWith("/doctor/dashboard/schedule"))
      return t("sidebar.schedule");
    if (pathname.endsWith("/doctor/dashboard/settings"))
      return t("header.settings");
    if (pathname.endsWith("/doctor/dashboard/working-hours"))
      return t("sidebar.working_hours");
    return t("sidebar.dashboard");
  }, [location.pathname, t]);

  const { i18n } = useTranslation();
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{pageTitle ?? "Documents"}</h1>
        <div
          className={`${i18n.language === "ar" ? "mr-auto" : "ml-auto"} flex items-center gap-2`}
        >
          <ModeToggle />
          <LanguageToggle />
        </div>
      </div>
    </header>
  );
}
