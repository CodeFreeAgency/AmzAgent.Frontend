import { useState } from "react";
import { Button, Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth";
import { AuthField } from "@/components/auth/AuthField";

export function SignIn() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const email = e.target.email.value;
    const password = e.target.password.value;
    const result = login(email, password);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    navigate("/dashboard/home");
  }

  return (
    <section className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/40 to-slate-100 p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200/80 bg-white p-8 shadow-card sm:p-10">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#2196F3] to-[#3F51B5] text-sm font-bold text-white">
            FA
          </div>
          <Typography className="text-2xl font-bold text-slate-900">
            Fulfilment Agent
          </Typography>
          <Typography className="mt-2 text-sm text-slate-500">
            Sign in to your account
          </Typography>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <AuthField name="email" type="email" label="Email" autoComplete="email" />
          <AuthField
            name="password"
            type="password"
            label="Password"
            autoComplete="current-password"
          />
          {error && (
            <Typography className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            className="mt-2 bg-[#2196F3] py-3 normal-case"
          >
            Sign In
          </Button>
        </form>
      </div>
    </section>
  );
}

export default SignIn;
