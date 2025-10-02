import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { InvoiceTemplate } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

interface TemplateSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectTemplate: (templateData: any) => void;
}

export default function TemplateSelector({ 
  open, 
  onOpenChange, 
  onSelectTemplate 
}: TemplateSelectorProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: templates, isLoading } = useQuery<InvoiceTemplate[]>({
    queryKey: ["/api/templates"],
  });

  const deleteTemplateMutation = useMutation({
    mutationFn: async (templateId: number) => {
      return apiRequest("DELETE", `/api/templates/${templateId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/templates"] });
      toast({
        title: "Success",
        description: "Template deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete template",
        variant: "destructive",
      });
    },
  });

  const handleSelectTemplate = (template: InvoiceTemplate) => {
    onSelectTemplate(template.templateData);
    onOpenChange(false);
    toast({
      title: "Success",
      description: `Template "${template.name}" loaded successfully`,
    });
  };

  const handleDeleteTemplate = (templateId: number, templateName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete the template "${templateName}"?`)) {
      deleteTemplateMutation.mutate(templateId);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]" data-testid="dialog-template-selector">
        <DialogHeader>
          <DialogTitle data-testid="text-dialog-title">Load Template</DialogTitle>
          <DialogDescription data-testid="text-dialog-description">
            Select a template to load into your invoice
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[400px] pr-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12" data-testid="text-loading">
              <p className="text-muted-foreground">Loading templates...</p>
            </div>
          ) : !templates || templates.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12" data-testid="text-no-templates">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No templates saved yet</p>
              <p className="text-sm text-muted-foreground mt-2">
                Save a template to reuse it later
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {templates.map((template) => (
                <Card 
                  key={template.id}
                  className="cursor-pointer hover:border-primary transition-colors"
                  onClick={() => handleSelectTemplate(template)}
                  data-testid={`card-template-${template.id}`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg" data-testid={`text-template-name-${template.id}`}>
                          {template.name}
                        </CardTitle>
                        <CardDescription data-testid={`text-template-date-${template.id}`}>
                          Created: {new Date(template.createdAt!).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => handleDeleteTemplate(template.id, template.name, e)}
                        disabled={deleteTemplateMutation.isPending}
                        data-testid={`button-delete-template-${template.id}`}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="text-sm text-muted-foreground space-y-1">
                      {(template.templateData as any)?.companyName && (
                        <p data-testid={`text-company-name-${template.id}`}>
                          <span className="font-medium">Company:</span> {(template.templateData as any).companyName}
                        </p>
                      )}
                      {(template.templateData as any)?.items && (
                        <p data-testid={`text-items-count-${template.id}`}>
                          <span className="font-medium">Items:</span> {(template.templateData as any).items.length}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="flex justify-end pt-4">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            data-testid="button-cancel"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
