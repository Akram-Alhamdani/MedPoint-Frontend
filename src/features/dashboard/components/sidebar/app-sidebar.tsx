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
import { useAppSelector } from "@/store/hooks";

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
  const user = useAppSelector((state) => state.auth.user) || {
    full_name: "Known User",
    email: "user@example.com",
    image: "",
  };
  const nameParts = user!.full_name.split(" ");
  const userName = `${nameParts[0]} ${nameParts[nameParts.length - 1]}`;

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
        <div className="shadow-lg rounded-md">
          <NavUser
            user={{
              name: userName,
              email: user!.email,
              avatar: user!.image || "/default-avatar.png",
            }}
          />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
