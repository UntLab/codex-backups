import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { User, Package, Settings, LogOut } from "lucide-react";
import { signOut } from "@/app/auth/actions";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  if (!supabase) redirect("/auth/login");
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const navItems = [
    { href: "/account", label: "Profil", icon: User },
    { href: "/account/orders", label: "Sifarişlər", icon: Package },
    { href: "/account/settings", label: "Tənzimləmələr", icon: Settings },
  ];

  return (
    <div className="min-h-screen pt-28 pb-16 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
        <aside className="w-full md:w-64 shrink-0">
          <div className="glass-tech rounded-2xl p-6 sticky top-28">
            <div className="mb-6">
              <p className="font-bold text-slate-800 text-lg">
                {user.user_metadata?.full_name || "İstifadəçi"}
              </p>
              <p className="text-xs text-slate-400 truncate">{user.email}</p>
            </div>

            <nav className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-cyan-50 hover:text-cyan-700 transition"
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-6 pt-6 border-t border-slate-100">
              <form action={signOut}>
                <button
                  type="submit"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition w-full"
                >
                  <LogOut className="w-4 h-4" />
                  Çıxış
                </button>
              </form>
            </div>
          </div>
        </aside>

        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
