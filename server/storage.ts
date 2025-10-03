import type { Invoice, InsertInvoice, InvoiceTemplate, InsertTemplate } from "@shared/schema";
<<<<<<< HEAD
import { drizzle } from "drizzle-orm/neon-serverless";
import { invoices, invoiceTemplates } from "@shared/schema";
import { eq } from "drizzle-orm";
import ws from "ws";
import dotenv from "dotenv";
dotenv.config(); // must be called before using process.env
||||||| 6bff6ef
import { drizzle } from "drizzle-orm/neon-serverless";
import { invoices, invoiceTemplates } from "@shared/schema";
import { eq } from "drizzle-orm";
import ws from "ws";
=======
import { InvoiceModel, TemplateModel } from "./db";
>>>>>>> dd2af72b3450135c0f1ff961dd61fb60de26814d

export interface IStorage {
  getInvoices(): Promise<Invoice[]>;
  getInvoiceById(id: string): Promise<Invoice | undefined>;
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;
  updateInvoice(id: string, invoice: Partial<InsertInvoice>): Promise<Invoice | undefined>;
  deleteInvoice(id: string): Promise<boolean>;

  getTemplates(): Promise<InvoiceTemplate[]>;
  getTemplateById(id: string): Promise<InvoiceTemplate | undefined>;
  createTemplate(template: InsertTemplate): Promise<InvoiceTemplate>;
  deleteTemplate(id: string): Promise<boolean>;
}

export class MongoDBStorage implements IStorage {
  async getInvoices(): Promise<Invoice[]> {
    const invoices = await InvoiceModel.find().sort({ createdAt: -1 }).lean();
    return invoices.map((invoice) => ({
      ...invoice,
      id: invoice._id.toString(),
      _id: invoice._id.toString(),
    }));
  }

  async getInvoiceById(id: string): Promise<Invoice | undefined> {
    const invoice = await InvoiceModel.findById(id).lean();
    if (!invoice) return undefined;
    return {
      ...invoice,
      id: invoice._id.toString(),
      _id: invoice._id.toString(),
    };
  }

  async createInvoice(invoice: InsertInvoice): Promise<Invoice> {
    const newInvoice = await InvoiceModel.create(invoice);
    const savedInvoice = await newInvoice.save();
    return {
      ...savedInvoice.toObject(),
      id: savedInvoice._id.toString(),
      _id: savedInvoice._id.toString(),
    };
  }

  async updateInvoice(id: string, invoice: Partial<InsertInvoice>): Promise<Invoice | undefined> {
    const updatedInvoice = await InvoiceModel.findByIdAndUpdate(
      id,
      { $set: invoice },
      { new: true }
    ).lean();
    
    if (!updatedInvoice) return undefined;
    
    return {
      ...updatedInvoice,
      id: updatedInvoice._id.toString(),
      _id: updatedInvoice._id.toString(),
    };
  }

  async deleteInvoice(id: string): Promise<boolean> {
    const result = await InvoiceModel.findByIdAndDelete(id);
    return result !== null;
  }

  async getTemplates(): Promise<InvoiceTemplate[]> {
    const templates = await TemplateModel.find().sort({ createdAt: -1 }).lean();
    return templates.map((template) => ({
      ...template,
      id: template._id.toString(),
      _id: template._id.toString(),
    }));
  }

  async getTemplateById(id: string): Promise<InvoiceTemplate | undefined> {
    const template = await TemplateModel.findById(id).lean();
    if (!template) return undefined;
    return {
      ...template,
      id: template._id.toString(),
      _id: template._id.toString(),
    };
  }

  async createTemplate(template: InsertTemplate): Promise<InvoiceTemplate> {
    const newTemplate = await TemplateModel.create(template);
    const savedTemplate = await newTemplate.save();
    return {
      ...savedTemplate.toObject(),
      id: savedTemplate._id.toString(),
      _id: savedTemplate._id.toString(),
    };
  }

  async deleteTemplate(id: string): Promise<boolean> {
    const result = await TemplateModel.findByIdAndDelete(id);
    return result !== null;
  }
}

export const storage = new MongoDBStorage();
