import { invoices, invoiceTemplates, type Invoice, type InsertInvoice, type InvoiceTemplate, type InsertTemplate } from "@shared/schema";

export interface IStorage {
  // Invoice operations
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;
  getInvoice(id: number): Promise<Invoice | undefined>;
  getInvoiceByNumber(invoiceNumber: string): Promise<Invoice | undefined>;
  getAllInvoices(): Promise<Invoice[]>;
  updateInvoice(id: number, invoice: Partial<InsertInvoice>): Promise<Invoice | undefined>;
  deleteInvoice(id: number): Promise<boolean>;

  // Template operations
  createTemplate(template: InsertTemplate): Promise<InvoiceTemplate>;
  getTemplate(id: number): Promise<InvoiceTemplate | undefined>;
  getAllTemplates(): Promise<InvoiceTemplate[]>;
  deleteTemplate(id: number): Promise<boolean>;

  // User operations (keeping existing)
  getUser(id: number): Promise<any>;
  getUserByUsername(username: string): Promise<any>;
  createUser(user: any): Promise<any>;
}

export class MemStorage implements IStorage {
  private invoices: Map<number, Invoice>;
  private templates: Map<number, InvoiceTemplate>;
  private users: Map<number, any>;
  private currentInvoiceId: number;
  private currentTemplateId: number;
  private currentUserId: number;

  constructor() {
    this.invoices = new Map();
    this.templates = new Map();
    this.users = new Map();
    this.currentInvoiceId = 1;
    this.currentTemplateId = 1;
    this.currentUserId = 1;
  }

  // Invoice operations
  async createInvoice(insertInvoice: InsertInvoice): Promise<Invoice> {
    const id = this.currentInvoiceId++;
    const invoice: Invoice = {
      ...insertInvoice,
      id,
      companyAddress: insertInvoice.companyAddress ?? "",
      companyPhone: insertInvoice.companyPhone ?? "",
      companyWebsite: insertInvoice.companyWebsite ?? "",
      companyLogo: insertInvoice.companyLogo ?? "",
      clientEmail: insertInvoice.clientEmail ?? "",
      clientAddress: insertInvoice.clientAddress ?? "",
      dueDate: insertInvoice.dueDate ?? "",
      taxRate: insertInvoice.taxRate ?? "0",
      taxAmount: insertInvoice.taxAmount ?? "0",
      discountAmount: insertInvoice.discountAmount ?? "0",
      bankAccount: insertInvoice.bankAccount ?? "",
      ifscCode: insertInvoice.ifscCode ?? "",
      upiId: insertInvoice.upiId ?? "",
      paymentTerms: insertInvoice.paymentTerms ?? "Net 30",
      notes: insertInvoice.notes ?? "",
      createdAt: new Date(),
    };
    this.invoices.set(id, invoice);
    return invoice;
  }

  async getInvoice(id: number): Promise<Invoice | undefined> {
    return this.invoices.get(id);
  }

  async getInvoiceByNumber(invoiceNumber: string): Promise<Invoice | undefined> {
    return Array.from(this.invoices.values()).find(
      (invoice) => invoice.invoiceNumber === invoiceNumber,
    );
  }

  async getAllInvoices(): Promise<Invoice[]> {
    return Array.from(this.invoices.values()).sort(
      (a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async updateInvoice(id: number, updateData: Partial<InsertInvoice>): Promise<Invoice | undefined> {
    const existing = this.invoices.get(id);
    if (!existing) return undefined;

    const updated: Invoice = { ...existing, ...updateData };
    this.invoices.set(id, updated);
    return updated;
  }

  async deleteInvoice(id: number): Promise<boolean> {
    return this.invoices.delete(id);
  }

  // Template operations
  async createTemplate(insertTemplate: InsertTemplate): Promise<InvoiceTemplate> {
    const id = this.currentTemplateId++;
    const template: InvoiceTemplate = {
      ...insertTemplate,
      id,
      createdAt: new Date(),
    };
    this.templates.set(id, template);
    return template;
  }

  async getTemplate(id: number): Promise<InvoiceTemplate | undefined> {
    return this.templates.get(id);
  }

  async getAllTemplates(): Promise<InvoiceTemplate[]> {
    return Array.from(this.templates.values()).sort(
      (a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async deleteTemplate(id: number): Promise<boolean> {
    return this.templates.delete(id);
  }

  // User operations (keeping existing for compatibility)
  async getUser(id: number): Promise<any> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<any> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: any): Promise<any> {
    const id = this.currentUserId++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
}

export const storage = new MemStorage();
