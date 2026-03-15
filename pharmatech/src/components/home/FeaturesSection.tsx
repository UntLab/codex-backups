"use client";

import { useState, useEffect } from "react";
import {
  BrainCircuit,
  Zap,
  ShieldCheck,
  MessageCircle,
} from "lucide-react";

const WHATSAPP_NUMBER = "994504271773";
const DOCTOR_SCHEDULE = { startHour: 9, endHour: 21 };

function useDoctorStatus() {
  const [isOnline, setIsOnline] = useState(false);
  useEffect(() => {
    function check() {
      const now = new Date();
      const hour = now.getUTCHours() + 4;
      setIsOnline(hour >= DOCTOR_SCHEDULE.startHour && hour < DOCTOR_SCHEDULE.endHour);
    }
    check();
    const interval = setInterval(check, 60_000);
    return () => clearInterval(interval);
  }, []);
  return isOnline;
}

export function FeaturesSection() {
  const isDoctorOnline = useDoctorStatus();

  return (
    <section id="features" className="max-w-6xl mx-auto px-4 mt-32 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="card-tech p-8 col-span-1 md:col-span-2 group hover:border-cyan-200">
        <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 transition" />
        <div className="flex items-start justify-between">
          <div>
            <div className="w-12 h-12 bg-cyan-50 rounded-xl flex items-center justify-center text-cyan-600 mb-6 border border-cyan-100">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-slate-800">
              AI Əczaçı
            </h3>
            <p className="text-slate-500">
              Simptomlarınızı analiz edir və ən uyğun dərmanları təklif edir.
            </p>
          </div>
          <div className="hidden md:flex gap-1 items-end h-16">
            <div className="w-1 bg-cyan-200 h-8 animate-pulse" />
            <div
              className="w-1 bg-cyan-300 h-12 animate-pulse"
              style={{ animationDelay: "0.3s" }}
            />
            <div
              className="w-1 bg-cyan-400 h-6 animate-pulse"
              style={{ animationDelay: "0.6s" }}
            />
            <div
              className="w-1 bg-cyan-300 h-10 animate-pulse"
              style={{ animationDelay: "0.9s" }}
            />
          </div>
        </div>
      </div>

      <div className="card-tech p-8 hover:border-blue-200">
        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6 border border-blue-100">
          <Zap className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold mb-2 text-slate-800">
          Turbo Çatdırılma
        </h3>
        <p className="text-slate-500 text-sm">
          15 dəqiqə ərzində qapıya çatdırılma.
        </p>
      </div>

      <div className="card-tech p-8 hover:border-emerald-200">
        <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-6 border border-emerald-100">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold mb-2 text-slate-800">
          100% Orijinal
        </h3>
        <p className="text-slate-500 text-sm">
          Tam sertifikatlaşdırılmış məhsullar.
        </p>
      </div>

      <div
        id="delivery"
        className="p-8 rounded-3xl col-span-1 md:col-span-2 bg-gradient-to-br from-blue-600 to-cyan-600 text-white relative overflow-hidden group"
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4 backdrop-blur-sm ${isDoctorOnline ? "bg-white/10" : "bg-black/20"}`}>
              <span className={`w-2 h-2 rounded-full ${isDoctorOnline ? "bg-green-400 animate-pulse" : "bg-gray-400"}`} />
              {isDoctorOnline ? "Həkim İndi Onlayndır" : "Həkim Oflayndır (09:00 - 21:00)"}
            </div>
            <h3 className="text-2xl font-bold mb-2">Peşəkar Məsləhət</h3>
            <p className="text-blue-50 mb-6 text-sm opacity-90">
              20 illik təcrübəyə malik mütəxəssis suallarınızı cavablandırır.
            </p>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Salam! Həkim məsləhəti istəyirəm.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-cyan-50 transition shadow-lg inline-flex items-center gap-2"
            >
              WhatsApp-a Yazın
              <MessageCircle className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
