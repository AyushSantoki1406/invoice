import jsPDF from 'jspdf';
import { type InsertInvoice } from '@shared/schema';

// Helper function to load image as base64
const loadImageAsBase64 = (url: string): Promise<string | null> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(null);
        return;
      }
      
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      try {
        const dataURL = canvas.toDataURL('image/jpeg', 0.8);
        resolve(dataURL);
      } catch (error) {
        console.warn('Canvas conversion error:', error);
        resolve(null);
      }
    };
    img.onerror = () => {
      console.warn('Image load error for:', url);
      resolve(null);
    };
    img.src = url;
  });
};

export const generateInvoicePDF = async (data: InsertInvoice): Promise<void> => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.width;
  const pageHeight = pdf.internal.pageSize.height;
  const margin = 20;
  let currentY = margin;

  // Load company logo if available
  if (data.companyLogo) {
    try {
      const logoData = await loadImageAsBase64(data.companyLogo);
      if (logoData) {
        const logoWidth = 30;
        const logoHeight = 20;
        pdf.addImage(logoData, 'JPEG', margin, currentY, logoWidth, logoHeight);
        currentY += logoHeight + 5;
      }
    } catch (error) {
      console.warn('Could not load logo:', error);
    }
  }

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
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(37, 99, 235); // Primary blue
  pdf.text('INVOICE', pageWidth - margin - 45, currentY + 5);
  
  // Company name with better styling (only show if no detailed info in From section)
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 0, 0);
  pdf.text(data.companyName || 'Your Company', margin, currentY + 5);
  currentY += 15;

  // Basic company contact (keep minimal to avoid duplication)
  pdf.setFontSize(10);
  pdf.setTextColor(100, 100, 100);
  if (data.companyEmail) {
    currentY = addText(data.companyEmail, margin, currentY);
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
  
  // From section (complete company details)
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 0, 0);
  addText('From:', margin, currentY, undefined, 12);
  currentY += 8;
  
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  currentY = addText(data.companyName || 'Your Company', margin, currentY);
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
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
  pdf.setFont('helvetica', 'bold');
  addText('Bill To:', pageWidth / 2, billToY, undefined, 12);
  billToY += 8;
  
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  billToY = addText(data.clientName || 'Client Name', pageWidth / 2, billToY);
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  if (data.clientAddress) {
    billToY = addText(data.clientAddress, pageWidth / 2, billToY, (pageWidth / 2) - margin);
  }
  if (data.clientEmail) {
    billToY = addText(data.clientEmail, pageWidth / 2, billToY);
  }

  currentY = Math.max(currentY, billToY) + 20;

  // Items table with clean layout
  const tableStartY = currentY;
  const tableWidth = pageWidth - 2 * margin;
  const colWidths = [tableWidth * 0.65, tableWidth * 0.15, tableWidth * 0.2]; // Description 65%, Qty 15%, Amount 20%
  const colX = [margin, margin + colWidths[0], margin + colWidths[0] + colWidths[1]];

  // Table header with clean styling
  pdf.setFillColor(248, 248, 248); // Light gray background
  pdf.rect(margin, currentY, tableWidth, 12, 'F');
  
  // Header borders
  pdf.setDrawColor(200, 200, 200);
  pdf.setLineWidth(0.5);
  pdf.rect(margin, currentY, tableWidth, 12);
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 0, 0);
  pdf.text('Description', colX[0] + 5, currentY + 8);
  pdf.text('Qty', colX[1] + 5, currentY + 8);
  pdf.text('Amount', colX[2] + 5, currentY + 8);
  
  currentY += 12;

  // Table rows
  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(num)) return "0.00";
    return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  if (data.items && data.items.length > 0) {
    data.items.forEach((item, index) => {
      const titleText = item.title || '';
      const descriptionText = item.description || '';
      
      // Calculate row height based on content
      let rowHeight = 20; // Base height
      if (descriptionText && descriptionText.length > 50) {
        rowHeight = 30; // Extra height for long descriptions
      }
      
      // Alternate row background
      if (index % 2 === 1) {
        pdf.setFillColor(252, 252, 252);
        pdf.rect(margin, currentY, tableWidth, rowHeight, 'F');
      }
      
      // Row borders
      pdf.setDrawColor(230, 230, 230);
      pdf.setLineWidth(0.3);
      pdf.rect(margin, currentY, tableWidth, rowHeight);
      
      // Title (bold, larger)
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(11);
      pdf.setTextColor(0, 0, 0);
      pdf.text(titleText || '', colX[0] + 5, currentY + 10);
      
      // Description (normal font, smaller, gray)
      if (descriptionText) {
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        pdf.setTextColor(80, 80, 80);
        const descLines = pdf.splitTextToSize(descriptionText, colWidths[0] - 10);
        pdf.text(descLines, colX[0] + 5, currentY + 16);
      }
      
      // Quantity (centered)
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      pdf.setTextColor(0, 0, 0);
      const qtyText = (item.quantity || 1).toString();
      const qtyWidth = pdf.getTextWidth(qtyText);
      pdf.text(qtyText, colX[1] + (colWidths[1] - qtyWidth) / 2, currentY + 10);
      
      // Amount (right-aligned)
      const lineTotal = (item.amount || 0) * (item.quantity || 1);
      const amountText = `Rs. ${formatCurrency(lineTotal)}`;
      const amountWidth = pdf.getTextWidth(amountText);
      pdf.text(amountText, colX[2] + colWidths[2] - amountWidth - 5, currentY + 10);
      
      currentY += rowHeight;
    });
  }

  // Table bottom border
  pdf.setDrawColor(200, 200, 200);
  pdf.setLineWidth(0.5);
  pdf.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 20;

  // Totals section with clean layout
  const totalsWidth = 120;
  const totalsX = pageWidth - margin - totalsWidth;
  
  // Subtotal
  if (data.subtotal && parseFloat(data.subtotal) > 0) {
    pdf.setFontSize(11);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Subtotal:', totalsX, currentY);
    const subtotalAmount = `Rs. ${formatCurrency(data.subtotal)}`;
    const subtotalWidth = pdf.getTextWidth(subtotalAmount);
    pdf.text(subtotalAmount, pageWidth - margin - subtotalWidth, currentY);
    currentY += 8;
  }
  
  // Tax
  if (data.taxRate && parseFloat(data.taxRate) > 0) {
    pdf.text(`Tax (${data.taxRate}%):`, totalsX, currentY);
    const taxAmount = `Rs. ${formatCurrency(data.taxAmount || 0)}`;
    const taxWidth = pdf.getTextWidth(taxAmount);
    pdf.text(taxAmount, pageWidth - margin - taxWidth, currentY);
    currentY += 8;
  }
  
  // Discount
  if (data.discountAmount && parseFloat(data.discountAmount) > 0) {
    pdf.text('Discount:', totalsX, currentY);
    const discountAmount = `-Rs. ${formatCurrency(data.discountAmount)}`;
    const discountWidth = pdf.getTextWidth(discountAmount);
    pdf.text(discountAmount, pageWidth - margin - discountWidth, currentY);
    currentY += 8;
  }
  
  // Total with blue highlight
  pdf.setDrawColor(37, 99, 235);
  pdf.setLineWidth(1);
  pdf.line(totalsX, currentY, pageWidth - margin, currentY);
  currentY += 5;
  
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(37, 99, 235);
  pdf.text('Total:', totalsX, currentY);
  const totalAmount = `Rs. ${formatCurrency(data.total || 0)}`;
  const totalWidth = pdf.getTextWidth(totalAmount);
  pdf.text(totalAmount, pageWidth - margin - totalWidth, currentY);
  currentY += 20;

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
