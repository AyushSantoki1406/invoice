import jsPDF from 'jspdf';
import { type InsertInvoice } from '@shared/schema';

export const generateInvoicePDF = async (data: InsertInvoice): Promise<void> => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.width;
  const pageHeight = pdf.internal.pageSize.height;
  const margin = 20;
  let currentY = margin;

  // Helper function to add text with word wrapping
  const addText = (text: string, x: number, y: number, maxWidth?: number, fontSize = 10) => {
    pdf.setFontSize(fontSize);
    if (maxWidth) {
      const lines = pdf.splitTextToSize(text, maxWidth);
      pdf.text(lines, x, y);
      return y + (lines.length * fontSize * 0.35);
    } else {
      pdf.text(text, x, y);
      return y + (fontSize * 0.35);
    }
  };

  // Header with better styling
  pdf.setFontSize(28);
  pdf.setFont(undefined, 'bold');
  pdf.setTextColor(37, 99, 235); // Primary blue
  pdf.text('INVOICE', pageWidth - margin - 45, currentY + 5);
  
  // Company name with better styling
  pdf.setFontSize(20);
  pdf.setFont(undefined, 'bold');
  pdf.setTextColor(0, 0, 0);
  pdf.text(data.companyName || 'Your Company', margin, currentY + 5);
  currentY += 15;

  // Company details
  pdf.setFontSize(10);
  pdf.setTextColor(100, 100, 100);
  if (data.companyEmail) {
    currentY = addText(data.companyEmail, margin, currentY);
  }
  if (data.companyAddress) {
    currentY = addText(data.companyAddress, margin, currentY, pageWidth - 100);
  }
  if (data.companyPhone) {
    currentY = addText(data.companyPhone, margin, currentY);
  }
  if (data.companyWebsite) {
    currentY = addText(data.companyWebsite, margin, currentY);
  }

  // Invoice details (right side)
  let rightY = margin + 10;
  pdf.setFontSize(10);
  pdf.setTextColor(0, 0, 0);
  addText(`Invoice #: ${data.invoiceNumber || 'INV-001'}`, pageWidth - margin - 60, rightY);
  rightY += 6;
  addText(`Date: ${data.issueDate || new Date().toISOString().split('T')[0]}`, pageWidth - margin - 60, rightY);
  if (data.dueDate) {
    rightY += 6;
    addText(`Due: ${data.dueDate}`, pageWidth - margin - 60, rightY);
  }

  currentY = Math.max(currentY, rightY) + 20;

  // From and Bill To section
  const sectionY = currentY;
  
  // From section
  pdf.setFontSize(12);
  pdf.setTextColor(0, 0, 0);
  addText('From:', margin, currentY, undefined, 12);
  currentY += 8;
  
  pdf.setFontSize(10);
  currentY = addText(data.companyName || 'Your Company', margin, currentY);
  if (data.companyAddress) {
    currentY = addText(data.companyAddress, margin, currentY, (pageWidth / 2) - margin);
  }
  if (data.companyPhone) {
    currentY = addText(data.companyPhone, margin, currentY);
  }
  if (data.companyEmail) {
    currentY = addText(data.companyEmail, margin, currentY);
  }

  // Bill To section
  let billToY = sectionY;
  pdf.setFontSize(12);
  addText('Bill To:', pageWidth / 2, billToY, undefined, 12);
  billToY += 8;
  
  pdf.setFontSize(10);
  billToY = addText(data.clientName || 'Client Name', pageWidth / 2, billToY);
  if (data.clientAddress) {
    billToY = addText(data.clientAddress, pageWidth / 2, billToY, (pageWidth / 2) - margin);
  }
  if (data.clientEmail) {
    billToY = addText(data.clientEmail, pageWidth / 2, billToY);
  }

  currentY = Math.max(currentY, billToY) + 20;

  // Items table
  const tableStartY = currentY;
  const colWidths = [110, 20, 30];
  const colX = [margin, margin + colWidths[0], margin + colWidths[0] + colWidths[1]];

  // Table header with better styling
  pdf.setFillColor(37, 99, 235);
  pdf.rect(margin, currentY, pageWidth - 2 * margin, 10, 'F');
  
  pdf.setFontSize(11);
  pdf.setFont(undefined, 'bold');
  pdf.setTextColor(255, 255, 255);
  pdf.text('Description', colX[0] + 2, currentY + 6);
  pdf.text('Qty', colX[1] + 2, currentY + 6);
  pdf.text('Total Amount', colX[2] + 2, currentY + 6);
  
  currentY += 10;

  // Table rows
  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(num)) return "0.00";
    return num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  if (data.items && data.items.length > 0) {
    data.items.forEach((item) => {
      // Add border
      pdf.setDrawColor(200, 200, 200);
      pdf.line(margin, currentY, pageWidth - margin, currentY);
      
      let rowHeight = 8;
      const titleText = item.title || '';
      const descriptionText = item.description || '';
      
      // Calculate height needed for title and description
      if (descriptionText) {
        rowHeight = 12; // Increased for two lines
      }
      
      // Title (bold)
      pdf.setFont(undefined, 'bold');
      pdf.setTextColor(0, 0, 0);
      pdf.text(titleText, colX[0] + 2, currentY + 5);
      
      // Description (normal font, smaller)
      if (descriptionText) {
        pdf.setFont(undefined, 'normal');
        pdf.setFontSize(8);
        pdf.text(descriptionText, colX[0] + 2, currentY + 9);
        pdf.setFontSize(10); // Reset font size
      }
      
      // Reset font to normal for other columns
      pdf.setFont(undefined, 'normal');
      pdf.text(item.quantity.toString(), colX[1] + 2, currentY + 5);
      const lineTotal = (item.amount || 0) * (item.quantity || 1);
      pdf.text(`₹${formatCurrency(lineTotal)}`, colX[2] + 2, currentY + 5);
      
      currentY += rowHeight;
    });
  }

  // Bottom border
  pdf.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 15;

  // Totals section
  const totalsX = pageWidth - margin - 60;
  
  pdf.setFontSize(10);
  if (data.subtotal) {
    pdf.text('Subtotal:', totalsX - 30, currentY);
    pdf.text(`₹${formatCurrency(data.subtotal)}`, totalsX, currentY);
    currentY += 6;
  }
  
  if (data.taxRate && parseFloat(data.taxRate) > 0) {
    pdf.text(`Tax (${data.taxRate}%):`, totalsX - 30, currentY);
    pdf.text(`₹${formatCurrency(data.taxAmount || 0)}`, totalsX, currentY);
    currentY += 6;
  }
  
  if (data.discountAmount && parseFloat(data.discountAmount) > 0) {
    pdf.text('Discount:', totalsX - 30, currentY);
    pdf.text(`-₹${formatCurrency(data.discountAmount)}`, totalsX, currentY);
    currentY += 6;
  }
  
  // Total
  pdf.setFontSize(12);
  pdf.setTextColor(37, 99, 235);
  pdf.text('Total:', totalsX - 30, currentY);
  pdf.text(`₹${formatCurrency(data.total || 0)}`, totalsX, currentY);
  currentY += 15;

  // Payment information
  if (data.bankAccount || data.ifscCode || data.upiId) {
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    addText('Payment Information:', margin, currentY, undefined, 12);
    currentY += 8;
    
    pdf.setFontSize(10);
    if (data.bankAccount) {
      currentY = addText(`Bank Account: ${data.bankAccount}`, margin, currentY);
    }
    if (data.ifscCode) {
      currentY = addText(`IFSC Code: ${data.ifscCode}`, margin, currentY);
    }
    if (data.upiId) {
      currentY = addText(`UPI ID: ${data.upiId}`, margin, currentY);
    }
    if (data.paymentTerms) {
      currentY = addText(`Payment Terms: ${data.paymentTerms}`, margin, currentY);
    }
    currentY += 10;
  }

  // Notes
  if (data.notes) {
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    addText('Notes:', margin, currentY, undefined, 12);
    currentY += 8;
    
    pdf.setFontSize(10);
    addText(data.notes, margin, currentY, pageWidth - 2 * margin);
  }

  // Save the PDF
  const fileName = `Invoice-${data.invoiceNumber || 'draft'}.pdf`;
  pdf.save(fileName);
};
