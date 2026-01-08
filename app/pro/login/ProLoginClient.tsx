"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { siteContent } from "@/lib/content";
import { login } from "@/lib/auth";

export const ProLoginClient = () => {
  const router = useRouter();
  const { login: loginContent } = siteContent.pro;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  return (
    <div className="min-h-screen bg-graphite pt-24">
      <div className="mx-auto w-full max-w-md px-5">
        <h1 className="section-heading">{loginContent.title}</h1>
        <p className="section-body mt-4">{loginContent.intro}</p>
        <form
          className="mt-8 space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            const success = login(email, password);
            if (!success) {
              setError(loginContent.helper);
              return;
            }
            router.push("/pro/dashboard");
          }}
        >
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-full border border-ivoire/20 bg-transparent px-5 py-3 text-sm text-ivoire"
            placeholder={loginContent.email}
            aria-label={loginContent.email}
          />
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            className="w-full rounded-full border border-ivoire/20 bg-transparent px-5 py-3 text-sm text-ivoire"
            placeholder={loginContent.password}
            aria-label={loginContent.password}
          />
          {error && <p className="text-xs text-cuivre">{error}</p>}
          <button
            type="submit"
            className="w-full rounded-full bg-cuivre px-6 py-3 text-xs uppercase tracking-wide text-graphite"
          >
            {loginContent.submit}
          </button>
          <p className="text-xs text-ivoire/60">{loginContent.helper}</p>
        </form>
      </div>
    </div>
  );
};
