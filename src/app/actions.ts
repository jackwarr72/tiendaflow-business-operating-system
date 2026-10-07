"use server";

import {
  products,
  categories,
  customers,
  orders,
  orderItems,
  expenses,
  type NewProduct,
  type NewCategory,
  type NewCustomer,
  type NewOrder,
  type NewOrderItem,
  type NewExpense,
} from "@/db/schema";
import { eq, desc, sql, and, gte, count } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { getDb, getStoreId } from "@/lib/store";
import { requireWriter } from "@/lib/auth";

const UPLOAD_DIR = join(process.cwd(), "public", "uploads", "products");

async function ensureUploadDir() {
  await mkdir(UPLOAD_DIR, { recursive: true });
}

async function saveImage(file: File): Promise<string> {
  await ensureUploadDir();
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = file.name.split(".").pop() || "jpg";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  await writeFile(join(UPLOAD_DIR, filename), buffer);
  return `/uploads/products/${filename}`;
}

async function writableStoreId(): Promise<number> {
  await requireWriter();
  return getStoreId();
}

// ---------- Categories ----------

export async function getCategories() {
  const storeId = await getStoreId();
  const db = await getDb();
  return db
    .select()
    .from(categories)
    .where(eq(categories.storeId, storeId))
    .orderBy(categories.name);
}

export async function createCategory(data: Omit<NewCategory, "storeId">) {
  const storeId = await writableStoreId();
  const db = await getDb();
  const [category] = await db
    .insert(categories)
    .values({ ...data, storeId })
    .returning();
  revalidatePath("/categorias");
  revalidatePath("/productos");
  revalidatePath("/catalogo");
  return category;
}

export async function updateCategory(
  id: number,
  data: Partial<Omit<NewCategory, "storeId">>
) {
  const storeId = await writableStoreId();
  const db = await getDb();
  const [category] = await db
    .update(categories)
    .set(data)
    .where(and(eq(categories.id, id), eq(categories.storeId, storeId)))
    .returning();
  revalidatePath("/categorias");
  revalidatePath("/productos");
  revalidatePath("/catalogo");
  return category;
}

export async function deleteCategory(id: number) {
  const storeId = await writableStoreId();
  const db = await getDb();
  await db
    .delete(categories)
    .where(and(eq(categories.id, id), eq(categories.storeId, storeId)));
  revalidatePath("/categorias");
  revalidatePath("/productos");
  revalidatePath("/catalogo");
}

// ---------- Products ----------

const DEFAULT_PAGE_SIZE = 20;

export type Paged<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export async function getProducts(
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE
): Promise<Paged<{ product: typeof products.$inferSelect; category: typeof categories.$inferSelect | null }>> {
  const storeId = await getStoreId();
  const db = await getDb();
  const safePage = Math.max(1, Math.floor(page));
  const safeSize = Math.min(100, Math.max(1, Math.floor(pageSize)));

  const [totalRow] = await db
    .select({ total: count() })
    .from(products)
    .where(eq(products.storeId, storeId));
  const total = Number(totalRow?.total ?? 0);

  const rows = await db
    .select({ product: products, category: categories })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.storeId, storeId))
    .orderBy(desc(products.createdAt))
    .limit(safeSize)
    .offset((unsafePage(safePage) - 1) * safeSize);

  return {
    data: rows,
    total,
    page: safePage,
    pageSize: safeSize,
    totalPages: Math.max(1, Math.ceil(total / safeSize)),
  };
}

function unsafePage(n: number): number {
  return n;
}

export async function getActiveProducts() {
  const storeId = await getStoreId();
  const db = await getDb();
  return db
    .select({ product: products, category: categories })
    .from(products)
    .where(and(eq(products.isActive, true), eq(products.storeId, storeId)))
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .orderBy(desc(products.createdAt));
}

export async function createProduct(
  data: Omit<NewProduct, "storeId">,
  imageFile?: File | null
) {
  const storeId = await writableStoreId();
  const db = await getDb();
  let imageUrl = data.imageUrl;
  if (imageFile && imageFile.size > 0) {
    imageUrl = await saveImage(imageFile);
  }
  const [product] = await db
    .insert(products)
    .values({ ...data, imageUrl, storeId })
    .returning();
  revalidatePath("/productos");
  revalidatePath("/venta");
  revalidatePath("/catalogo");
  return product;
}

