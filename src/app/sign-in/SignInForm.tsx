"use client";

import { useMemo, useState } from "react";

import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

type SignInFormProps = {
  next: string;
  theme?: "default" | "cardiobunny";
};

export function SignInForm({ next, theme = "default" }: SignInFormProps) {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  const formClassName = theme === "cardiobunny" ? "cb-entry-form" : "intake-form";
  const fieldClassName = theme === "cardiobunny" ? "cb-field" : "field";
  const buttonClassName =
    theme === "cardiobunny" ? "cb-submit button-reset" : "primary-cta button-reset";
  const buttonLabel = state === "sending" ? "Sending link..." : "Send me my magic link";
  const messageClassName =
    state === "error"
      ? theme === "cardiobunny"
        ? "error-banner cb-error-banner"
        : "error-banner"
      : theme === "cardiobunny"
        ? "success-banner cb-success-banner"
        : "success-banner";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase) {
      setState("error");
      setMessage("Supabase keys are missing, so sign-in cannot start yet.");
      return;
    }

    setState("sending");
    setMessage("");

    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo,
      },
    });

    if (error) {
      setState("error");
      setMessage(error.message);
      return;
    }

    setState("sent");
    setMessage("Magic link sent. Open the email on this device, then come back here.");
  }

  return (
    <form className={formClassName} onSubmit={handleSubmit}>
      <label className={fieldClassName}>
        <span>Email</span>
        <input
          name="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          required
        />
      </label>

      <div className="cta-row">
        <button className={buttonClassName} disabled={state === "sending"} type="submit">
          {theme === "cardiobunny" && state !== "sending" ? <span aria-hidden="true">[]</span> : null}
          <span>{buttonLabel}</span>
        </button>
      </div>

      {message ? <p className={messageClassName}>{message}</p> : null}
    </form>
  );
}
