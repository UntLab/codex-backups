"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { UserPlus, Loader2 } from "lucide-react";
import AuthShell from "../AuthShell";
import styles from "../auth.module.css";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email: normalizedEmail, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      const result = await signIn("credentials", {
        email: normalizedEmail,
        password,
        redirect: false,
        callbackUrl: "/dashboard",
      });

      if (result?.error) {
        setError("Automatic sign-in failed after registration");
        setLoading(false);
      } else {
        window.location.assign(result?.url || "/dashboard");
      }
    } catch {
      setError("Network error");
      setLoading(false);
    }
  };

  return (
    <AuthShell
      panelEyebrow="GET STARTED"
      panelTitle="Create your workspace"
      panelDescription="Open your private command center for digital cards, premium themes, lead capture, and future automation."
      secondaryHref="/login"
      secondaryLabel="Sign in"
      footer={
        <div className={styles.footer}>
          Already have an account?{" "}
          <Link href="/login" className={styles.footerLink}>
            Sign In
          </Link>
        </div>
      }
    >
        <form onSubmit={handleSubmit} className={styles.form}>
          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

          <div className={styles.field}>
            <label className={styles.label}>
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.input}
              placeholder="Your name or team"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>
              Email *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.input}
              placeholder="name@company.com"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>
              Password *
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className={styles.input}
              placeholder="Minimum 6 characters"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={styles.submit}
          >
            {loading ? (
              <Loader2 className={styles.submitIcon} />
            ) : (
              <UserPlus className={styles.submitIcon} />
            )}
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>
    </AuthShell>
  );
}
