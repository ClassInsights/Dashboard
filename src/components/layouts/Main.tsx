import AuthProvider from "@/contexts/AuthContext";
import { Link, Outlet, useLocation } from "react-router";
import { Fragment } from "react/jsx-runtime";
import AppSidebar from "../Sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { Separator } from "../ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "../ui/sidebar";

const translatePath = (path: string) => {
  switch (path) {
    case "/":
      return "Startseite";
    default:
      return path.charAt(0).toUpperCase() + path.slice(1);
  }
};

const MainLayout = () => {
  const { pathname } = useLocation();

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
    <AuthProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
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
          </header>
          <div className="p-4 lg:pr-10">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </AuthProvider>
  );
};

export default MainLayout;
