"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, Mail } from "lucide-react";
import AuthShell from "../AuthShell";
import styles from "../auth.module.css";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to send a reset email right now.");
        setLoading(false);
        return;
      }

      setSuccessMessage(
        data.message ||
          "If this email exists, we sent a password reset link to the inbox."
      );
      setLoading(false);
    } catch {
      setError("Unable to send a reset email right now.");
      setLoading(false);
    }
  }

  return (
    <AuthShell
      panelEyebrow="RECOVERY FLOW"
      panelTitle="Reset your password"
      panelDescription="Enter your account email and we will send a secure reset link from the CardSaaS sender already connected to this project."
      secondaryHref="/login"
      secondaryLabel="Sign in"
      footer={
        <div className={styles.footer}>
          Remembered it?{" "}
          <Link href="/login" className={styles.footerLink}>
            Back to sign in
          </Link>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        {error ? <div className={styles.error}>{error}</div> : null}
        {successMessage ? (
          <div className={styles.success}>{successMessage}</div>
        ) : null}

        <div className={styles.field}>
          <label className={styles.label}>Email address</label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className={styles.input}
            placeholder="name@company.com"
          />
        </div>

        <button
          type="submit"
          disabled={loading || email.trim().length === 0}
          className={styles.submit}
        >
          {loading ? (
            <Loader2 className={styles.submitIcon} />
          ) : (
            <Mail className={styles.submitIcon} />
          )}
          {loading ? "Sending..." : "Send reset link"}
        </button>

        <div className={styles.helperText}>
          We always show the same response message for security, even if the
          email is not registered.
        </div>
      </form>
    </AuthShell>
  );
}
