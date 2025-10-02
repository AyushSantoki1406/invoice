import { useState } from "react";
import { useParams } from "wouter";
import { FileText, Save, FolderOpen } from "lucide-react";
import InvoiceForm from "@/components/invoice-form";
import InvoicePreview from "@/components/invoice-preview";
import { useInvoice } from "@/hooks/use-invoice";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

export default function InvoiceCreator() {
  const params = useParams();
  const invoiceId = params.id;
  const { toast } = useToast();
  
  const {
    invoiceData,
    updateInvoiceData,
    saveInvoice,
    generatePDF,
    isGeneratingPDF,
    isSaving
  } = useInvoice(invoiceId);

  const { data: templates } = useQuery<any[]>({
    queryKey: ["/api/templates"],
  });

  const handleSaveTemplate = async () => {
    try {
      const templateName = prompt("Enter template name:");
      if (!templateName) return;

      await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: templateName,
          templateData: invoiceData
        }),
      });

      toast({
        title: "Success",
        description: "Template saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save template",
        variant: "destructive",
      });
    }
  };

  const handleLoadTemplate = async () => {
    if (!templates || templates.length === 0) {
      toast({
        title: "No Templates",
        description: "No saved templates found",
      });
      return;
    }

    // For simplicity, load the first template. In a real app, show a selection dialog
    const template = templates[0];
    updateInvoiceData(template.templateData);
    
    toast({
      title: "Success",
      description: "Template loaded successfully",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <FileText className="text-primary text-2xl mr-3" />
              <h1 className="text-xl font-bold text-gray-900">Invoice Creator Pro</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={handleSaveTemplate}
                disabled={isSaving}
              >
                <Save className="mr-2 h-4 w-4" />
                Save Template
              </Button>
              <Button
                variant="ghost"
                onClick={handleLoadTemplate}
                disabled={!templates || templates.length === 0}
              >
                <FolderOpen className="mr-2 h-4 w-4" />
                Load Template
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <InvoiceForm
            data={invoiceData}
            onChange={updateInvoiceData}
            onSave={saveInvoice}
            onGeneratePDF={generatePDF}
            isGeneratingPDF={isGeneratingPDF}
            isSaving={isSaving}
          />
          <InvoicePreview data={invoiceData} />
        </div>
      </main>
    </div>
  );
}