export async function updateProduct(
  id: number,
  data: Partial<Omit<NewProduct, "storeId">>
) {
  const storeId = await writableStoreId();
  const db = await getDb();
  const [product] = await db
    .update(products)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(products.id, id), eq(products.storeId, storeId)))
    .returning();
  revalidatePath("/productos");
  revalidatePath("/venta");
  return product;
}

export async function deleteProduct(id: number) {
  const storeId = await writableStoreId();
  const db = await getDb();
  await db
    .delete(products)
    .where(and(eq(products.id, id), eq(products.storeId, storeId)));
  revalidatePath("/productos");
  revalidatePath("/venta");
}

// ---------- Customers ----------

export async function getCustomers() {
  const storeId = await getStoreId();
  const db = await getDb();
  return db
    .select()
    .from(customers)
    .where(eq(customers.storeId, storeId))
    .orderBy(desc(customers.createdAt));
}

export async function createCustomer(data: Omit<NewCustomer, "storeId">) {
  const storeId = await writableStoreId();
  const db = await getDb();
  const [customer] = await db
    .insert(customers)
    .values({ ...data, storeId })
    .returning();
  revalidatePath("/clientes");
  revalidatePath("/venta");
  return customer;
}

export async function updateCustomer(
  id: number,
  data: Partial<Omit<NewCustomer, "storeId">>
) {
  const storeId = await writableStoreId();
  const db = await getDb();
  const [customer] = await db
    .update(customers)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(customers.id, id), eq(customers.storeId, storeId)))
    .returning();
  revalidatePath("/clientes");
  revalidatePath("/venta");
  return customer;
}

export async function deleteCustomer(id: number) {
  const storeId = await writableStoreId();
  const db = await getDb();
  await db
    .delete(customers)
    .where(and(eq(customers.id, id), eq(customers.storeId, storeId)));
  revalidatePath("/clientes");
  revalidatePath("/venta");
}

// ---------- Orders ----------

export async function getOrders() {
  const storeId = await getStoreId();
  const db = await getDb();
  return db
    .select({ order: orders, customer: customers })
    .from(orders)
    .leftJoin(customers, eq(orders.customerId, customers.id))
    .where(eq(orders.storeId, storeId))
    .orderBy(desc(orders.createdAt));
}

export async function getOrderById(id: number) {
  const storeId = await getStoreId();
  const db = await getDb();
  const [result] = await db
    .select({ order: orders, customer: customers })
    .from(orders)
    .leftJoin(customers, eq(orders.customerId, customers.id))
    .where(and(eq(orders.id, id), eq(orders.storeId, storeId)));

  if (!result) return null;

  const items = await db
    .select({ item: orderItems, product: products })
    .from(orderItems)
    .leftJoin(products, eq(orderItems.productId, products.id))
    .where(and(eq(orderItems.orderId, id), eq(orderItems.storeId, storeId)));

  return { ...result, items };
}

export async function createOrder(
  orderData: Omit<NewOrder, "id" | "createdAt" | "updatedAt" | "total" | "storeId">,
  items: Array<{
    productId: number;
    productName: string;
    quantity: number;
    unitPrice: number;
  }>
) {
  const storeId = await writableStoreId();
  const db = await getDb();

  const total = items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );

  const [order] = await db
    .insert(orders)
    .values({ ...orderData, storeId, total: total.toFixed(2) })
    .returning();

  const orderItemsData: NewOrderItem[] = items.map((item) => ({
    storeId,
    orderId: order.id,
    productId: item.productId,
    productName: item.productName,
    quantity: item.quantity,
    unitPrice: item.unitPrice.toFixed(2),
    subtotal: (item.quantity * item.unitPrice).toFixed(2),
  }));

  await db.insert(orderItems).values(orderItemsData);

  // Update stock
  for (const item of items) {
    await db
      .update(products)
      .set({
        stock: sql`${products.stock} - ${item.quantity}`,
        updatedAt: new Date(),
      })
      .where(and(eq(products.id, item.productId), eq(products.storeId, storeId)));
  }

  revalidatePath("/");
  revalidatePath("/ventas");
  revalidatePath("/productos");
  return order;
}

export async function updateOrderStatus(
  id: number,
  status: NewOrder["status"]
) {
  const storeId = await writableStoreId();
  const db = await getDb();
  const [order] = await db
    .update(orders)
    .set({ status, updatedAt: new Date() })
    .where(and(eq(orders.id, id), eq(orders.storeId, storeId)))
    .returning();
  revalidatePath("/");
  revalidatePath("/ventas");
  return order;
}

