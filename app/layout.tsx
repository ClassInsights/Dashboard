import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import "./globals.css";
import type { Metadata } from "next";
import { DataProvider } from "./contexts/DataContext";
import Alert from "./components/general/Alert";
import { AlertProvider } from "./contexts/AlertContext";

export const metadata: Metadata = {
  title: "ClassInsights",
  description: "Admin Dashboard for ClassInsights",
  publisher: "HAK/HLW/HAS Landeck",
  applicationName: "ClassInsights",
  keywords: [
    "ClassInsights",
    "Admin",
    "Dashboard",
    "HAK Landeck",
    "Landeck",
    "HAK",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body className="overflow-x-hidden bg-background dark:bg-dark-background">
        <main className="relative mx-4 min-h-screen md:mx-auto md:w-5/6 xl:w-[65%] 2xl:w-3/5">
          <AuthProvider>
            <ThemeProvider>
              <DataProvider>
                <AlertProvider>
                  <Alert />
                  <div className="h-full min-h-screen">{children}</div>
                </AlertProvider>
              </DataProvider>
            </ThemeProvider>
          </AuthProvider>
        </main>
      </body>
    </html>
  );
}
