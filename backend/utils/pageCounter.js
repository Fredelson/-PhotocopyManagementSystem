// ============================================
// ARAB UNITY SCHOOL
// Page Counter Utility
// Counts PDF / DOCX / PPTX pages
// ============================================

const mammoth = require("mammoth");
const AdmZip = require("adm-zip");

// ============================================
// Count pages from uploaded file
// PDF  = exact page count using pdfjs-dist
// DOCX = estimated page count
// PPTX = slide count
// ============================================

const countPages = async (filePath, originalName) => {
  try {
    const fileName = originalName.toLowerCase();

    // ============================================
    // PDF exact page count
    // ============================================

    // ============================================
// PDF exact page count
// pdfjs needs file data, not file path
// ============================================

      if (fileName.endsWith(".pdf")) {
        const fs = require("fs");
        const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");

        const buffer = fs.readFileSync(filePath);
        const uint8Array = new Uint8Array(buffer);

        const loadingTask = pdfjs.getDocument({
          data: uint8Array,
        });

        const pdf = await loadingTask.promise;

        return pdf.numPages || 1;
      }

    // ============================================
    // DOCX estimated page count
    // ============================================

    if (fileName.endsWith(".docx")) {
      const result = await mammoth.extractRawText({
        path: filePath,
      });

      const text = result.value || "";
      const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

      return Math.max(1, Math.ceil(wordCount / 450));
    }

    // ============================================
    // PPTX slide count
    // ============================================

    if (fileName.endsWith(".pptx")) {
      const zip = new AdmZip(filePath);

      const slides = zip
        .getEntries()
        .filter((entry) =>
          /^ppt\/slides\/slide\d+\.xml$/.test(entry.entryName)
        );

      return Math.max(1, slides.length);
    }

    // ============================================
    // Unsupported file type fallback
    // ============================================

    return 1;
  } catch (error) {
    console.error("Page Count Error:", error);
    return 1;
  }
};

module.exports = {
  countPages,
};