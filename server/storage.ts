import type { Invoice, InsertInvoice, InvoiceTemplate, InsertTemplate } from "@shared/schema";
import { drizzle } from "drizzle-orm/neon-serverless";
import { invoices, invoiceTemplates } from "@shared/schema";
import { eq } from "drizzle-orm";
import ws from "ws";

export interface IStorage {
  getInvoices(): Promise<Invoice[]>;
  getInvoiceById(id: number): Promise<Invoice | undefined>;
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;
  updateInvoice(id: number, invoice: Partial<InsertInvoice>): Promise<Invoice | undefined>;
  deleteInvoice(id: number): Promise<boolean>;

  getTemplates(): Promise<InvoiceTemplate[]>;
  getTemplateById(id: number): Promise<InvoiceTemplate | undefined>;
  createTemplate(template: InsertTemplate): Promise<InvoiceTemplate>;
  deleteTemplate(id: number): Promise<boolean>;
}

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const db = drizzle({
  connection: process.env.DATABASE_URL,
  ws: ws,
});

export class DatabaseStorage implements IStorage {
  async getInvoices(): Promise<Invoice[]> {
    return await db.select().from(invoices);
  }

  async getInvoiceById(id: number): Promise<Invoice | undefined> {
    const result = await db.select().from(invoices).where(eq(invoices.id, id));
    return result[0];
  }

  async createInvoice(invoice: InsertInvoice): Promise<Invoice> {
    const result = await db.insert(invoices).values(invoice).returning();
    return result[0];
  }

  async updateInvoice(id: number, invoice: Partial<InsertInvoice>): Promise<Invoice | undefined> {
    const result = await db
      .update(invoices)
      .set(invoice)
      .where(eq(invoices.id, id))
      .returning();
    return result[0];
  }

  async deleteInvoice(id: number): Promise<boolean> {
    const result = await db.delete(invoices).where(eq(invoices.id, id)).returning();
    return result.length > 0;
  }

  async getTemplates(): Promise<InvoiceTemplate[]> {
    return await db.select().from(invoiceTemplates);
  }

  async getTemplateById(id: number): Promise<InvoiceTemplate | undefined> {
    const result = await db.select().from(invoiceTemplates).where(eq(invoiceTemplates.id, id));
    return result[0];
  }

  async createTemplate(template: InsertTemplate): Promise<InvoiceTemplate> {
    const result = await db.insert(invoiceTemplates).values(template).returning();
    return result[0];
  }

  async deleteTemplate(id: number): Promise<boolean> {
    const result = await db.delete(invoiceTemplates).where(eq(invoiceTemplates.id, id)).returning();
    return result.length > 0;
  }
}

export const storage = new DatabaseStorage();
