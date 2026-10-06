"use server";

import { db } from "@/db";
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
import { eq, desc, sql, and, gte, lte } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

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
  const filepath = join(UPLOAD_DIR, filename);
  await writeFile(filepath, buffer);
  return `/uploads/products/${filename}`;
}

// ---------- Categories ----------

export async function getCategories() {
  return db.select().from(categories).orderBy(categories.name);
}

export async function createCategory(data: NewCategory) {
  const [category] = await db.insert(categories).values(data).returning();
  revalidatePath("/categorias");
  revalidatePath("/productos");
  revalidatePath("/catalogo");
  return category;
}

export async function updateCategory(id: number, data: Partial<NewCategory>) {
  const [category] = await db
    .update(categories)
    .set(data)
    .where(eq(categories.id, id))
    .returning();
  revalidatePath("/categorias");
  revalidatePath("/productos");
  revalidatePath("/catalogo");
  return category;
}

export async function deleteCategory(id: number) {
  await db.delete(categories).where(eq(categories.id, id));
  revalidatePath("/categorias");
  revalidatePath("/productos");
  revalidatePath("/catalogo");
}

// ---------- Products ----------

export async function getProducts() {
  return db
    .select({
      product: products,
      category: categories,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .orderBy(desc(products.createdAt));
}

export async function getActiveProducts() {
  return db
    .select({
      product: products,
      category: categories,
    })
    .from(products)
    .where(eq(products.isActive, true))
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .orderBy(desc(products.createdAt));
}

export async function createProduct(data: NewProduct, imageFile?: File | null) {
  let imageUrl = data.imageUrl;
  if (imageFile && imageFile.size > 0) {
    imageUrl = await saveImage(imageFile);
  }
  const [product] = await db
    .insert(products)
    .values({ ...data, imageUrl })
    .returning();
  revalidatePath("/productos");
  revalidatePath("/venta");
  revalidatePath("/catalogo");
  return product;
}

export async function updateProduct(id: number, data: Partial<NewProduct>) {
  const [product] = await db
    .update(products)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(products.id, id))
    .returning();
  revalidatePath("/productos");
  revalidatePath("/venta");
  return product;
}

export async function deleteProduct(id: number) {
  await db.delete(products).where(eq(products.id, id));
  revalidatePath("/productos");
  revalidatePath("/venta");
}

// ---------- Customers ----------

export async function getCustomers() {
  return db.select().from(customers).orderBy(desc(customers.createdAt));
}

export async function createCustomer(data: NewCustomer) {
  const [customer] = await db.insert(customers).values(data).returning();
  revalidatePath("/clientes");
  revalidatePath("/venta");
  return customer;
}

export async function updateCustomer(id: number, data: Partial<NewCustomer>) {
  const [customer] = await db
    .update(customers)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(customers.id, id))
    .returning();
  revalidatePath("/clientes");
  revalidatePath("/venta");
  return customer;
}

export async function deleteCustomer(id: number) {
  await db.delete(customers).where(eq(customers.id, id));
  revalidatePath("/clientes");
  revalidatePath("/venta");
}

// ---------- Orders ----------

export async function getOrders() {
  return db
    .select({
      order: orders,
      customer: customers,
    })
    .from(orders)
    .leftJoin(customers, eq(orders.customerId, customers.id))
    .orderBy(desc(orders.createdAt));
}

export async function getOrderById(id: number) {
  const [result] = await db
    .select({
      order: orders,
      customer: customers,
    })
    .from(orders)
    .leftJoin(customers, eq(orders.customerId, customers.id))
    .where(eq(orders.id, id));

  if (!result) return null;

  const items = await db
    .select({
      item: orderItems,
      product: products,
    })
    .from(orderItems)
    .leftJoin(products, eq(orderItems.productId, products.id))
    .where(eq(orderItems.orderId, id));

  return { ...result, items };
}

export async function createOrder(
  orderData: Omit<NewOrder, "id" | "createdAt" | "updatedAt" | "total">,
  items: Array<{
    productId: number;
    productName: string;
    quantity: number;
    unitPrice: number;
  }>
) {
  const total = items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );

  const [order] = await db
    .insert(orders)
    .values({ ...orderData, total: total.toFixed(2) })
    .returning();

  const orderItemsData: NewOrderItem[] = items.map((item) => ({
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
      .where(eq(products.id, item.productId));
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
  const [order] = await db
    .update(orders)
    .set({ status, updatedAt: new Date() })
    .where(eq(orders.id, id))
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
  const [order] = await db
    .update(orders)
    .set({
      paymentStatus,
      paidAmount: paidAmount?.toFixed(2),
      updatedAt: new Date(),
    })
    .where(eq(orders.id, id))
    .returning();
  revalidatePath("/");
  revalidatePath("/ventas");
  return order;
}

export async function deleteOrder(id: number) {
  await db.delete(orders).where(eq(orders.id, id));
  revalidatePath("/");
  revalidatePath("/ventas");
}

// ---------- Expenses ----------

export async function getExpenses() {
  return db.select().from(expenses).orderBy(desc(expenses.createdAt));
}

export async function createExpense(data: NewExpense) {
  const [expense] = await db.insert(expenses).values(data).returning();
  revalidatePath("/");
  revalidatePath("/gastos");
  return expense;
}

export async function deleteExpense(id: number) {
  await db.delete(expenses).where(eq(expenses.id, id));
  revalidatePath("/");
  revalidatePath("/gastos");
}

// ---------- Dashboard ----------

export async function getDashboardStats() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [salesToday] = await db
    .select({ total: sql<number>`coalesce(sum(${orders.total}), 0)` })
    .from(orders)
    .where(
      and(
        gte(orders.createdAt, today),
        eq(orders.status, "completed"),
        eq(orders.paymentStatus, "paid")
      )
    );

  const [pendingOrders] = await db
    .select({ count: sql<number>`count(*)` })
    .from(orders)
    .where(eq(orders.status, "pending"));

  const [completedOrders] = await db
    .select({ count: sql<number>`count(*)` })
    .from(orders)
    .where(eq(orders.status, "completed"));

  const [lowStock] = await db
    .select({ count: sql<number>`count(*)` })
    .from(products)
    .where(sql`${products.stock} <= 5`);

  const [totalCustomers] = await db
    .select({ count: sql<number>`count(*)` })
    .from(customers);

  const [todayExpenses] = await db
    .select({ total: sql<number>`coalesce(sum(${expenses.amount}), 0)` })
    .from(expenses)
    .where(gte(expenses.createdAt, today));

  const channelBreakdown = await db
    .select({
      channel: orders.channel,
      total: sql<number>`coalesce(sum(${orders.total}), 0)`,
      count: sql<number>`count(*)`,
    })
    .from(orders)
    .groupBy(orders.channel);

  const recentOrders = await db
    .select({
      order: orders,
      customer: customers,
    })
    .from(orders)
    .leftJoin(customers, eq(orders.customerId, customers.id))
    .orderBy(desc(orders.createdAt))
    .limit(5);

  const salesByDay = await db
    .select({
      date: sql<string>`to_char(${orders.createdAt}::date, 'YYYY-MM-DD')`,
      total: sql<number>`coalesce(sum(${orders.total}), 0)`,
    })
    .from(orders)
    .where(eq(orders.status, "completed"))
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
