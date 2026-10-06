import { getExpenses } from "@/app/actions";
import { ExpenseForm } from "@/components/expense-form";
import { DollarSign } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ExpensesPage() {
  const expenses = await getExpenses();
  const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  return (
    <div className="space-y-4 p-4">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Gastos</h1>
        <p className="text-sm text-slate-500">
          Total: ${total.toLocaleString("es-MX")}
        </p>
      </header>

      <ExpenseForm />

      {expenses.length === 0 ? (
        <div className="rounded-2xl bg-slate-50 p-8 text-center">
          <DollarSign className="mx-auto h-12 w-12 text-slate-300" />
          <p className="mt-3 text-sm font-medium text-slate-600">
            No hay gastos registrados
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {expenses.map((expense) => (
            <div
              key={expense.id}
              className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100"
            >
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  {expense.description}
                </h3>
                <p className="text-xs text-slate-500">
                  {expense.category ?? "Sin categoría"} ·{" "}
                  {new Date(expense.createdAt).toLocaleDateString("es-MX", {
                    day: "numeric",
                    month: "short",
                  })}
                </p>
              </div>
              <span className="text-sm font-bold text-rose-600">
                -${Number(expense.amount).toLocaleString("es-MX")}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
