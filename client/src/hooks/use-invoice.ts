import { useState, useCallback, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { type InsertInvoice, type InvoiceItem } from "@shared/schema";
import { generateInvoicePDF } from "@/lib/pdf-generator";

const createEmptyInvoice = (): InsertInvoice => ({
  companyName: "",
  companyEmail: "",
  companyAddress: "",
  companyPhone: "",
  companyWebsite: "",
  companyLogo: "",
  clientName: "",
  clientEmail: "",
  clientAddress: "",
  invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
  issueDate: new Date().toISOString().split('T')[0],
  dueDate: "",
  items: [],
  subtotal: "0",
  taxRate: "0",
  taxAmount: "0",
  discountAmount: "0",
  total: "0",
  bankName: "",
  bankAccount: "",
  ifscCode: "",
  upiId: "",
  notes: "",
});

export function useInvoice(invoiceId?: number) {
  const [invoiceData, setInvoiceData] = useState<InsertInvoice>(createEmptyInvoice());
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Load existing invoice if ID is provided
  const { data: existingInvoice } = useQuery({
    queryKey: ["/api/invoices", invoiceId],
    enabled: !!invoiceId,
  });

  useEffect(() => {
    if (existingInvoice) {
      setInvoiceData(existingInvoice as InsertInvoice);
    }
  }, [existingInvoice]);

  // Calculate totals whenever items, tax, or discount change
  useEffect(() => {
    const items = invoiceData.items || [];
    const subtotal = items.reduce((sum, item) => {
      const amount = typeof item.amount === 'string' ? parseFloat(item.amount) || 0 : item.amount || 0;
      const quantity = item.quantity || 1;
      return sum + (amount * quantity);
    }, 0);
    const taxRate = parseFloat(invoiceData.taxRate || "0");
    const taxAmount = (subtotal * taxRate) / 100;
    const discountAmount = parseFloat(invoiceData.discountAmount || "0");
    const total = subtotal + taxAmount - discountAmount;

    setInvoiceData(prev => ({
      ...prev,
      subtotal: subtotal.toFixed(2),
      taxAmount: taxAmount.toFixed(2),
      total: Math.max(0, total).toFixed(2),
    }));
  }, [invoiceData.items, invoiceData.taxRate, invoiceData.discountAmount]);

  const saveInvoiceMutation = useMutation({
    mutationFn: async (data: InsertInvoice) => {
      const url = invoiceId ? `/api/invoices/${invoiceId}` : "/api/invoices";
      const method = invoiceId ? "PUT" : "POST";
      return apiRequest(method, url, data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Invoice saved successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/invoices"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save invoice",
        variant: "destructive",
      });
    },
  });

  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const updateInvoiceData = useCallback((updates: Partial<InsertInvoice>) => {
    setInvoiceData(prev => {
      const updated = { ...prev, ...updates };
      
      // No need to recalculate amounts since users enter them directly
      
      return updated;
    });
  }, []);

  const saveInvoice = useCallback(async () => {
    try {
      await saveInvoiceMutation.mutateAsync(invoiceData);
    } catch (error) {
      // Error handling is done in the mutation
    }
  }, [invoiceData, saveInvoiceMutation]);

  const generatePDF = useCallback(async () => {
    try {
      setIsGeneratingPDF(true);
      await generateInvoicePDF(invoiceData);
      toast({
        title: "Success",
        description: "PDF generated and downloaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate PDF",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  }, [invoiceData, toast]);

  return {
    invoiceData,
    updateInvoiceData,
    saveInvoice,
    generatePDF,
    isGeneratingPDF,
    isSaving: saveInvoiceMutation.isPending,
  };
}
