import mongoose from 'mongoose';

const invoiceItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  quantity: { type: Number, required: true, min: 1 },
  amount: { type: Number, required: true, min: 0 }
}, { _id: false });

const invoiceSchema = new mongoose.Schema({
  documentType: { type: String, default: 'invoice', enum: ['invoice', 'estimate'] },
  invoiceNumber: { type: String, required: true, unique: true },
  companyName: { type: String, required: true },
  companyEmail: { type: String, required: true },
  companyAddress: { type: String, default: '' },
  companyPhone: { type: String, default: '' },
  companyWebsite: { type: String, default: '' },
  companyLogo: { type: String, default: '' },
  clientName: { type: String, required: true },
  clientEmail: { type: String, default: '' },
  clientAddress: { type: String, default: '' },
  issueDate: { type: String, required: true },
  dueDate: { type: String, default: '' },
  items: { type: [invoiceItemSchema], required: true },
  subtotal: { type: Number, required: true },
  taxRate: { type: Number, default: 0 },
  taxAmount: { type: Number, default: 0 },
  discountAmount: { type: Number, default: 0 },
  total: { type: Number, required: true },
  bankName: { type: String, default: '' },
  bankAccountHolder: { type: String, default: '' },
  bankAccount: { type: String, default: '' },
  ifscCode: { type: String, default: '' },
  upiId: { type: String, default: '' },
  paymentQRCode: { type: String, default: '' },
  notes: { type: String, default: '' }
}, {
  timestamps: true
});

export default mongoose.model('Invoice', invoiceSchema);
