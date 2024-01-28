import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import "./globals.css";
import type { Metadata } from "next";
import Alert from "./components/general/Alert";
import { AlertProvider } from "./contexts/AlertContext";
import { RatelimitProvider } from "./contexts/RatelimitContext";
import { FailProvider } from "./contexts/FailContext";
import { LogProvider } from "./contexts/LogContext";
import { ResponseProvider } from "./contexts/ResponseContext";
import { RoomProvider } from "./contexts/RoomContext";
import { ComputerProvider } from "./contexts/ComputerContext";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "ClassInsights Dashboard",
  description: "Admin Dashboard for ClassInsights",
  publisher: "ClassInsights",
  applicationName: "ClassInsights Dashboard",
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
          <ThemeProvider>
            <FailProvider>
              <AuthProvider>
                <RatelimitProvider>
                  <AlertProvider>
                    <ResponseProvider>
                      <RoomProvider>
                        <ComputerProvider>
                          <LogProvider>
                            <Alert />
                            <div className="h-full min-h-screen">
                              {children}
                            </div>
                          </LogProvider>
                        </ComputerProvider>
                      </RoomProvider>
                    </ResponseProvider>
                  </AlertProvider>
                </RatelimitProvider>
              </AuthProvider>
            </FailProvider>
          </ThemeProvider>
        </main>
      </body>
    </html>
  );
}
