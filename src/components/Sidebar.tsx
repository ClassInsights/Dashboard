import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import {
  BookOpen,
  ChevronsUpDown,
  Computer,
  Home,
  LogOut,
  MessageCircleQuestionMark,
  School,
  School2,
  Settings,
  User2,
} from "lucide-react";
import { Link } from "react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "./ui/sidebar";

const items = [
  {
    title: "Startseite",
    url: "../",
    icon: Home,
  },
  {
    title: "Computer",
    url: "computer",
    icon: Computer,
  },
  {
    title: "Konfiguration",
    url: "konfiguration",
    icon: Settings,
  },
  {
    title: "Raumverwaltung",
    url: "raumverwaltung",
    icon: School,
  },
];

const externItems = [
  {
    title: "Schulauswahl",
    url: import.meta.env.PROD
      ? "https://classinsights.at/schulen"
      : "http://localhost:5173/schulen",
    icon: School2,
  },
  {
    title: "Dokumentation",
    url: "https://github.com/ClassInsights/Installer/blob/main/readme.md",
    icon: BookOpen,
  },
  {
    title: "Support",
    url: "mailto:office@classinsights.at",
    icon: MessageCircleQuestionMark,
  },
];

const AppSidebar = () => {
  const auth = useAuth();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/">
                <img src="/logo.svg" alt="Logo" className="mr-1 h-8 w-8 rounded-full" />
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">ClassInsights</span>
                  <span>v{import.meta.env.PACKAGE_VERSION}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Übersicht</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Extern</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {externItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                      <item.icon />
                      {item.title}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 className="mr-1 size-4" />
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{auth.name}</span>
                    <span className="truncate text-xs">{auth.email}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                sideOffset={4}
              >
                <DropdownMenuItem onClick={auth.logout}>
                  <LogOut />
                  Abmelden
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

export default AppSidebar;
