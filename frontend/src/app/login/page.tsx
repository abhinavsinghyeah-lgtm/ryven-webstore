import { AuthForm } from "@/components/auth/AuthForm";
import { apiRequest } from "@/lib/api";
import type { StoreSettings } from "@/types/auth";

async function getStoreSettings() {
  try {
    const response = await apiRequest<{ settings: StoreSettings }>("/store-settings");
    return response.settings;
  } catch {
    return null;
  }
}

export default async function LoginPage() {
  const settings = await getStoreSettings();
  const backgroundUrl = settings?.authBackgroundUrl || "";

  return (
    <main className="auth-page">
      {backgroundUrl ? <div className="auth-page-bg" style={{ backgroundImage: `url(${backgroundUrl})` }} /> : null}
      <div className="auth-page-overlay" />
      <div className="auth-page-blob" />
      <AuthForm mode="login" />
    </main>
  );
}
