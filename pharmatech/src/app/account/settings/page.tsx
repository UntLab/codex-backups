"use client";

import { useState } from "react";
import { Settings, Bell, Shield, Globe } from "lucide-react";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState("az");

  return (
    <div className="space-y-6">
      <div className="glass-tech rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-100">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Tənzimləmələr</h1>
            <p className="text-sm text-slate-400">Hesab parametrləri</p>
          </div>
        </div>

        <div className="space-y-6">
          <SettingRow
            icon={<Bell className="w-4 h-4" />}
            label="Bildirişlər"
            description="Sifariş yeniləmələri haqqında bildirişlər"
          >
            <button
              onClick={() => setNotifications(!notifications)}
              className={`w-12 h-7 rounded-full transition-colors relative ${
                notifications ? "bg-cyan-500" : "bg-slate-300"
              }`}
            >
              <span
                className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                  notifications ? "left-5.5" : "left-0.5"
                }`}
              />
            </button>
          </SettingRow>

          <SettingRow
            icon={<Globe className="w-4 h-4" />}
            label="Dil"
            description="İnterfeys dili"
          >
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="az">Azərbaycan</option>
              <option value="ru">Русский</option>
              <option value="en">English</option>
            </select>
          </SettingRow>

          <SettingRow
            icon={<Shield className="w-4 h-4" />}
            label="Məxfilik"
            description="Məlumatlarınız AES-256 ilə şifrələnir"
          >
            <span className="text-xs font-semibold text-green-600 bg-green-50 px-3 py-1.5 rounded-full">
              Qorunur
            </span>
          </SettingRow>
        </div>
      </div>
    </div>
  );
}

function SettingRow({
  icon,
  label,
  description,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-slate-100 last:border-0">
      <div className="flex items-center gap-3">
        <span className="text-slate-400">{icon}</span>
        <div>
          <p className="text-sm font-medium text-slate-700">{label}</p>
          <p className="text-xs text-slate-400">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}