export async function updatePaymentStatus(
  id: number,
  paymentStatus: NewOrder["paymentStatus"],
  paidAmount?: number
) {
  const storeId = await writableStoreId();
  const db = await getDb();
  const [order] = await db
    .update(orders)
    .set({
      paymentStatus,
      paidAmount: paidAmount?.toFixed(2),
      updatedAt: new Date(),
    })
    .where(and(eq(orders.id, id), eq(orders.storeId, storeId)))
    .returning();
  revalidatePath("/");
  revalidatePath("/ventas");
  return order;
}

export async function deleteOrder(id: number) {
  const storeId = await writableStoreId();
  const db = await getDb();
  await db
    .delete(orders)
    .where(and(eq(orders.id, id), eq(orders.storeId, storeId)));
  revalidatePath("/");
  revalidatePath("/ventas");
}

// ---------- Expenses ----------

export async function getExpenses() {
  const storeId = await getStoreId();
  const db = await getDb();
  return db
    .select()
    .from(expenses)
    .where(eq(expenses.storeId, storeId))
    .orderBy(desc(expenses.createdAt));
}

export async function createExpense(data: Omit<NewExpense, "storeId">) {
  const storeId = await writableStoreId();
  const db = await getDb();
  const [expense] = await db
    .insert(expenses)
    .values({ ...data, storeId })
    .returning();
  revalidatePath("/");
  revalidatePath("/gastos");
  return expense;
}

export async function deleteExpense(id: number) {
  const storeId = await writableStoreId();
  const db = await getDb();
  await db
    .delete(expenses)
    .where(and(eq(expenses.id, id), eq(expenses.storeId, storeId)));
  revalidatePath("/");
  revalidatePath("/gastos");
}

// ---------- Dashboard ----------

export async function getDashboardStats() {
  const storeId = await getStoreId();
  const db = await getDb();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [salesToday] = await db
    .select({ total: sql<number>`coalesce(sum(${orders.total}), 0)` })
    .from(orders)
    .where(
      and(
        eq(orders.storeId, storeId),
        gte(orders.createdAt, today),
        eq(orders.status, "completed"),
        eq(orders.paymentStatus, "paid")
      )
    );

  const [pendingOrders] = await db
    .select({ count: sql<number>`count(*)` })
    .from(orders)
    .where(and(eq(orders.storeId, storeId), eq(orders.status, "pending")));

  const [completedOrders] = await db
    .select({ count: sql<number>`count(*)` })
    .from(orders)
    .where(and(eq(orders.storeId, storeId), eq(orders.status, "completed")));

  const [lowStock] = await db
    .select({ count: sql<number>`count(*)` })
    .from(products)
    .where(and(eq(products.storeId, storeId), sql`${products.stock} <= 5`));

  const [totalCustomers] = await db
    .select({ count: sql<number>`count(*)` })
    .from(customers)
    .where(eq(customers.storeId, storeId));

  const [todayExpenses] = await db
    .select({ total: sql<number>`coalesce(sum(${expenses.amount}), 0)` })
    .from(expenses)
    .where(and(eq(expenses.storeId, storeId), gte(expenses.createdAt, today)));

  const channelBreakdown = await db
    .select({
      channel: orders.channel,
      total: sql<number>`coalesce(sum(${orders.total}), 0)`,
      count: sql<number>`count(*)`,
    })
    .from(orders)
    .where(eq(orders.storeId, storeId))
    .groupBy(orders.channel);

  const recentOrders = await db
    .select({ order: orders, customer: customers })
    .from(orders)
    .leftJoin(customers, eq(orders.customerId, customers.id))
    .where(eq(orders.storeId, storeId))
    .orderBy(desc(orders.createdAt))
    .limit(5);

  const salesByDay = await db
    .select({
      date: sql<string>`to_char(${orders.createdAt}::date, 'YYYY-MM-DD')`,
      total: sql<number>`coalesce(sum(${orders.total}), 0)`,
    })
    .from(orders)
    .where(and(eq(orders.storeId, storeId), eq(orders.status, "completed")))
    .groupBy(sql`${orders.createdAt}::date`)
    .orderBy(sql`${orders.createdAt}::date`)
    .limit(7);

  return {
    salesToday: Number(salesToday?.total ?? 0),
    pendingOrders: Number(pendingOrders?.count ?? 0),
    completedOrders: Number(completedOrders?.count ?? 0),
    lowStock: Number(lowStock?.count ?? 0),
    totalCustomers: Number(totalCustomers?.count ?? 0),
    todayExpenses: Number(todayExpenses?.total ?? 0),
    channelBreakdown,
    recentOrders,
    salesByDay,
  };
}