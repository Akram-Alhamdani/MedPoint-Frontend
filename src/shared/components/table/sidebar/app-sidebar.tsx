import * as React from "react";
import { useTranslation } from "react-i18next";
import {
  IconDashboard,
  IconInnerShadowTop,
  IconListDetails,
  IconStar,
  IconCalendar,
  IconClock,
  IconFolders,
} from "@tabler/icons-react";

import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/components/ui/sidebar";

function getSidebarNavItems(t: any) {
  return [
    {
      title: t("sidebar.dashboard"),
      url: "/doctor/dashboard",
      icon: IconDashboard,
    },
    {
      title: t("sidebar.appointments"),
      url: "/doctor/dashboard/appointments",
      icon: IconListDetails,
    },
    {
      title: t("sidebar.shared_folders"),
      url: "/doctor/dashboard/shared-folders",
      icon: IconFolders,
    },
    {
      title: t("sidebar.schedule"),
      url: "/doctor/dashboard/schedule",
      icon: IconCalendar,
    },
    {
      title: t("sidebar.working_hours"),
      url: "/doctor/dashboard/working-hours",
      icon: IconClock,
    },
    {
      title: t("sidebar.reviews"),
      url: "/doctor/dashboard/reviews",
      icon: IconStar,
    },
  ];
}

// Helper to resolve image URL (copied from ProfilePage)
function resolveImageUrl(image: string | null): string | null {
  if (!image) return null;
  if (image.startsWith("blob:")) return image;
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  const apiBase = import.meta.env.VITE_API_BASE_URL || "";
  const rootBase = apiBase.replace(/\/api\/?$/, "");
  // Normalize leading slash for media/static
  const normalized = image.replace(/^\//, "");
  if (normalized.startsWith("media/") || normalized.startsWith("static/")) {
    return `${rootBase}/${normalized}`;
  }
  // If image starts with /api/media/ or /api/static/, use API base URL
  if (image.startsWith("/api/media/") || image.startsWith("/api/static/")) {
    return `${apiBase.replace(/\/$/, "")}${image}`;
  }
  // Otherwise, fallback to previous logic
  const base = apiBase.replace(/\/$/, "");
  return base && image ? `${base}/${image.replace(/^\//, "")}` : image;
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { t } = useTranslation();
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") || "")
    : null;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <div>
                <IconInnerShadowTop className="size-5!" />
                <span className="text-base font-semibold">MedPoint</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={getSidebarNavItems(t)} />
      </SidebarContent>
      <SidebarFooter>
        {user ? (
          <div className="shadow-lg rounded-md">
            {/* Use the same image resolver as profile page for consistency */}
            <NavUser
              user={{
                name: user!.full_name,
                email: user!.email,
                avatar: resolveImageUrl
                  ? resolveImageUrl(user!.image)
                  : user!.image || "/default-avatar.png",
                is_verified_doctor: user!.is_verified_doctor,
              }}
            />
          </div>
        ) : null}
      </SidebarFooter>
    </Sidebar>
  );
}
