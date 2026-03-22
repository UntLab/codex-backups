"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CreditCard, LogIn, Loader2 } from "lucide-react";
import styles from "./login.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.orbLeft} />
      <div className={styles.orbRight} />

      <div className={styles.header}>
        <Link href="/" className={styles.brand}>
          <div className={styles.brandIcon}>
            <CreditCard className={styles.brandIconSvg} />
          </div>
          <span className={styles.brandText}>
            v.<span className={styles.brandAccent}>2ai</span>
          </span>
        </Link>
        <h1 className={styles.title}>Sign In</h1>
        <p className={styles.subtitle}>
          Enter your credentials to access your account
        </p>
      </div>

      <div className={styles.cardWrap}>
        <div className={styles.cardGlow} />
        <div className={styles.card}>
          <form onSubmit={handleSubmit} className={styles.form}>
            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.field}>
              <label className={styles.label}>Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className={styles.input}
              />
            </div>

            <button type="submit" disabled={loading} className={styles.submit}>
              {loading ? (
                <Loader2 className={styles.submitIcon} />
              ) : (
                <LogIn className={styles.submitIcon} />
              )}
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className={styles.footer}>
            No account yet?{" "}
            <Link href="/register" className={styles.footerLink}>
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
