import { AppSidebar } from "./sidebar/app-sidebar";
import { SiteHeader } from "./header/site-header";
import { SidebarInset, SidebarProvider } from "@/shared/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function DashboardLayout() {
  const { i18n } = useTranslation();
  const side = i18n.language === "ar" ? "right" : "left";
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" side={side} />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
