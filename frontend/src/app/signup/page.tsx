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

export default async function SignupPage() {
  const settings = await getStoreSettings();
  const backgroundUrl = settings?.authBackgroundUrl || "";
  const backgroundColor = settings?.authBackgroundColor || "#f4f4f5";

  return (
    <main
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-10"
      style={{
        backgroundColor,
        backgroundImage: backgroundUrl ? `url(${backgroundUrl})` : undefined,
        backgroundSize: backgroundUrl ? "cover" : undefined,
        backgroundPosition: backgroundUrl ? "center" : undefined,
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/70 via-white/40 to-white/20" />
      <div className="pointer-events-none absolute -top-16 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-white/50 blur-3xl" />
      <div className="relative w-full max-w-md">
        <AuthForm mode="signup" />
      </div>
    </main>
  );
}
