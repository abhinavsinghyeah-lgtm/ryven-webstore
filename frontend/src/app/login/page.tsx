import { AuthForm } from "@/components/auth/AuthForm";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,#dbeafe_0%,#eff6ff_45%,#f8fafc_100%)] px-5 py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.7)_0%,transparent_55%),radial-gradient(circle_at_70%_10%,rgba(255,255,255,0.6)_0%,transparent_55%)]" />
      <div className="relative w-full max-w-md">
        <AuthForm mode="login" />
      </div>
    </main>
  );
}
