/* eslint-disable @typescript-eslint/no-explicit-any */
import PDFDocument from "pdfkit";
import AppError from "../errorHanlers/AppError";

export interface IInvoiceData {
  transactionId: string;
  bookingDate: Date;
  userName: string;
  tourTitle: string;
  guestCount: number;
  totalAmount: number;
}

export const generatePdf = async (invoiceData: IInvoiceData): Promise<Buffer<ArrayBufferLike>> => {

  try {

    return await new Promise((resolve, reject) => {
      
      const doc = new PDFDocument({ size: "A4", margin: 50 });

      const buffers: Uint8Array[] = [];

      doc.on("data", (chunk) => buffers.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", reject);

      // ======================
      // Helpers
      // ======================
      const formatCurrency = (amount: number) =>
        new Intl.NumberFormat("en-BD", {
          style: "currency",
          currency: "BDT",
        }).format(amount);

      const drawLine = (y: number) => {
        doc
          .strokeColor("#cccccc")
          .lineWidth(1)
          .moveTo(50, y)
          .lineTo(550, y)
          .stroke();
      };

      // ======================
      // Header
      // ======================
      doc
        .fontSize(22)
        .font("Helvetica-Bold")
        .text("INVOICE", 50, 50);

      doc
        .fontSize(10)
        .font("Helvetica")
        .text("Your Company Name", 400, 50, { align: "right" })
        .text("support@yourcompany.com", 400, 65, { align: "right" })
        .text("Dhaka, Bangladesh", 400, 80, { align: "right" });

      drawLine(100);

      // ======================
      // Invoice Info
      // ======================
      doc
        .fontSize(10)
        .text(`Transaction ID: ${invoiceData.transactionId}`, 50, 120)
        .text(`Booking Date: ${invoiceData.bookingDate}`, 50, 135);

      doc
        .text(`Customer: ${invoiceData.userName}`, 350, 120, {
          align: "right",
        });

      // ======================
      // Table Header
      // ======================
      const tableTop = 180;

      doc
        .font("Helvetica-Bold")
        .fontSize(12)
        .text("Description", 50, tableTop)
        .text("Guests", 300, tableTop, { width: 90, align: "right" })
        .text("Amount", 400, tableTop, { width: 100, align: "right" });

      drawLine(tableTop + 15);

      // ======================
      // Table Row
      // ======================
      const rowY = tableTop + 30;

      doc
        .font("Helvetica")
        .fontSize(11)
        .text(invoiceData.tourTitle, 50, rowY)
        .text(invoiceData.guestCount.toString(), 300, rowY, {
          width: 90,
          align: "right",
        })
        .text(formatCurrency(invoiceData.totalAmount), 400, rowY, {
          width: 100,
          align: "right",
        });

      drawLine(rowY + 20);

      // ======================
      // Summary
      // ======================
      const summaryTop = rowY + 40;

      doc
        .font("Helvetica")
        .fontSize(11)
        .text("Total:", 350, summaryTop)
        .font("Helvetica-Bold")
        .text(formatCurrency(invoiceData.totalAmount), 400, summaryTop, {
          width: 100,
          align: "right",
        });

      // ======================
      // Footer
      // ======================
      doc
        .font("Helvetica")
        .fontSize(10)
        .text("Thank you for booking with us!", 50, 750, {
          align: "center",
          width: 500,
        });

      doc.end();
    });
  } catch (error: any) {
    throw new AppError(500, `PDF creation error - ${error.message}`);
  }
};