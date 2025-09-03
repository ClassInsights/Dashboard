import AuthProvider from "@/contexts/AuthContext";
import { SearchProvider } from "@/contexts/SearchContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { Computer, Forward, Home, Reply, RotateCcw, School, Settings } from "lucide-react";
import { Link, Outlet, useLocation, useNavigate } from "react-router";
import { Fragment } from "react/jsx-runtime";
import CommandMenu from "../CommandMenu";
import Search from "../Search";
import AppSidebar from "../Sidebar";
import ToastMessage from "../ToastMessage";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "../ui/context-menu";
import { Separator } from "../ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import Updater from "../Updater";

const translatePath = (path: string) => {
  switch (path) {
    case "/":
      return "Startseite";
    case "ad":
      return "Active Directory";
    default:
      return path.charAt(0).toUpperCase() + path.slice(1);
  }
};

const MainLayout = () => {
  const { pathname } = useLocation();

  const navigate = useNavigate();

  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbItems = segments.reduce(
    (acc, segment, index) => {
      const path = `/${segments.slice(0, index + 1).join("/")}`;
      acc.push({ path, title: translatePath(segment) });
      return acc;
    },
    [{ path: "/", title: translatePath("/") }],
  );

  return (
    <ToastProvider>
      <ToastMessage />
      <AuthProvider>
        <Updater />
        <SearchProvider>
          <ContextMenu>
            <ContextMenuTrigger asChild>
              <SidebarProvider>
                <CommandMenu />
                <AppSidebar />
                <SidebarInset className="min-w-0">
                  <header className="flex h-16 shrink-0 items-center justify-between border-b px-4">
                    <nav className="flex items-center gap-2">
                      <SidebarTrigger className="-ml-1" />
                      <Separator
                        orientation="vertical"
                        className="mr-2 data-[orientation=vertical]:h-4"
                      />
                      <Breadcrumb>
                        <BreadcrumbList>
                          {breadcrumbItems.map((item, index) => (
                            <Fragment key={item.path}>
                              <BreadcrumbItem>
                                {index === breadcrumbItems.length - 1 ? (
                                  <BreadcrumbPage>{item.title}</BreadcrumbPage>
                                ) : (
                                  <BreadcrumbLink asChild>
                                    <Link to={item.path}>{item.title}</Link>
                                  </BreadcrumbLink>
                                )}
                              </BreadcrumbItem>
                              {index < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
                            </Fragment>
                          ))}
                        </BreadcrumbList>
                      </Breadcrumb>
                    </nav>
                    <Search />
                  </header>
                  <div className="p-4 lg:pr-10">
                    <Outlet />
                  </div>
                </SidebarInset>
                <ContextMenuContent className="w-52">
                  <ContextMenuItem onClick={() => history.back()}>
                    <Reply />
                    Zurück
                  </ContextMenuItem>
                  <ContextMenuItem onClick={() => history.forward()}>
                    <Forward />
                    Vor
                  </ContextMenuItem>
                  <ContextMenuItem onClick={() => location.reload()}>
                    <RotateCcw />
                    Seite neu laden
                  </ContextMenuItem>
                  <ContextMenuSeparator />
                  <ContextMenuItem onClick={() => navigate("/")} disabled={pathname === "/"}>
                    <Home />
                    Startseite
                  </ContextMenuItem>
                  <ContextMenuItem
                    onClick={() => navigate("/computer")}
                    disabled={pathname === "/computer"}
                  >
                    <Computer />
                    Computer
                  </ContextMenuItem>
                  <ContextMenuItem
                    onClick={() => navigate("/konfiguration")}
                    disabled={pathname === "/konfiguration"}
                  >
                    <Settings />
                    Konfiguration
                  </ContextMenuItem>
                  <ContextMenuItem
                    onClick={() => navigate("/raumverwaltung")}
                    disabled={pathname === "/raumverwaltung"}
                  >
                    <School />
                    Raumverwaltung
                  </ContextMenuItem>
                </ContextMenuContent>
              </SidebarProvider>
            </ContextMenuTrigger>
          </ContextMenu>
        </SearchProvider>
      </AuthProvider>
    </ToastProvider>
  );
};

export default MainLayout;
