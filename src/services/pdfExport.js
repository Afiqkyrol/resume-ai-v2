// Client-side call to server API for Puppeteer-based PDF generation.
// Accepts data, style, template, and filename; returns void after triggering download.
export const exportToPdfServer = async ({ html, filename = "resume.pdf" }) => {
  try {
    const res = await fetch("/api/export-pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ html: removeBreakLines(html), filename }),
    });
    if (!res.ok) {
      const detail = await res.text();
      throw new Error(`Server PDF export failed (${res.status}): ${detail}`);
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch (e) {
    console.error("exportToPdfServer error:", e);
    throw e;
  }
};

// (Deprecated) Retain legacy html2canvas path for fallback or quick preview.
// You can remove this if only server-side export is desired.
export const exportToPDF = async (element, filename = "resume.pdf") => {
  if (!element) throw new Error("Missing element for exportToPDF");
  const { jsPDF } = await import("jspdf");
  const html2canvas = (await import("html2canvas-pro")).default;
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: "#ffffff",
  });
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = pdfWidth;
  const imgHeight = (canvas.height * pdfWidth) / canvas.width;
  let heightLeft = imgHeight;
  let position = 0;
  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  heightLeft -= pdfHeight;
  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;
  }
  pdf.save(filename);
};

function removeBreakLines(outerHtml) {
  return outerHtml.replace(/<div id="break-line"[\s\S]*?<\/div>/, "");
}
