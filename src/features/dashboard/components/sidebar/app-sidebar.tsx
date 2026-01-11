import * as React from "react";
import {
  IconChartBar,
  IconDashboard,
  IconInnerShadowTop,
  IconListDetails,
  IconSettings,
} from "@tabler/icons-react";

import { NavMain } from "@/features/dashboard/components/sidebar/nav-main";
import { NavSecondary } from "@/features/dashboard/components/sidebar/nav-secondary";
import { NavUser } from "@/features/dashboard/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/components/ui/sidebar";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/doctor/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Appointments",
      url: "/doctor/dashboard/appointments",
      icon: IconListDetails,
    },
    {
      title: "Schedule",
      url: "/doctor/dashboard/schedule",
      icon: IconChartBar,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/doctor/dashboard/settings",
      icon: IconSettings,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto " />
      </SidebarContent>
      <SidebarFooter>
        {user ? (
          <div className="shadow-lg rounded-md">
            <NavUser
              user={{
                name: user!.full_name,
                email: user!.email,
                avatar: user!.image || "/default-avatar.png",
              }}
            />
          </div>
        ) : null}
      </SidebarFooter>
    </Sidebar>
  );
}
