"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAppDispatch } from "@/lib/hooks";
import { signIn } from "@/store/slices/auth-slice";

export function AuthEntryCard({ mode }: { mode: "login" | "signup" }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [form, setForm] = useState({
    name: "Kush Kansal",
    email: "kush@lumaboard.app",
    role: "Backend DEV",
  });

  const isSignup = mode === "signup";

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="panel-surface w-full max-w-[760px] rounded-[40px] p-8">
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
          {isSignup ? "Create profile" : "Welcome back"}
        </div>
        <h1 className="mt-3 font-(--font-heading) text-4xl tracking-[-0.05em]">
          {isSignup ? "Set up your personalized dashboard profile" : "Sign in to your dashboard"}
        </h1>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {[
            { key: "name", label: "Name" },
            { key: "email", label: "Email" },
            { key: "role", label: "Role" },
          ].map((field) => (
            <label
              key={field.key}
              className="soft-card rounded-[28px] p-5 text-sm sm:col-span-1"
            >
              <div className="mb-2 text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
                {field.label}
              </div>
              <input
                value={form[field.key as keyof typeof form]}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    [field.key]: event.target.value,
                  }))
                }
                className="w-full bg-transparent text-[var(--text-primary)] outline-none"
              />
            </label>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={() => {
              dispatch(signIn(form));
              router.push("/dashboard");
            }}
            className="rounded-full bg-[var(--surface-contrast)] px-5 py-3 text-sm font-semibold text-[var(--app-bg)]"
          >
            {isSignup ? "Create account" : "Sign in"}
          </button>
          <Link
            href={isSignup ? "/login" : "/signup"}
            className="text-sm font-semibold text-[var(--text-primary)]"
          >
            {isSignup ? "Already have an account?" : "Need an account?"}
          </Link>
        </div>
      </div>
    </div>
  );
}
