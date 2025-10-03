import { z } from "zod";

export const invoiceItemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().default(""),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  amount: z.number().min(0, "Amount must be positive"),
});

export type InvoiceItem = z.infer<typeof invoiceItemSchema>;

export const invoiceSchema = z.object({
  _id: z.string().optional(),
  documentType: z.enum(["invoice", "estimate"]).default("invoice"),
  invoiceNumber: z.string().min(1, "Document number is required"),
  companyName: z.string().min(1, "Company name is required"),
  companyEmail: z.string().email("Valid email is required"),
  companyAddress: z.string().default(""),
  companyPhone: z.string().default(""),
  companyWebsite: z.string().default(""),
  companyLogo: z.string().default(""),
  clientName: z.string().min(1, "Client name is required"),
  clientEmail: z.string().default(""),
  clientAddress: z.string().default(""),
  issueDate: z.string().min(1, "Issue date is required"),
  dueDate: z.string().default(""),
  items: z.array(invoiceItemSchema).min(1, "At least one item is required"),
  subtotal: z.number(),
  taxRate: z.number().default(0),
  taxAmount: z.number().default(0),
  discountAmount: z.number().default(0),
  total: z.number(),
  bankName: z.string().default(""),
  bankAccountHolder: z.string().default(""),
  bankAccount: z.string().default(""),
  ifscCode: z.string().default(""),
  upiId: z.string().default(""),
  paymentQRCode: z.string().default(""),
  notes: z.string().default(""),
  createdAt: z.date().optional(),
});

export const insertInvoiceSchema = invoiceSchema.omit({
  _id: true,
  createdAt: true,
});

export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;
export type Invoice = z.infer<typeof invoiceSchema> & { id: string };

export const invoiceTemplateSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1, "Template name is required"),
  templateData: z.any(),
  createdAt: z.date().optional(),
});

export const insertTemplateSchema = invoiceTemplateSchema.omit({
  _id: true,
  createdAt: true,
});

export type InsertTemplate = z.infer<typeof insertTemplateSchema>;
export type InvoiceTemplate = z.infer<typeof invoiceTemplateSchema> & { id: string };
