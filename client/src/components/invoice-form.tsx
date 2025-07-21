import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, Building, FileText, User, List, Calculator, CreditCard, StickyNote, File, Eye, Mail } from "lucide-react";
import { insertInvoiceSchema, type InsertInvoice, type InvoiceItem } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import FileUpload from "@/components/ui/file-upload";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

interface InvoiceFormProps {
  data: InsertInvoice;
  onChange: (data: Partial<InsertInvoice>) => void;
  onSave: () => Promise<void>;
  onGeneratePDF: () => Promise<void>;
  isGeneratingPDF: boolean;
  isSaving: boolean;
}

export default function InvoiceForm({
  data,
  onChange,
  onSave,
  onGeneratePDF,
  isGeneratingPDF,
  isSaving
}: InvoiceFormProps) {
  const { toast } = useToast();
  
  const form = useForm<InsertInvoice>({
    resolver: zodResolver(insertInvoiceSchema),
    defaultValues: data,
  });

  // Update form when data changes
  useEffect(() => {
    form.reset(data);
  }, [data, form]);

  // Watch form changes and update parent
  useEffect(() => {
    const subscription = form.watch((values) => {
      if (values) {
        onChange(values as Partial<InsertInvoice>);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, onChange]);

  const addItem = () => {
    const newItem: InvoiceItem = {
      title: "",
      description: "",
      quantity: 1,
      amount: 0,
    };
    const currentItems = form.getValues("items") || [];
    form.setValue("items", [...currentItems, newItem]);
  };

  const removeItem = (index: number) => {
    const currentItems = form.getValues("items") || [];
    form.setValue("items", currentItems.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const currentItems = form.getValues("items") || [];
    const updatedItems = [...currentItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    
    form.setValue("items", updatedItems);
  };

  const handleLogoUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('logo', file);

      const response = await fetch('/api/upload/logo', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      form.setValue("companyLogo", result.filePath);
      
      toast({
        title: "Success",
        description: "Logo uploaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload logo",
        variant: "destructive",
      });
    }
  };

  const handleSendEmail = () => {
    toast({
      title: "Feature Coming Soon",
      description: "Email functionality will be available in the next update",
    });
  };

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900">Create Invoice</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <Form {...form}>
          {/* Company Details */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Building className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold text-gray-900">Company Details</h3>
            </div>
            
            <FileUpload
              label="Company Logo"
              accept="image/*"
              onFileSelect={handleLogoUpload}
              description="PNG, JPG up to 2MB"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Company Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="companyEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="company@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="companyAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Company Address" rows={3} {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="companyPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (555) 123-4567" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="companyWebsite"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input placeholder="www.yourcompany.com" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Invoice Details */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <FileText className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold text-gray-900">Invoice Details</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="invoiceNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Invoice Number *</FormLabel>
                    <FormControl>
                      <Input placeholder="INV-001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="issueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Issue Date *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Client Details */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <User className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold text-gray-900">Bill To</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="clientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Client Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="clientEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="client@example.com" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="clientAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Address</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Client Address" rows={3} {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Invoice Items */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <List className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold text-gray-900">Invoice Items</h3>
            </div>
            
            <div className="space-y-4">
              {(form.watch("items") || []).map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Title *</Label>
                        <Input
                          placeholder="Service or product title"
                          value={item.title || ""}
                          onChange={(e) => updateItem(index, "title", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Input
                          placeholder="Additional details (optional)"
                          value={item.description || ""}
                          onChange={(e) => updateItem(index, "description", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
                      <div className="md:col-span-2">
                        <Label>Quantity</Label>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, "quantity", Number(e.target.value))}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label>Amount (₹)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={item.amount || ""}
                          onChange={(e) => updateItem(index, "amount", e.target.value === "" ? "" : parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="md:col-span-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <Button
                type="button"
                variant="outline"
                onClick={addItem}
                className="w-full border-dashed"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </div>
          </div>

          {/* Totals */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Calculator className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold text-gray-900">Totals</h3>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Subtotal:</span>
                <span className="font-semibold">₹{form.watch("subtotal") || "0.00"}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-700">Tax:</span>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    className="w-16 h-8"
                    placeholder="0"
                    value={form.watch("taxRate") || ""}
                    onChange={(e) => form.setValue("taxRate", e.target.value)}
                  />
                  <span className="text-gray-700">%</span>
                </div>
                <span className="font-semibold">₹{form.watch("taxAmount") || "0.00"}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-700">Discount:</span>
                  <span className="text-gray-700">₹</span>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    className="w-20 h-8"
                    placeholder="0.00"
                    value={form.watch("discountAmount") || ""}
                    onChange={(e) => form.setValue("discountAmount", e.target.value)}
                  />
                </div>
              </div>
              
              <hr className="border-gray-300" />
              
              <div className="flex justify-between items-center text-lg font-bold">
                <span className="text-gray-900">Total:</span>
                <span className="text-primary">₹{form.watch("total") || "0.00"}</span>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <CreditCard className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold text-gray-900">Payment Details</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="bankAccount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bank Account</FormLabel>
                    <FormControl>
                      <Input placeholder="Account Number" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ifscCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IFSC Code</FormLabel>
                    <FormControl>
                      <Input placeholder="IFSC Code" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="upiId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>UPI ID</FormLabel>
                    <FormControl>
                      <Input placeholder="yourname@upi" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="md:col-span-2">
                <Label>Payment QR Code</Label>
                <div className="mt-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        try {
                          const formData = new FormData();
                          formData.append('qrcode', file);
                          const response = await fetch('/api/upload/qrcode', {
                            method: 'POST',
                            body: formData,
                          });
                          const result = await response.json();
                          if (result.filePath) {
                            form.setValue("paymentQRCode", result.filePath);
                          }
                        } catch (error) {
                          console.error('QR code upload failed:', error);
                        }
                      }
                    }}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
                  />
                  <p className="text-xs text-gray-500 mt-1">Upload your own QR code for payments</p>
                </div>
              </div>
              <FormField
                control={form.control}
                name="paymentTerms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Terms</FormLabel>
                    <Select value={field.value || ""} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment terms" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Net 30">Net 30</SelectItem>
                        <SelectItem value="Net 15">Net 15</SelectItem>
                        <SelectItem value="Due on Receipt">Due on Receipt</SelectItem>
                        <SelectItem value="Net 60">Net 60</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <StickyNote className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold text-gray-900">Additional Notes</h3>
            </div>
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea 
                      placeholder="Thank you for your business!" 
                      rows={3} 
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Form>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={onGeneratePDF}
            disabled={isGeneratingPDF}
            className="flex-1"
          >
            <File className="mr-2 h-4 w-4" />
            {isGeneratingPDF ? "Generating..." : "Generate PDF"}
          </Button>
          <Button
            variant="outline"
            onClick={() => {/* Preview functionality */}}
            className="flex-1"
          >
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button
            variant="secondary"
            onClick={handleSendEmail}
            className="flex-1"
          >
            <Mail className="mr-2 h-4 w-4" />
            Send Email
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
