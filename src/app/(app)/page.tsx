import { getDashboardStats } from "@/app/actions";
import {
  DollarSign,
  Package,
  ShoppingBag,
  Users,
  Clock,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

const channelLabels: Record<string, string> = {
  whatsapp: "WhatsApp",
  instagram: "Instagram",
  tiktok: "TikTok",
  facebook_marketplace: "Facebook",
  in_person: "Presencial",
  other: "Otro",
};

const channelColors: Record<string, string> = {
  whatsapp: "bg-green-500",
  instagram: "bg-pink-500",
  tiktok: "bg-slate-900",
  facebook_marketplace: "bg-blue-600",
  in_person: "bg-amber-500",
  other: "bg-slate-400",
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">TiendaFlow</h1>
          <p className="text-sm text-slate-500">Hola, buen día ☀️</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/catalogo"
            className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-primary-600 shadow-sm ring-1 ring-slate-200"
          >
            Catálogo
          </Link>
          <Link
            href="/venta"
            className="flex items-center gap-2 rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary-600/25 active:scale-95 transition-transform"
          >
            <ShoppingBag className="h-4 w-4" />
            Nueva venta
          </Link>
        </div>
      </header>

      {/* Main stat */}
      <section className="rounded-3xl bg-linear-to-br from-primary-600 to-primary-700 p-6 text-white shadow-xl shadow-primary-600/20">
        <p className="text-primary-100 text-sm font-medium">Ventas de hoy</p>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-4xl font-bold">
            ${stats.salesToday.toLocaleString("es-MX")}
          </span>
          <span className="text-primary-200 text-sm">MXN</span>
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs text-primary-100">
          <TrendingUp className="h-3.5 w-3.5" />
          <span>Ganancia neta: ${(stats.salesToday - stats.todayExpenses).toLocaleString("es-MX")}</span>
        </div>
      </section>

      {/* Quick stats grid */}
      <section className="grid grid-cols-2 gap-3">
        <StatCard
          icon={Clock}
          label="Pendientes"
          value={stats.pendingOrders}
          href="/ventas"
          color="bg-amber-100 text-amber-700"
        />
        <StatCard
          icon={ShoppingBag}
          label="Completadas"
          value={stats.completedOrders}
          href="/ventas"
          color="bg-green-100 text-green-700"
        />
        <StatCard
          icon={Package}
          label="Stock bajo"
          value={stats.lowStock}
          href="/productos"
          color="bg-rose-100 text-rose-700"
        />
        <StatCard
          icon={Users}
          label="Clientes"
          value={stats.totalCustomers}
          href="/clientes"
          color="bg-blue-100 text-blue-700"
        />
      </section>

      {/* Channel breakdown */}
      <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
        <h2 className="mb-4 text-base font-semibold text-slate-900">
          Ventas por canal
        </h2>
        {stats.channelBreakdown.length === 0 ? (
          <p className="text-sm text-slate-500">Aún no hay ventas registradas.</p>
        ) : (
          <div className="space-y-3">
            {stats.channelBreakdown.map((row) => (
              <div key={row.channel} className="flex items-center gap-3">
                <div
                  className={`h-8 w-8 rounded-full ${
                    channelColors[row.channel ?? "other"]
                  } flex items-center justify-center text-white`}
                >
                  <span className="text-xs font-bold">
                    {channelLabels[row.channel ?? "other"].slice(0, 2)}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-slate-700">
                      {channelLabels[row.channel ?? "other"]}
                    </span>
                    <span className="font-semibold text-slate-900">
                      ${Number(row.total).toLocaleString("es-MX")}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{row.count} ventas</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recent orders */}
      <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">
            Últimas ventas
          </h2>
          <Link
            href="/ventas"
            className="text-sm font-medium text-primary-600"
          >
            Ver todas
          </Link>
        </div>
        {stats.recentOrders.length === 0 ? (
          <p className="text-sm text-slate-500">No hay ventas recientes.</p>
        ) : (
          <div className="space-y-3">
            {stats.recentOrders.map(({ order, customer }) => (
              <div
                key={order.id}
                className="flex items-center justify-between rounded-xl bg-slate-50 p-3"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {customer?.name ?? "Cliente ocasional"}
                  </p>
                  <p className="text-xs text-slate-500">
                    {channelLabels[order.channel]}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900">
                    ${Number(order.total).toLocaleString("es-MX")}
                  </p>
                  <StatusBadge status={order.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Alerts */}
      {stats.lowStock > 0 && (
        <section className="flex items-start gap-3 rounded-2xl bg-rose-50 p-4 text-rose-800">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <div>
            <p className="text-sm font-semibold">Stock bajo</p>
            <p className="text-xs text-rose-700">
              Tienes {stats.lowStock} productos con stock crítico. Revisa tu inventario.
            </p>
            <Link
              href="/productos"
              className="mt-2 inline-block text-xs font-semibold underline"
            >
              Ver productos
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  href,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  href: string;
  color: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 active:scale-95 transition-transform"
    >
      <div className={`rounded-xl p-2.5 ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-xl font-bold text-slate-900">{value}</p>
      </div>
    </Link>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700",
    processing: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-slate-100 text-slate-600",
  };
  const labels: Record<string, string> = {
    pending: "Pendiente",
    processing: "En proceso",
    completed: "Completada",
    cancelled: "Cancelada",
  };
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}
