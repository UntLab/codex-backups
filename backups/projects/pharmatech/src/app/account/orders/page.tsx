import { Package, Clock, CheckCircle, Truck, XCircle } from "lucide-react";

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; icon: React.ReactNode }
> = {
  pending: {
    label: "Gözləyir",
    color: "text-amber-600 bg-amber-50",
    icon: <Clock className="w-4 h-4" />,
  },
  confirmed: {
    label: "Təsdiqləndi",
    color: "text-blue-600 bg-blue-50",
    icon: <CheckCircle className="w-4 h-4" />,
  },
  delivering: {
    label: "Çatdırılır",
    color: "text-cyan-600 bg-cyan-50",
    icon: <Truck className="w-4 h-4" />,
  },
  delivered: {
    label: "Çatdırıldı",
    color: "text-green-600 bg-green-50",
    icon: <CheckCircle className="w-4 h-4" />,
  },
  cancelled: {
    label: "Ləğv edildi",
    color: "text-red-600 bg-red-50",
    icon: <XCircle className="w-4 h-4" />,
  },
};

export default function OrdersPage() {
  // TODO: fetch orders from Supabase
  const orders: {
    id: string;
    status: string;
    total: number;
    created_at: string;
    items_count: number;
  }[] = [];

  return (
    <div className="glass-tech rounded-2xl p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 border border-blue-100">
          <Package className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800">Sifarişlərim</h1>
          <p className="text-sm text-slate-400">Sifariş tarixçəniz</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <Package className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <p className="text-slate-400 text-lg font-medium">Hələ sifarişiniz yoxdur</p>
          <p className="text-slate-300 text-sm mt-1">
            Kataloqdan dərman axtarın və sifariş verin
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
            return (
              <div
                key={order.id}
                className="bg-slate-50 rounded-xl p-5 flex items-center justify-between"
              >
                <div>
                  <p className="font-bold text-slate-800 text-sm">
                    #{order.id.slice(0, 8)}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {new Date(order.created_at).toLocaleDateString("az-AZ")} &middot;{" "}
                    {order.items_count} məhsul
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-slate-800">
                    {order.total.toFixed(2)} &#8380;
                  </span>
                  <span
                    className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${status.color}`}
                  >
                    {status.icon}
                    {status.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
