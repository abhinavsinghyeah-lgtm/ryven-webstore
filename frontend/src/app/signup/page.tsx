import { AuthForm } from "@/components/auth/AuthForm";

export default function SignupPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-5 py-10">
      <AuthForm mode="signup" />
    </main>
  );
}
