import { AuthForm } from "@/components/auth/AuthForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f4f4f2] px-5 py-10">
      <div className="w-full max-w-md">
        <AuthForm mode="login" />
      </div>
    </main>
  );
}
