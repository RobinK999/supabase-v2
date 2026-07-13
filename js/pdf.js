async function exportPDF() {
  const { jsPDF } = window.jspdf;

  const table = document.getElementById("tabelle");
  const pdf = new jsPDF("l", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // === Logo laden ===
  const logoUrl = "ccc_bg.jpeg";
  const loadImage = (src) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });

  let logoWidth = 0,
    logoHeight = 0;
  try {
    const logoImg = await loadImage(logoUrl);
    const aspect = logoImg.width / logoImg.height;
    logoHeight = 15; // mm
    logoWidth = logoHeight * aspect;
    pdf.addImage(logoImg, "JPEG", 10, 8, logoWidth, logoHeight);
  } catch (e) {
    console.warn("Logo konnte nicht geladen werden:", e);
  }

  // === Titel & Datum ===
  const titel = "Strafen Kegeln – Cone Club Coesfeld";
  const datum = new Date().toLocaleDateString("de-DE");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(18);
  pdf.text(titel, pageWidth / 2, 15, { align: "center" });
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.text(`Datum: ${datum}`, pageWidth - 10, 18, { align: "right" });

  // ===== Inhalt für Screenshot: Zähler + Tabellen-Klon =====
  const alle9Val = document.getElementById("alle9Count")?.textContent ?? "0";
  const kranzVal = document.getElementById("kranzCount")?.textContent ?? "0";
  const marvinVal = document.getElementById("MarvinCount")?.textContent ?? "0";
  const leonVal = document.getElementById("LeonCount")?.textContent ?? "0";

  // Offscreen Wrapper erstellen
  const wrapper = document.createElement("div");
  wrapper.style.position = "fixed";
  wrapper.style.left = "-10000px";
  wrapper.style.top = "0";
  wrapper.style.background = "#ffffff";
  wrapper.style.padding = "10px";
  wrapper.style.boxSizing = "border-box";
  wrapper.style.width = table.offsetWidth + "px";

  // Zählerzeile (über der Tabelle im Screenshot)
  const info = document.createElement("div");
  info.style.display = "flex";
  info.style.justifyContent = "space-between";
  info.style.alignItems = "center";
  info.style.fontSize = "16px";
  info.style.fontWeight = "700";
  info.style.marginBottom = "10px";
  info.innerHTML = `
    <div>Alle 9: <span>${alle9Val}</span> &nbsp;&nbsp;|&nbsp;&nbsp; Kranz: <span>${kranzVal}</span></div>
    <div>Team Marvin: <span>${marvinVal}</span> &nbsp;&nbsp;|&nbsp;&nbsp; Team Leon: <span>${leonVal}</span></div>
  `;
  wrapper.appendChild(info);

  // Tabelle klonen (Safari-safe: sticky aus)
  const clone = table.cloneNode(true);
  clone.querySelectorAll("th").forEach((th) => (th.style.position = "static"));

  // "Gezahlte Strafen" größer im PDF (nur im Klon)
  clone.querySelectorAll("tbody tr").forEach((r) => {
    const first = r.cells?.[0]?.textContent || "";
    if (first.includes("Gezahlte Strafen")) {
      r.style.fontSize = "20px";
      r.style.fontWeight = "800";
      Array.from(r.cells).forEach((td) => {
        td.style.paddingTop = "14px";
        td.style.paddingBottom = "14px";
      });
    }
  });

  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);

  // kurze Pause für Safari Layout
  await new Promise((r) => setTimeout(r, 80));

  // iPad: moderat, Desktop: höher
  const isIPad =
    /iPad|Macintosh/.test(navigator.userAgent) && "ontouchend" in document;
  const captureScale = isIPad ? 1.5 : 3;

  const canvas = await html2canvas(wrapper, {
    scale: captureScale,
    useCORS: true,
    backgroundColor: "#ffffff",
    scrollX: 0,
    scrollY: 0,
  });

  wrapper.remove();

  const imgData = canvas.toDataURL("image/png");

  // === Tabelle+Zähler ins PDF einfügen (unter Header) ===
  const imgWidth = pageWidth - 20;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  let y = 28;

  if (imgHeight <= pageHeight - y - 10) {
    // passt auf eine Seite
    pdf.addImage(imgData, "PNG", 10, y, imgWidth, imgHeight);
  } else {
    // mehrseitig
    let position = 0;
    const usableHeightMm = pageHeight - y - 10;
    const pageHeightPx = (canvas.height * usableHeightMm) / imgHeight;

    while (position < canvas.height) {
      const pageCanvas = document.createElement("canvas");
      pageCanvas.width = canvas.width;
      pageCanvas.height = pageHeightPx;

      const ctx = pageCanvas.getContext("2d");
      ctx.drawImage(canvas, 0, -position);

      const pageData = pageCanvas.toDataURL("image/png");
      pdf.addImage(pageData, "PNG", 10, y, imgWidth, usableHeightMm);

      position += pageHeightPx;
      if (position < canvas.height) pdf.addPage();
    }
  }

  // === Footer ===
  pdf.setFontSize(9);
  pdf.text(
    "Erstellt mit der Kegel-App – Cone Club Coesfeld",
    pageWidth / 2,
    pageHeight - 6,
    { align: "center" }
  );

  // === PDF speichern ===
  pdf.save(`Kegel_Stand_${datum}.pdf`);
}
