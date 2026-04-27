"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { KeyRound, Loader2 } from "lucide-react";
import AuthShell from "../AuthShell";
import styles from "../auth.module.css";

export default function ResetPasswordForm({ token }: { token?: string }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const canSubmit = useMemo(
    () =>
      isTokenValid &&
      password.length >= 6 &&
      confirmPassword.length >= 6 &&
      password === confirmPassword,
    [confirmPassword, isTokenValid, password]
  );

  useEffect(() => {
    let cancelled = false;

    async function validateToken() {
      if (!token) {
        setIsTokenValid(false);
        setChecking(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/auth/reset-password?token=${encodeURIComponent(token)}`,
          { cache: "no-store" }
        );
        const data = await response.json();

        if (!cancelled) {
          setIsTokenValid(Boolean(data.valid));
          setChecking(false);
        }
      } catch {
        if (!cancelled) {
          setIsTokenValid(false);
          setChecking(false);
        }
      }
    }

    void validateToken();

    return () => {
      cancelled = true;
    };
  }, [token]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!token) {
      setError("This reset link is missing or invalid.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to reset password right now.");
        setLoading(false);
        return;
      }

      setSuccessMessage(data.message || "Password updated successfully.");
      setLoading(false);
      setPassword("");
      setConfirmPassword("");
      setIsTokenValid(false);
    } catch {
      setError("Unable to reset password right now.");
      setLoading(false);
    }
  }

  const footer = successMessage ? (
    <div className={styles.footer}>
      Password updated.{" "}
      <Link href="/login" className={styles.footerLink}>
        Sign in now
      </Link>
    </div>
  ) : (
    <div className={styles.footer}>
      Need a fresh link?{" "}
      <Link href="/forgot-password" className={styles.footerLink}>
        Request another reset email
      </Link>
    </div>
  );

  return (
    <AuthShell
      panelEyebrow="SECURE RESET"
      panelTitle="Set a new password"
      panelDescription="Use the secure link from your email to create a new password for your CardSaaS workspace."
      secondaryHref="/login"
      secondaryLabel="Sign in"
      footer={footer}
    >
      {checking ? (
        <div className={styles.loadingBlock}>
          <Loader2 className={styles.loadingIcon} />
          <p className={styles.helperText}>Validating your reset link...</p>
        </div>
      ) : !token || !isTokenValid ? (
        <div className={styles.form}>
          <div className={styles.error}>This reset link is invalid or expired.</div>
          <Link href="/forgot-password" className={styles.submit}>
            Request a new reset link
          </Link>
        </div>
      ) : successMessage ? (
        <div className={styles.form}>
          <div className={styles.success}>{successMessage}</div>
          <Link href="/login" className={styles.submit}>
            Continue to sign in
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={styles.form}>
          {error ? <div className={styles.error}>{error}</div> : null}

          <div className={styles.field}>
            <label className={styles.label}>New password</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={6}
              className={styles.input}
              placeholder="Minimum 6 characters"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Confirm password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
              minLength={6}
              className={styles.input}
              placeholder="Repeat the new password"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !canSubmit}
            className={styles.submit}
          >
            {loading ? (
              <Loader2 className={styles.submitIcon} />
            ) : (
              <KeyRound className={styles.submitIcon} />
            )}
            {loading ? "Updating..." : "Update password"}
          </button>

          <div className={styles.helperText}>
            Use at least 6 characters. Once saved, this reset link will stop
            working.
          </div>
        </form>
      )}
    </AuthShell>
  );
}
