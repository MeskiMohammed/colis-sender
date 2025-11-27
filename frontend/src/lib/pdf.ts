import type { Parcel, Recipient, Shipper } from "@/pages/add";
import type City from "@/types/city";
import jsPDF from "jspdf";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { FileOpener } from "@capacitor-community/file-opener";
import autoTable from "jspdf-autotable";

type StrippedOrder = {
  id: number;
  parcelCode: string;
  recipientName: string;
  recipientCity: { id: number; name: string };
  recipientPhoneCode: string;
  recipientPhone: string;
  shipper: { name: string; phone: string; phoneCode: string; city: { name: string } };
  status: string;
  productType: string;
  parcelNumber: string;
  date: string;
  nParcels: number;
  paid: boolean;
};

type Order = Recipient & Parcel & { id: number; pics: { url: string }[]; shipper: Shipper & { city: City }; recipientCity: City; status: string; parcelCode: string };

type OrdersByCity = {
  city: string;
  orders: StrippedOrder[];
};

export async function printList(filtered: StrippedOrder[]) {
  const doc = new jsPDF(); // Create a new PDF instance
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const ordersByCity: OrdersByCity[] = [];
  const cities = [...new Set(filtered.map((order) => order.recipientCity.name))];
  cities.forEach((city) => {
    ordersByCity.push({ city, orders: filtered.filter((order) => order.recipientCity.name === city) });
  });

  // Add header image
  const headerImage = "/header.jpg"; // Replace with your image URL/base64
  const headerHeight = 30;
  const headerSpacing = 17;

  const addHeader = (cityName: string) => {
    doc.addImage(headerImage, "JPEG", 10, 10, pageWidth - 20, headerHeight);
    doc.setFontSize(12);
    doc.text(`Ville: ${cityName}`, 13, headerHeight + headerSpacing + 3);
    doc.text(`Le: ${new Date().toLocaleDateString()}`, pageWidth - 45, headerHeight + headerSpacing + 3);
  };

  ordersByCity.forEach((cityOrders, index: number) => {
    if (index > 0) doc.addPage();
    addHeader(cityOrders.city);

    const tableRows = cityOrders.orders.map((order: StrippedOrder) => [order.parcelNumber + "/" + order.nParcels, order.recipientName, order.recipientCity.name, order.recipientPhoneCode + " " + order.recipientPhone, order.shipper.phoneCode + " " + order.shipper.phone, order.paid ? "Oui" : "Non"]);

    const tableColumns = ["N°", "Nom dest.", "Ville dest.", "Téléphone dest.", "Téléphone exp.", "Payée"];

    autoTable(doc, {
      head: [tableColumns],
      body: tableRows,
      startY: headerHeight + headerSpacing + 8,
      theme: "grid",
      headStyles: {
        textColor: [255, 255, 255],
        fontSize: 12,
        halign: "center",
      },
      styles: {
        cellPadding: 3,
        fontSize: 10,
        textColor: "black",
      },
      columnStyles: {
        5: { halign: "center" },
      },
      bodyStyles: {
        textColor: "black",
      },
      didParseCell: (data) => {
        if (data.column.index === 5) {
          if (data.cell.raw === "Oui") {
            data.cell.styles.textColor = [0, 0, 255];
          } else if (data.cell.raw === "Non") {
            data.cell.styles.textColor = [255, 0, 0];
          }
        }
      },
      didDrawPage: () => {
        const pageNumber = `${(doc.internal as any).getNumberOfPages()}`;
        doc.setFontSize(10);
        doc.text(`Page ${pageNumber}`, pageWidth / 2, pageHeight - 10, { align: "center" });
      },
    });
  });

  // const pdfUrl = doc.output("bloburl");
  // window.open(pdfUrl, "_blank");
  // return;
  // doc.save("Order-Invoice.pdf");
  // Convert PDF to base64
  const pdfBase64 = doc.output("datauristring").split(",")[1];

  // Save PDF to the device's filesystem
  const fileName = `Order-Invoice-${new Date().getTime()}.pdf`;
  const result = await Filesystem.writeFile({
    path: fileName,
    data: pdfBase64,
    directory: Directory.Documents,
  });

  console.log("PDF saved to:", result.uri);

  // Open the PDF using the FileOpener plugin
  try {
    await FileOpener.open({
      filePath: result.uri,
      contentType: "application/pdf",
    });
    console.log("PDF opened successfully");
  } catch (error) {
    console.error("Error opening PDF", error);
  }
}

