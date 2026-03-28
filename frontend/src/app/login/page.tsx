import { AuthForm } from "@/components/auth/AuthForm";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,#bfe6ff_0%,#e9f4ff_45%,#f7fbff_100%)] px-5 py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.9)_0%,transparent_60%),radial-gradient(circle_at_70%_10%,rgba(255,255,255,0.7)_0%,transparent_60%)]" />
      <div className="relative w-full max-w-md">
        <AuthForm mode="login" />
      </div>
    </main>
  );
}
