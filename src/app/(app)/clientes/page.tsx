import { getCustomers } from "@/app/actions";
import { CustomerForm } from "@/components/customer-form";
import { Users } from "lucide-react";

const channelLabels: Record<string, string> = {
  whatsapp: "WhatsApp",
  instagram: "Instagram",
  tiktok: "TikTok",
  facebook_marketplace: "Facebook",
  in_person: "Presencial",
  other: "Otro",
};

export const dynamic = "force-dynamic";

export default async function CustomersPage() {
  const customers = await getCustomers();

  return (
    <div className="space-y-4 p-4">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Clientes</h1>
        <p className="text-sm text-slate-500">
          {customers.length} clientes registrados
        </p>
      </header>

      <CustomerForm />

      {customers.length === 0 ? (
        <div className="rounded-2xl bg-slate-50 p-8 text-center">
          <Users className="mx-auto h-12 w-12 text-slate-300" />
          <p className="mt-3 text-sm font-medium text-slate-600">
            No tienes clientes aún
          </p>
          <p className="text-xs text-slate-400">
            Agrega tu primer cliente arriba
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {customers.map((customer) => (
            <div
              key={customer.id}
              className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    {customer.name}
                  </h3>
                  <p className="text-xs text-primary-600">
                    {channelLabels[customer.preferredChannel ?? "whatsapp"]}
                  </p>
                </div>
                {customer.phone && (
                  <a
                    href={`https://wa.me/${customer.phone.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white"
                  >
                    WhatsApp
                  </a>
                )}
              </div>
              <div className="mt-2 space-y-0.5 text-xs text-slate-500">
                {customer.phone && <p>Tel: {customer.phone}</p>}
                {customer.email && <p>Email: {customer.email}</p>}
                {customer.socialHandle && (
                  <p>@{customer.socialHandle}</p>
                )}
              </div>
              {customer.notes && (
                <p className="mt-2 text-xs text-slate-400">{customer.notes}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
