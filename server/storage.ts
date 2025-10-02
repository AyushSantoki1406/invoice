import type { Invoice, InsertInvoice, InvoiceTemplate, InsertTemplate } from "@shared/schema";

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

export class MemStorage implements IStorage {
  private invoices: Map<number, Invoice> = new Map();
  private templates: Map<number, InvoiceTemplate> = new Map();
  private invoiceIdCounter = 1;
  private templateIdCounter = 1;

  async getInvoices(): Promise<Invoice[]> {
    return Array.from(this.invoices.values());
  }

  async getInvoiceById(id: number): Promise<Invoice | undefined> {
    return this.invoices.get(id);
  }

  async createInvoice(invoice: InsertInvoice): Promise<Invoice> {
    const id = this.invoiceIdCounter++;
    const newInvoice: Invoice = {
      ...invoice,
      id,
      createdAt: new Date(),
    } as Invoice;
    this.invoices.set(id, newInvoice);
    return newInvoice;
  }

  async updateInvoice(id: number, invoice: Partial<InsertInvoice>): Promise<Invoice | undefined> {
    const existing = this.invoices.get(id);
    if (!existing) return undefined;

    const updated: Invoice = {
      ...existing,
      ...invoice,
    };
    this.invoices.set(id, updated);
    return updated;
  }

  async deleteInvoice(id: number): Promise<boolean> {
    return this.invoices.delete(id);
  }

  async getTemplates(): Promise<InvoiceTemplate[]> {
    return Array.from(this.templates.values());
  }

  async getTemplateById(id: number): Promise<InvoiceTemplate | undefined> {
    return this.templates.get(id);
  }

  async createTemplate(template: InsertTemplate): Promise<InvoiceTemplate> {
    const id = this.templateIdCounter++;
    const newTemplate: InvoiceTemplate = {
      ...template,
      id,
      createdAt: new Date(),
    };
    this.templates.set(id, newTemplate);
    return newTemplate;
  }

  async deleteTemplate(id: number): Promise<boolean> {
    return this.templates.delete(id);
  }
}

export const storage = new MemStorage();