export async function printElement(order: Order) {
  const doc = new jsPDF("l", "mm", [54, 86]); // A8 landscape: 52x74mm, but a bit larger for margins
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  async function toBase64(url: string) {
    const res = await fetch(url);
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  }

  const logoImg = (await toBase64("/casmoh-logo.png")) as string;
  const qrImg = (await toBase64("/qr.png")) as string;

  // Data
  const nColis = String(order.parcelNumber).padStart(4, "0") + "/" + order.nParcels;
  const nom = order.recipientName;
  const tel = order.recipientPhoneCode + " " + order.recipientPhone;
  const ville = order.recipientCity.name;
  const pays = order.shipper.country === "Morocco" ? "France" : "Maroc";

  // Draw outer border
  doc.setLineWidth(0.5);
  doc.rect(2, 2, pageWidth - 4, pageHeight - 4);

  // Logo and company info
  doc.addImage(logoImg, "PNG", 4, 4, 25, 10);

  // Company contacts
  doc.setFontSize(4.2);
  doc.text("France : +33 (0) 6 58 88 18 09", 60, 6);
  doc.text("Maroc : +212 (0) 6 00 43 42 01", 60, 9);
  doc.text("Site Web : www.casmoh.com", 60, 12);

  // DESTINATAIRE box
  doc.setLineWidth(0.2);
  doc.rect(4, 16, 45, 20);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6);
  doc.text("DESTINATAIRE", 6, 20);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(5);
  let yStart = 24; // Start a bit lower
  let lineGap = 3; // Reduce gap
  doc.text(`Nom : ${nom}`, 6, yStart);
  doc.text(`Téléphone : ${tel}`, 6, yStart + lineGap);
  doc.text(`Ville : ${ville}`, 6, yStart + 2 * lineGap);
  doc.text(`Pays : ${pays}`, 6, yStart + 3 * lineGap);

  // QR code box (make QR square and centered)
  doc.rect(51, 16, 25, 20);
  // Center QR in the box: box is 25x20, QR is 14x14
  const qrSize = 14;
  const qrX = 51 + (25 - qrSize) / 2;
  const qrY = 16 + (20 - qrSize) / 2;
  doc.addImage(qrImg, "PNG", qrX, qrY, qrSize, qrSize);

  // N° COLIS box
  doc.rect(4, 38, 45, 10);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("N° COLIS :", 7, 44);
  doc.setFont("courier", "bold");
  doc.text(nColis, 25, 44);

  // "P" and Merci box
  doc.rect(51, 38, 25, 10);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(order.paid ? "P" : "N", 54, 45);
  doc.setFontSize(5);
  doc.setFont("helvetica", "normal");
  doc.text("Merci\npour\nVotre\nConfiance", 65, 41);
  // doc.save("Order-Invoice.pdf");

  // const pdfUrl = doc.output("bloburl");
  // window.open(pdfUrl, "_blank");
  // return;

  // Save and open as before
  const pdfBase64 = doc.output("datauristring").split(",")[1];
  const fileName = `Ticket-Colis-${new Date().getTime()}.pdf`;

  const result = await Filesystem.writeFile({
    path: fileName,
    data: pdfBase64,
    directory: Directory.Documents,
  });
  try {
    await FileOpener.open({
      filePath: result.uri,
      contentType: "application/pdf",
    });
  } catch (error) {
    console.error("Error opening PDF", error);
  }
}
