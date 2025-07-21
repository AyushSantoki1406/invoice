import { Building } from "lucide-react";
import { type InsertInvoice } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface InvoicePreviewProps {
  data: InsertInvoice;
}

export default function InvoicePreview({ data }: InvoicePreviewProps) {
  // No longer auto-generating QR codes - user uploads their own

  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return isNaN(num) ? "0.00" : num.toFixed(2);
  };

  return (
    <Card className="sticky top-8">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold text-gray-900">Live Preview</CardTitle>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">100%</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border border-gray-300 rounded-lg p-6 bg-white min-h-[800px] transform scale-90 origin-top-left w-[111%]">
          {/* Invoice Header */}
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mr-4">
                {data.companyLogo ? (
                  <img 
                    src={data.companyLogo} 
                    alt="Company Logo" 
                    className="w-full h-full object-contain rounded-lg"
                  />
                ) : (
                  <Building className="text-gray-400 text-2xl" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {data.companyName || "Your Company Name"}
                </h1>
                <p className="text-gray-600">{data.companyEmail || "company@example.com"}</p>
              </div>
            </div>
            <div className="text-right">
              <h1 className="text-3xl font-bold text-primary mb-2">INVOICE</h1>
              <p className="text-gray-600">
                Invoice #: <span className="font-semibold">{data.invoiceNumber || "INV-001"}</span>
              </p>
              <p className="text-gray-600">
                Date: <span className="font-semibold">{data.issueDate || new Date().toISOString().split('T')[0]}</span>
              </p>
              {data.dueDate && (
                <p className="text-gray-600">
                  Due: <span className="font-semibold">{data.dueDate}</span>
                </p>
              )}
            </div>
          </div>

          {/* Company & Client Info */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">From:</h3>
              <div className="text-gray-700">
                <p>{data.companyName || "Your Company Name"}</p>
                {data.companyAddress && (
                  <p className="whitespace-pre-line">{data.companyAddress}</p>
                )}
                {data.companyPhone && <p>{data.companyPhone}</p>}
                <p>{data.companyEmail || "company@example.com"}</p>
                {data.companyWebsite && <p>{data.companyWebsite}</p>}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Bill To:</h3>
              <div className="text-gray-700">
                <p>{data.clientName || "Client Name"}</p>
                {data.clientAddress && (
                  <p className="whitespace-pre-line">{data.clientAddress}</p>
                )}
                {data.clientEmail && <p>{data.clientEmail}</p>}
              </div>
            </div>
          </div>

          {/* Invoice Items Table */}
          <div className="mb-8">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left py-3 font-semibold text-gray-900">Description</th>
                  <th className="text-center py-3 font-semibold text-gray-900 w-20">Qty</th>
                  <th className="text-right py-3 font-semibold text-gray-900 w-24">Amount</th>
                </tr>
              </thead>
              <tbody>
                {data.items && data.items.length > 0 ? (
                  data.items.map((item, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="py-3 text-gray-700">
                        <div className="font-medium text-gray-900">{item.title || "Service title"}</div>
                        {item.description && (
                          <div className="text-sm text-gray-600 mt-1">{item.description}</div>
                        )}
                      </td>
                      <td className="py-3 text-center text-gray-700">{item.quantity || 1}</td>
                      <td className="py-3 text-right text-gray-700">₹{formatCurrency(item.amount)}</td>
                    </tr>
                  ))
                ) : (
                  <tr className="border-b border-gray-200">
                    <td className="py-3 text-gray-500 italic" colSpan={3}>No items added yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-8">
            <div className="w-64">
              <div className="flex justify-between py-2">
                <span className="text-gray-700">Subtotal:</span>
                <span>₹{formatCurrency(data.subtotal || 0)}</span>
              </div>
              {data.taxRate && parseFloat(data.taxRate) > 0 && (
                <div className="flex justify-between py-2">
                  <span className="text-gray-700">Tax ({data.taxRate}%):</span>
                  <span>₹{formatCurrency(data.taxAmount || 0)}</span>
                </div>
              )}
              {data.discountAmount && parseFloat(data.discountAmount) > 0 && (
                <div className="flex justify-between py-2">
                  <span className="text-gray-700">Discount:</span>
                  <span>-₹{formatCurrency(data.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between py-2 border-t border-gray-300 font-bold text-lg">
                <span className="text-gray-900">Total:</span>
                <span className="text-primary">₹{formatCurrency(data.total || 0)}</span>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Payment Information:</h3>
              <div className="text-sm text-gray-700">
                {data.bankAccount && <p>Bank: {data.bankAccount}</p>}
                {data.ifscCode && <p>IFSC: {data.ifscCode}</p>}
                {data.upiId && <p>UPI: {data.upiId}</p>}
                {data.paymentTerms && <p>Terms: {data.paymentTerms}</p>}
              </div>
            </div>
            {data.paymentQRCode && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">QR Code Payment:</h3>
                <div className="w-24 h-24 bg-gray-200 flex items-center justify-center rounded">
                  <img src={data.paymentQRCode} alt="Payment QR Code" className="w-full h-full object-contain" />
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          {data.notes && (
            <div className="border-t border-gray-300 pt-4">
              <h3 className="font-semibold text-gray-900 mb-2">Notes:</h3>
              <p className="text-gray-700 text-sm whitespace-pre-line">{data.notes}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
