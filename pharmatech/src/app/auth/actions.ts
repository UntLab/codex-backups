"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function signIn(formData: FormData) {
  const supabase = await createClient();
  if (!supabase) return { error: "Supabase konfiqurasiya edilməyib." };

  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email və şifrə tələb olunur." };
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Email və ya şifrə yanlışdır." };
  }

  const redirectTo = formData.get("redirect") as string;
  redirect(redirectTo || "/account");
}

export async function signUp(formData: FormData) {
  const supabase = await createClient();
  if (!supabase) return { error: "Supabase konfiqurasiya edilməyib." };

  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;
  const fullName = (formData.get("full_name") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim();

  if (!email || !password) {
    return { error: "Email və şifrə tələb olunur." };
  }

  if (password.length < 8) {
    return { error: "Şifrə minimum 8 simvol olmalıdır." };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName || "",
        phone: phone || "",
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || ""}/auth/callback`,
    },
  });

  if (error) {
    if (error.message.includes("already registered") || error.message.includes("already exists")) {
      return { error: "Bu email artıq qeydiyyatdan keçib." };
    }
    if (error.message.includes("Invalid email")) {
      return { error: "Düzgün email ünvanı daxil edin." };
    }
    if (error.message.includes("password")) {
      return { error: "Şifrə tələblərə uyğun deyil (minimum 8 simvol)." };
    }
    return { error: `Qeydiyyat xətası: ${error.message}` };
  }

  if (data?.user && !data.user.confirmed_at && data.user.identities?.length === 0) {
    return { error: "Bu email artıq qeydiyyatdan keçib." };
  }

  redirect("/account");
}

export async function signOut() {
  const supabase = await createClient();
  if (supabase) await supabase.auth.signOut();
  redirect("/");
}
