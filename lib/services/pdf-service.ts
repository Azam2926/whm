import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { Sale, SaleItem } from "@/lib/types";
import { formatCurrency, formatDate, formatNumber } from "@/utils/utils";
import { TypePrice } from "@/lib/enums";

// Add Uzbek font support
// import { addFonts } from "./pdf-fonts";

export class PdfService {
  private doc: jsPDF & { previousAutoTable?: { finalY: number } };

  constructor() {
    this.doc = new jsPDF();
    // Add custom fonts to support Uzbek characters
    // addFonts(this.doc);
    // this.doc.setFont("Roboto");
  }

  /**
   * Generate a PDF for a sale
   */
  generateSalePdf(sale: Sale): string {
    // Set up document
    this.doc = new jsPDF();
    // addFonts(this.doc);
    // this.doc.setFont("Roboto");

    // Add header
    this.addHeader(sale);

    // Add customer information
    this.addCustomerInfo(sale);

    // Add sale items table
    this.addSaleItemsTable(sale.sale_items);

    // Add summary
    this.addSummary(sale);

    // Add footer
    this.addFooter();

    // Return the PDF as a data URL
    return this.doc.output("datauristring");
  }

  /**
   * Add header to the PDF
   */
  private addHeader(sale: Sale): void {
    // Company logo and name
    this.doc.setFontSize(20);
    this.doc.setTextColor(41, 128, 185);
    this.doc.text("WAREHOUSE MANAGEMENT", 105, 20, { align: "center" });

    // Invoice title
    this.doc.setFontSize(16);
    this.doc.setTextColor(0, 0, 0);
    this.doc.text("SOTUV CHEKI", 105, 30, { align: "center" });

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
    if (sale.customer) {
      this.doc.setFontSize(10);
      this.doc.text("Mijoz ma'lumotlari:", 14, 60);
      this.doc.text(`Nomi: ${sale.customer.name}`, 14, 65);

      if (sale.customer.phone_number) {
        this.doc.text(`Telefon: ${sale.customer.phone_number}`, 14, 70);
      }

      if (sale.customer.address) {
        this.doc.text(`Manzil: ${sale.customer.address}`, 14, 75);
      }
    }
  }

  /**
   * Add sale items table to the PDF
   */
  private addSaleItemsTable(saleItems: SaleItem[]): void {
    const tableStartY = this.doc.previousAutoTable?.finalY || 85;

    const tableBody = saleItems.map(item => [
      item.product.name,
      item.quantity.toString(),
      formatCurrency(item.price, item.product.type_price),
      formatCurrency(item.total_price),
      item.product.type_price === TypePrice.USD
        ? `Kurs: ${formatNumber(item.total_price / (item.quantity * item.product.price))}`
        : "",
    ]);

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
        // font: "Roboto",
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
    // this.doc.setFont("Roboto", "bold");
    this.doc.text(
      `Umumiy summa: ${formatCurrency(sale.total_sum)}`,
      14,
      finalY,
    );

    // this.doc.setFont("Roboto", "normal");
    this.doc.setFontSize(10);
    this.doc.text(`To'lov turi: ${sale.status}`, 14, finalY + 7);
  }

  /**
   * Add footer to the PDF
   */
  private addFooter(): void {
    const pageCount = this.doc.getNumberOfPages();

    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i);

      // Add page number
      this.doc.setFontSize(8);
      this.doc.text(
        `Sahifa ${i} / ${pageCount}`,
        this.doc.internal.pageSize.width / 2,
        this.doc.internal.pageSize.height - 10,
        { align: "center" },
      );

      // Add timestamp
      const now = new Date();
      this.doc.text(
        `Yaratilgan vaqt: ${formatDate(now.toISOString(), "dd.MM.yyyy HH:mm")}`,
        this.doc.internal.pageSize.width - 15,
        this.doc.internal.pageSize.height - 10,
        { align: "right" },
      );

      // Add company info
      this.doc.text(
        "Warehouse Management System",
        15,
        this.doc.internal.pageSize.height - 10,
        { align: "left" },
      );
    }
  }
}

// Create a singleton instance
export const pdfService = new PdfService();
