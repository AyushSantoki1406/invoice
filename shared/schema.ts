import { pgTable, text, serial, integer, decimal, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  documentType: text("document_type").default("invoice"), // "invoice" or "estimate"
  invoiceNumber: text("invoice_number").notNull().unique(),
  companyName: text("company_name").notNull(),
  companyEmail: text("company_email").notNull(),
  companyAddress: text("company_address").default(""),
  companyPhone: text("company_phone").default(""),
  companyWebsite: text("company_website").default(""),
  companyLogo: text("company_logo").default(""), // URL or base64
  clientName: text("client_name").notNull(),
  clientEmail: text("client_email").default(""),
  clientAddress: text("client_address").default(""),
  issueDate: text("issue_date").notNull(),
  dueDate: text("due_date").default(""),
  items: json("items").$type<InvoiceItem[]>().notNull(),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  taxRate: decimal("tax_rate", { precision: 5, scale: 2 }).default("0"),
  taxAmount: decimal("tax_amount", { precision: 10, scale: 2 }).default("0"),
  discountAmount: decimal("discount_amount", { precision: 10, scale: 2 }).default("0"),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  bankName: text("bank_name").default(""),
  bankAccountHolder: text("bank_account_holder").default(""),
  bankAccount: text("bank_account").default(""),
  ifscCode: text("ifsc_code").default(""),
  upiId: text("upi_id").default(""),
  paymentQRCode: text("payment_qr_code").default(""), // Upload your own QR code
  notes: text("notes").default(""),
  createdAt: timestamp("created_at").defaultNow(),
});

export const invoiceItemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().default(""),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  amount: z.number().min(0, "Amount must be positive"),
});

export type InvoiceItem = z.infer<typeof invoiceItemSchema>;

export const insertInvoiceSchema = createInsertSchema(invoices, {
  documentType: z.enum(["invoice", "estimate"]).default("invoice"),
  companyName: z.string().min(1, "Company name is required"),
  companyEmail: z.string().email("Valid email is required"),
  clientName: z.string().min(1, "Client name is required"),
  invoiceNumber: z.string().min(1, "Document number is required"),
  issueDate: z.string().min(1, "Issue date is required"),
  items: z.array(invoiceItemSchema).min(1, "At least one item is required"),
}).omit({
  id: true,
  createdAt: true,
});

export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;
export type Invoice = typeof invoices.$inferSelect;

// Templates for saving invoice templates
export const invoiceTemplates = pgTable("invoice_templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  templateData: json("template_data").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTemplateSchema = createInsertSchema(invoiceTemplates).omit({
  id: true,
  createdAt: true,
});

export type InsertTemplate = z.infer<typeof insertTemplateSchema>;
export type InvoiceTemplate = typeof invoiceTemplates.$inferSelect;
