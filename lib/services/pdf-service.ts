import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { Sale, SaleItem } from "@/lib/types";
import { formatCurrency, formatDate, formatNumber } from "@/utils/utils";
import { TypePrice } from "@/lib/enums";

// Helper types for jsPDF with autoTable
type JsPDFWithAutoTable = jsPDF & {
  lastAutoTable?: { finalY: number };
};

export class PdfService {
  private doc: JsPDFWithAutoTable;

  constructor() {
    this.doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [298, 80],
    }) as JsPDFWithAutoTable;
    this.setupFonts();
  }

  /**
   * Generate a PDF for a sale
   */
  generateSalePdf(sale: Sale): string {
    this.doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [298, 80],
    }) as JsPDFWithAutoTable;
    this.setupFonts();

    let y = 10;
    this.doc.setFontSize(12);
    this.doc.setFont("milk", "normal");
    this.doc.text("Aka-Uka", 40, y, { align: "center" });
    y += 12;
    this.doc.setFontSize(10);
    this.doc.setFont("PTSans", "normal");
    this.doc.text("SOTUV CHEKI", 40, y, { align: "center" });
    y += 8;

    // Sale info
    this.doc.setFontSize(8);
    this.doc.text(`Chek raqami: #${sale.id}`, 5, y);
    this.doc.text(
      `Sana: ${formatDate(new Date(sale.sale_date), "dd.MM.yyyy")}`,
      50,
      y,
    );
    y += 4;

    // Table setup
    const tableData = sale.sale_items.map(item => [
      item.product.name,
      item.quantity,
      formatNumber(item.price),
      formatNumber(item.total_price),
    ]);

    autoTable(this.doc, {
      startY: y,
      margin: { horizontal: 1 },
      head: [["Nomi", "Miqdor", "Narx", "Summa"]],
      body: tableData,
      theme: "plain",
      styles: {
        font: "Roboto",
        fontSize: 8,
        cellPadding: 1,
        lineWidth: 0.3,
        lineColor: 0,
      },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 12, halign: "center" },
        2: { cellWidth: 15, halign: "right" },
        3: { cellWidth: 20, halign: "right" },
      },
    });

    // Total amount
    const finalY = (this.doc.lastAutoTable?.finalY || 0) + 5;
    this.doc.setFont("Roboto", "bold");
    this.doc.text(`Jami: ${formatNumber(sale.total_sum)}`, 56, finalY);

    // Footer
    this.doc.setFontSize(8);
    this.doc.setFont("Roboto", "normal");
    this.doc.text("Xaridingiz uchun rahmat!", 63, finalY + 6, {
      align: "center",
    });

    // Generate PDF as Base64
    return this.doc.output("dataurlstring");
  }

  getDoc(): JsPDFWithAutoTable {
    return this.doc;
  }

  /**
   * Configure fonts for the PDF
   */
  private setupFonts(): void {
    this.doc.addFont("/fonts/PTSansDemo.ttf", "PTSans", "normal");
    this.doc.addFont("/fonts/milk.ttf", "milk", "normal");
    this.doc.addFont("/fonts/Roboto/Roboto-Regular.ttf", "Roboto", "normal");
    this.doc.addFont("/fonts/Roboto/Roboto-Bold.ttf", "Roboto", "bold");

    this.doc.setFont("Roboto", "normal");
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
    const tableStartY = this.doc.lastAutoTable?.finalY || 85;

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
    const finalY = (this.doc.lastAutoTable?.finalY || 0) + 10;

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
