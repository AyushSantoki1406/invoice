import { useState } from "react";
import { useParams } from "wouter";
import { FileText, Save, FolderOpen } from "lucide-react";
import InvoiceForm from "@/components/invoice-form";
import InvoicePreview from "@/components/invoice-preview";
import TemplateSelector from "@/components/template-selector";
import { useInvoice } from "@/hooks/use-invoice";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function InvoiceCreator() {
  const params = useParams();
  const invoiceId = params.id;
  const { toast } = useToast();
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);

  const {
    invoiceData,
    updateInvoiceData,
    saveInvoice,
    generatePDF,
    isGeneratingPDF,
    isSaving,
  } = useInvoice(invoiceId);

  const handleSaveTemplate = async () => {
    try {
      const templateName = prompt("Enter template name:");
      if (!templateName) return;

      await apiRequest("POST", "/api/templates", {
        name: templateName,
        templateData: invoiceData,
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

  const handleLoadTemplate = (templateData: any) => {
    updateInvoiceData(templateData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <FileText className="text-primary text-2xl mr-3" />
              <h1 className="text-xl font-bold text-gray-900">
                Invoice Creator Pro
              </h1>
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
                onClick={() => setTemplateDialogOpen(true)}
                data-testid="button-load-template"
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

      <TemplateSelector
        open={templateDialogOpen}
        onOpenChange={setTemplateDialogOpen}
        onSelectTemplate={handleLoadTemplate}
      />
    </div>
  );
}
