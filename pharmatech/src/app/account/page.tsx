import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Shield, Phone, Mail, MapPin } from "lucide-react";
import { maskPhone, maskEmail } from "@/lib/security";

export default async function AccountPage() {
  const supabase = await createClient();
  if (!supabase) redirect("/auth/login");
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const meta = user.user_metadata || {};

  return (
    <div className="space-y-6">
      <div className="glass-tech rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-cyan-50 rounded-xl flex items-center justify-center text-cyan-600 border border-cyan-100">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Şəxsi Məlumatlar</h1>
            <p className="text-sm text-slate-400">
              Məlumatlarınız şifrələnmiş formada saxlanılır
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoCard
            icon={<Mail className="w-4 h-4" />}
            label="Email"
            value={user.email ? maskEmail(user.email) : "—"}
          />
          <InfoCard
            icon={<Phone className="w-4 h-4" />}
            label="Telefon"
            value={meta.phone ? maskPhone(meta.phone) : "Əlavə edilməyib"}
          />
          <InfoCard
            icon={<MapPin className="w-4 h-4" />}
            label="Ünvan"
            value={meta.address || "Əlavə edilməyib"}
          />
          <InfoCard
            icon={<Shield className="w-4 h-4" />}
            label="Hesab yaradılıb"
            value={new Date(user.created_at).toLocaleDateString("az-AZ")}
          />
        </div>
      </div>

      <div className="glass-tech rounded-2xl p-8">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Kanallar</h2>
        <p className="text-sm text-slate-500 mb-4">
          PharmaTech ilə əlaqə saxlaya biləcəyiniz kanallar:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <ChannelBadge name="Web Chat" status="active" />
          <ChannelBadge name="Telegram Bot" status="active" />
          <ChannelBadge name="WhatsApp" status="active" />
        </div>
      </div>
    </div>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-slate-50 rounded-xl p-4">
      <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1">
        {icon}
        {label}
      </div>
      <p className="text-slate-700 font-medium">{value}</p>
    </div>
  );
}

function ChannelBadge({
  name,
  status,
}: {
  name: string;
  status: "active" | "coming";
}) {
  return (
    <div className="bg-slate-50 rounded-xl p-4 flex items-center gap-3">
      <span
        className={`w-2 h-2 rounded-full ${
          status === "active" ? "bg-green-400" : "bg-amber-400"
        }`}
      />
      <span className="text-sm font-medium text-slate-700">{name}</span>
      {status === "coming" && (
        <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full ml-auto">
          Tezliklə
        </span>
      )}
    </div>
  );
}
