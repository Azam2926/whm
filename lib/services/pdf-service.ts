import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { Sale, SaleItem } from "@/lib/types";
import { formatCurrency, formatDate, formatNumber } from "@/utils/utils";
import { TypePrice } from "@/lib/enums";

// Helper types for jsPDF with autoTable
type JsPDFWithAutoTable = jsPDF & {
  previousAutoTable?: { finalY: number };
};

export class PdfService {
  private doc: JsPDFWithAutoTable;

  constructor() {
    this.doc = new jsPDF({
      orientation: "portrait",
      format: [12, 3.15],
    }) as JsPDFWithAutoTable;
    this.setupFonts();
  }

  /**
   * Configure fonts for the PDF
   */
  private setupFonts(): void {
    // Use standard fonts for now
    // Future implementation can add proper Unicode support for Uzbek
    this.doc.setFont("helvetica");
  }

  /**
   * Generate a PDF for a sale
   */
  generateSalePdf(sale: Sale): string {
    this.doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [80, 300], // 80mm width, height auto-expands
    });

    let y = 10;
    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(12);
    this.doc.text("TASHKENT METAL", 40, y, { align: "center" });
    y += 6;
    this.doc.setFontSize(10);
    this.doc.text("KASSA CHEK", 40, y, { align: "center" });
    y += 4;

    // Sale info
    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(8);
    this.doc.text(`Chek raqami: ${sale.id}`, 5, y);
    this.doc.text(`Sana: ${new Date().toLocaleDateString()}`, 55, y);
    y += 6;

    // Table setup
    const tableData = sale.sale_items.map(item => [
      item.product.name,
      item.quantity,
      item.price.toLocaleString(),
      item.total_price.toLocaleString(),
    ]);

    autoTable(this.doc, {
      startY: y,
      head: [["Nomi", "Miqdor", "Narx", "Summa"]],
      body: tableData,
      theme: "grid",
      styles: { fontSize: 8, cellPadding: 1 },
      columnStyles: {
        0: { cellWidth: 35 },
        1: { cellWidth: 10, halign: "center" },
        2: { cellWidth: 15, halign: "right" },
        3: { cellWidth: 20, halign: "right" },
      },
    });

    // Total amount
    const finalY = (this.doc.previousAutoTable?.finalY || 0) + 5;
    this.doc.setFont("helvetica", "bold");
    this.doc.text(`JAMI: ${sale.total_sum.toLocaleString()} UZS`, 5, finalY);

    // Footer
    this.doc.setFontSize(8);
    this.doc.setFont("helvetica", "normal");
    this.doc.text("Xaridingiz uchun rahmat!", 40, finalY + 6, {
      align: "center",
    });

    // Generate PDF as Base64
    return this.doc.output("dataurlstring");
  }

  /**
   * Add header to the PDF
   */
  private addHeader(sale: Sale): void {
    const centerX = this.doc.internal.pageSize.width / 2;

    // Company logo and name
    this.doc.setFontSize(20);
    this.doc.setTextColor(41, 128, 185);
    this.doc.text("WAREHOUSE MANAGEMENT", centerX, 20, { align: "center" });

    // Invoice title
    this.doc.setFontSize(16);
    this.doc.setTextColor(0, 0, 0);
    this.doc.text("SOTUV CHEKI", centerX, 30, { align: "center" });

    // Sale information
    this.doc.setFontSize(10);
    this.doc.text(`Chek raqami: #${sale.id}`, 14, 40);
    this.doc.text(
      `Sana: ${formatDate(sale.sale_date || "", "dd MMMM, yyyy")}`,
      14,
      45,
    );
    this.doc.text(`Holati: ${sale.status}`, 14, 50);
  }

  /**
   * Add customer information to the PDF
   */
  private addCustomerInfo(sale: Sale): void {
    if (!sale.customer) return;

    this.doc.setFontSize(10);
    let yPos = 60;
    const lineHeight = 5;

    this.doc.text("Mijoz ma'lumotlari:", 14, yPos);
    yPos += lineHeight;
    this.doc.text(`Nomi: ${sale.customer.name}`, 14, yPos);
    yPos += lineHeight;

    if (sale.customer.phone_number) {
      this.doc.text(`Telefon: ${sale.customer.phone_number}`, 14, yPos);
      yPos += lineHeight;
    }

    if (sale.customer.address) {
      this.doc.text(`Manzil: ${sale.customer.address}`, 14, yPos);
    }
  }

  /**
   * Add sale items table to the PDF
   */
  private addSaleItemsTable(saleItems: SaleItem[]): void {
    const tableStartY = this.doc.previousAutoTable?.finalY || 85;

    const tableBody = saleItems.map(item => {
      const additionalInfo =
        item.product.type_price === TypePrice.USD
          ? `Kurs: ${formatNumber(item.total_price / (item.quantity * item.product.price))}`
          : "";

      return [
        item.product.name,
        item.quantity.toString(),
        formatCurrency(item.price, item.product.type_price),
        formatCurrency(item.total_price),
        additionalInfo,
      ];
    });

    autoTable(this.doc, {
      startY: tableStartY,
      head: [["Mahsulot", "Miqdori", "Narxi", "Jami", "Qo'shimcha"]],
      body: tableBody,
      theme: "grid",
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: "bold",
        halign: "center",
      },
      styles: {
        overflow: "linebreak",
        cellPadding: 4,
      },
      columnStyles: {
        0: { cellWidth: 60 },
        4: { cellWidth: 40, fontStyle: "italic", textColor: [100, 100, 100] },
      },
    });
  }

  /**
   * Add summary information to the PDF
   */
  private addSummary(sale: Sale): void {
    const finalY = (this.doc.previousAutoTable?.finalY || 0) + 10;

    this.doc.setFontSize(12);
    this.doc.setFont("helvetica", "bold");
    this.doc.text(
      `Umumiy summa: ${formatCurrency(sale.total_sum)}`,
      14,
      finalY,
    );

    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(10);
    this.doc.text(`To'lov turi: ${sale.status}`, 14, finalY + 7);
  }

  /**
   * Add footer to the PDF
   */
  private addFooter(): void {
    const pageCount = this.doc.getNumberOfPages();
    const pageWidth = this.doc.internal.pageSize.width;
    const pageHeight = this.doc.internal.pageSize.height;

    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i);
      this.doc.setFontSize(8);

      // Page number
      this.doc.text(
        `Sahifa ${i} / ${pageCount}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: "center" },
      );

      // Timestamp
      const now = new Date();
      this.doc.text(
        `Yaratilgan vaqt: ${formatDate(now.toISOString(), "dd.MM.yyyy HH:mm")}`,
        pageWidth - 15,
        pageHeight - 10,
        { align: "right" },
      );

      // Company info
      this.doc.text("Warehouse Management System", 15, pageHeight - 10, {
        align: "left",
      });
    }
  }
}

// Create a singleton instance
export const pdfService = new PdfService();
