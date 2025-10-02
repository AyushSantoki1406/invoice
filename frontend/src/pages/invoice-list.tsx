import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, DollarSign, Eye, Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Invoice } from "@/lib/types";

export default function InvoiceList() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: invoices, isLoading } = useQuery<Invoice[]>({
    queryKey: ["/api/invoices"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/invoices/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Invoice deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/invoices"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete invoice",
        variant: "destructive",
      });
    },
  });

  const handleView = (invoice: Invoice) => {
    const route = invoice.documentType === "estimate" ? "/estimate" : "/invoice";
    setLocation(`${route}/${invoice._id}`);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this invoice?")) {
      deleteMutation.mutate(id);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(num);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const sortedInvoices = invoices?.sort((a, b) => {
    const dateA = new Date(a.createdAt || 0).getTime();
    const dateB = new Date(b.createdAt || 0).getTime();
    return dateB - dateA;
  }) || [];

  const invoicesList = sortedInvoices.filter(inv => inv.documentType === "invoice");
  const estimatesList = sortedInvoices.filter(inv => inv.documentType === "estimate");

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Documents</h1>
          <div className="space-x-2">
            <Button onClick={() => setLocation("/invoice")} data-testid="button-create-invoice">
              Create Invoice
            </Button>
            <Button onClick={() => setLocation("/estimate")} variant="outline" data-testid="button-create-estimate">
              Create Estimate
            </Button>
          </div>
        </div>

        {/* Invoices Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Invoices ({invoicesList.length})
          </h2>
          {invoicesList.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                No invoices yet. Create your first invoice!
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {invoicesList.map((invoice) => (
                <Card key={invoice._id} className="hover:shadow-lg transition-shadow" data-testid={`card-invoice-${invoice._id}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <div className="bg-blue-100 p-3 rounded-lg">
                            <FileText className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900" data-testid={`text-invoice-number-${invoice._id}`}>
                              {invoice.invoiceNumber}
                            </h3>
                            <p className="text-gray-600">{invoice.clientName}</p>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                              <span className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {formatDate(invoice.issueDate)}
                              </span>
                              <span className="flex items-center font-semibold text-gray-900">
                                <DollarSign className="h-4 w-4 mr-1" />
                                {formatCurrency(invoice.total)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleView(invoice)}
                          data-testid={`button-view-${invoice._id}`}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(invoice._id)}
                          data-testid={`button-delete-${invoice._id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Estimates Section */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Estimates ({estimatesList.length})
          </h2>
          {estimatesList.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                No estimates yet. Create your first estimate!
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {estimatesList.map((estimate) => (
                <Card key={estimate._id} className="hover:shadow-lg transition-shadow" data-testid={`card-estimate-${estimate._id}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <div className="bg-green-100 p-3 rounded-lg">
                            <FileText className="h-6 w-6 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900" data-testid={`text-estimate-number-${estimate._id}`}>
                              {estimate.invoiceNumber}
                            </h3>
                            <p className="text-gray-600">{estimate.clientName}</p>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                              <span className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {formatDate(estimate.issueDate)}
                              </span>
                              <span className="flex items-center font-semibold text-gray-900">
                                <DollarSign className="h-4 w-4 mr-1" />
                                {formatCurrency(estimate.total)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleView(estimate)}
                          data-testid={`button-view-${estimate._id}`}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(estimate._id)}
                          data-testid={`button-delete-${estimate._id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
