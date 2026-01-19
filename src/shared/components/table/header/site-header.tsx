import { ModeToggle } from "@/shared/components/ModeToggle";
import { Separator } from "@/shared/components/ui/separator";
import { SidebarTrigger } from "@/shared/components/ui/sidebar";
import { useMemo } from "react";
import { useLocation } from "react-router-dom";

export function SiteHeader() {
  const location = useLocation();

  const pageTitle = useMemo(() => {
    const pathname = location.pathname.replace(/\/$/, "");
    if (pathname.endsWith("/doctor/dashboard")) return "Dashboard";
    if (pathname.endsWith("/doctor/dashboard/appointments"))
      return "Appointments";
    if (pathname.endsWith("/doctor/dashboard/schedule")) return "Schedule";
    if (pathname.endsWith("/doctor/dashboard/settings")) return "Settings";
    if (pathname.endsWith("/doctor/dashboard/working-hours"))
      return "Working Hours";
    return "Dashboard";
  }, [location.pathname]);

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{pageTitle ?? "Documents"}</h1>
        <div className="ml-auto flex items-center gap-2">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
