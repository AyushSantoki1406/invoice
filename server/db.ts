import mongoose, { Schema, Document } from "mongoose";
import type { Invoice, InvoiceTemplate } from "@shared/schema";

const MONGODB_URI = process.env.MONGODB_URI || process.env.DATABASE_URL || "mongodb://localhost:27017/invoice-app";

export interface InvoiceDocument extends Omit<Invoice, 'id' | '_id'>, Document {
  _id: mongoose.Types.ObjectId;
}

export interface TemplateDocument extends Omit<InvoiceTemplate, 'id' | '_id'>, Document {
  _id: mongoose.Types.ObjectId;
}

const invoiceSchema = new Schema({
  documentType: { type: String, enum: ["invoice", "estimate"], default: "invoice" },
  invoiceNumber: { type: String, required: true, unique: true },
  companyName: { type: String, required: true },
  companyEmail: { type: String, required: true },
  companyAddress: { type: String, default: "" },
  companyPhone: { type: String, default: "" },
  companyWebsite: { type: String, default: "" },
  companyLogo: { type: String, default: "" },
  clientName: { type: String, required: true },
  clientEmail: { type: String, default: "" },
  clientAddress: { type: String, default: "" },
  issueDate: { type: String, required: true },
  dueDate: { type: String, default: "" },
  items: [
    {
      title: { type: String, required: true },
      description: { type: String, default: "" },
      quantity: { type: Number, required: true },
      amount: { type: Number, required: true },
    },
  ],
  subtotal: { type: Number, required: true },
  taxRate: { type: Number, default: 0 },
  taxAmount: { type: Number, default: 0 },
  discountAmount: { type: Number, default: 0 },
  total: { type: Number, required: true },
  bankName: { type: String, default: "" },
  bankAccountHolder: { type: String, default: "" },
  bankAccount: { type: String, default: "" },
  ifscCode: { type: String, default: "" },
  upiId: { type: String, default: "" },
  paymentQRCode: { type: String, default: "" },
  notes: { type: String, default: "" },
}, { timestamps: true });

const templateSchema = new Schema({
  name: { type: String, required: true },
  templateData: { type: Schema.Types.Mixed, required: true },
}, { timestamps: true });

export const InvoiceModel = mongoose.model<InvoiceDocument>("Invoice", invoiceSchema);
export const TemplateModel = mongoose.model<TemplateDocument>("InvoiceTemplate", templateSchema);

let isConnected = false;

export async function connectDB(): Promise<void> {
  if (isConnected) {
    console.log("MongoDB already connected");
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

export async function disconnectDB(): Promise<void> {
  if (!isConnected) {
    return;
  }

  try {
    await mongoose.disconnect();
    isConnected = false;
    console.log("MongoDB disconnected");
  } catch (error) {
    console.error("MongoDB disconnection error:", error);
    throw error;
  }
}
