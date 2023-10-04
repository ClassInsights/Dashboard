import { AuthProvider } from "./contexts/AuthContext";
import LinkGroupModal, {
  LinkGroupProvider,
} from "./components/modals/LinkGroupModal";
import { ThemeProvider } from "./contexts/ThemeContext";
import "./globals.css";
import type { Metadata } from "next";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { DataProvider } from "./contexts/DataContext";

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
      <body className="text-white bg-background dark:bg-dark-background">
        <main className="relative mx-4 min-h-screen md:mx-auto md:w-5/6 xl:w-[65%] 2xl:w-3/5">
          <ThemeProvider>
            <AuthProvider>
              <DataProvider>
                <LinkGroupProvider>
                  <LinkGroupModal />
                  <div className="h-full min-h-screen">{children}</div>
                </LinkGroupProvider>
              </DataProvider>
            </AuthProvider>
          </ThemeProvider>
        </main>
      </body>
    </html>
  );
}
