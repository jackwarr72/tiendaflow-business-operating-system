import { getOrders } from "@/app/actions";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";

const channelLabels: Record<string, string> = {
  whatsapp: "WhatsApp",
  instagram: "Instagram",
  tiktok: "TikTok",
  facebook_marketplace: "Facebook",
  in_person: "Presencial",
  other: "Otro",
};

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <div className="space-y-4 p-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Ventas</h1>
          <p className="text-sm text-slate-500">
            {orders.length} ventas registradas
          </p>
        </div>
        <Link
          href="/venta"
          className="rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary-600/25"
        >
          + Nueva
        </Link>
      </header>

      {orders.length === 0 ? (
        <div className="rounded-2xl bg-slate-50 p-8 text-center">
          <ShoppingBag className="mx-auto h-12 w-12 text-slate-300" />
          <p className="mt-3 text-sm font-medium text-slate-600">
            No hay ventas registradas
          </p>
          <Link
            href="/venta"
            className="mt-2 inline-block text-sm font-semibold text-primary-600"
          >
            Registrar primera venta
          </Link>
        </div>
      ) : (
        <div className="grid gap-3">
          {orders.map(({ order, customer }) => (
            <div
              key={order.id}
              className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {customer?.name ?? "Cliente ocasional"}
                  </p>
                  <p className="text-xs text-slate-500">
                    {channelLabels[order.channel]} ·{" "}
                    {new Date(order.createdAt).toLocaleDateString("es-MX", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <span className="text-base font-bold text-slate-900">
                  ${Number(order.total).toLocaleString("es-MX")}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <StatusBadge status={order.status} />
                <PaymentBadge status={order.paymentStatus} />
              </div>

              {order.notes && (
                <p className="mt-2 text-xs text-slate-500">{order.notes}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
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
      className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}

function PaymentBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-rose-100 text-rose-700",
    paid: "bg-green-100 text-green-700",
    partial: "bg-amber-100 text-amber-700",
  };
  const labels: Record<string, string> = {
    pending: "Por cobrar",
    paid: "Pagado",
    partial: "Abono",
  };
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}
