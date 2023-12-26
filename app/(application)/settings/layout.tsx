import ChangesBanner from "@/app/components/settings/ChangesBanner";
import { AzureProvider } from "@/app/contexts/AzureContext";
import { ConfigProvider } from "@/app/contexts/ConfigContext";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConfigProvider>
      <AzureProvider>
        <ChangesBanner />
        {children}
      </AzureProvider>
    </ConfigProvider>
  );
}
