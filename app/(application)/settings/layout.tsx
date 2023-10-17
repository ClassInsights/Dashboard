import ChangesBanner from "@/app/components/ChangesBanner";
import { ConfigProvider } from "@/app/contexts/ConfigContext";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConfigProvider>
      <ChangesBanner />
      {children}
    </ConfigProvider>
  );
}
