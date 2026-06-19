// ============================================
// ARAB UNITY SCHOOL
// Upload Controller
// Handles file page counting and final attachment saving
// ============================================

const fs = require("fs");

const { poolPromise, sql } = require("../config/db");

// ============================================
// Import page counter utility
// PDF  = exact page count
// DOCX = estimated page count
// PPTX = slide count
// ============================================

const { countPages } = require("../utils/pageCounter");

// ============================================
// Count Uploaded File Pages
// POST /api/uploads/count-pages
// Used immediately after user selects a file
// This updates the Pages textbox before submission
// ============================================

exports.countUploadedPages = async (req, res) => {
  try {
    // ============================================
    // Validate uploaded file
    // ============================================

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    // ============================================
    // Get uploaded file information from multer
    // ============================================

    const originalFileName = req.file.originalname;
    const storedFileName = req.file.filename;
    const filePath = req.file.path;
    const fileType = req.file.mimetype;

    // ============================================
    // Debug uploaded file before counting
    // ============================================

    console.log("Counting File Path:", filePath);
    console.log("Counting Original Name:", originalFileName);
    console.log("Counting Stored Name:", storedFileName);
    console.log("Counting File Type:", fileType);

    // ============================================
    // Count pages/slides using helper
    // PDF  = exact page count
    // DOCX = estimated page count
    // PPTX = slide count
    // ============================================

    const pageCount = await countPages(filePath, originalFileName);

    // ============================================
    // Debug page count result
    // ============================================

    console.log("Detected Page Count:", pageCount);

    // ============================================
    // Optional cleanup
    // This route is only for counting before final submit
    // Final upload happens later in /request-attachment
    // ============================================

    fs.unlink(filePath, (error) => {
      if (error) {
        console.error("Temporary file cleanup error:", error.message);
      }
    });

    // ============================================
    // Return page count to frontend
    // ============================================

    return res.status(200).json({
      message: "Page count completed",
      fileName: originalFileName,
      pageCount: Number(pageCount) || 1,
    });
  } catch (error) {
    // ============================================
    // Handle page count error
    // ============================================

    console.error("Count Pages Error:", error);

    return res.status(500).json({
      message: "Failed to count pages",
      error: error.message,
    });
  }
};

// ============================================
// Upload Request Attachment
// POST /api/uploads/request-attachment
// Saves uploaded file info into RequestAttachments
// Also counts pages again before saving
// ============================================

exports.uploadRequestAttachment = async (req, res) => {
  try {
    // ============================================
    // Get form data from frontend
    // ============================================

    const { requestId, copies } = req.body;

    // ============================================
    // Validate request ID
    // ============================================

    if (!requestId) {
      return res.status(400).json({
        message: "Request ID is required",
      });
    }

    // ============================================
    // Validate uploaded file
    // ============================================

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    // ============================================
    // Prepare file information from multer
    // ============================================

    const originalFileName = req.file.originalname;
    const storedFileName = req.file.filename;
    const filePath = `/uploads/${storedFileName}`;
    const physicalFilePath = req.file.path;
    const fileType = req.file.mimetype;
    const fileSizeKB = req.file.size / 1024;

    // ============================================
    // Debug uploaded file information
    // ============================================

    console.log("Uploaded File Path:", physicalFilePath);
    console.log("Original File Name:", originalFileName);
    console.log("Stored File Name:", storedFileName);
    console.log("File Type:", fileType);

    // ============================================
    // Automatically count pages/slides again
    // This ensures the saved DB value is correct
    // ============================================

    const autoPageCount = await countPages(
      physicalFilePath,
      originalFileName
    );

    // ============================================
    // Calculate copies and total sheets
    // Current formula:
    // Total Sheets = Page Count x Copies
    // ============================================

    const finalPageCount = Number(autoPageCount) || 1;
    const finalCopies = Number(copies) || 1;
    const finalTotalSheets = finalPageCount * finalCopies;

    // ============================================
    // Debug automatic page count result
    // ============================================

    console.log("Final Page Count:", finalPageCount);
    console.log("Final Copies:", finalCopies);
    console.log("Final Total Sheets:", finalTotalSheets);

    // ============================================
    // Save attachment information to MSSQL
    // ============================================

    const pool = await poolPromise;

    await pool
      .request()
      .input("RequestId", sql.Int, Number(requestId))
      .input("OriginalFileName", sql.NVarChar, originalFileName)
      .input("StoredFileName", sql.NVarChar, storedFileName)
      .input("FilePath", sql.NVarChar, filePath)
      .input("FileType", sql.NVarChar, fileType)
      .input("FileSizeKB", sql.Decimal(10, 2), fileSizeKB)
      .input("PageCount", sql.Int, finalPageCount)
      .input("Copies", sql.Int, finalCopies)
      .input("TotalSheets", sql.Int, finalTotalSheets)
      .query(`
        INSERT INTO RequestAttachments
        (
          RequestId,
          OriginalFileName,
          StoredFileName,
          FilePath,
          FileType,
          FileSizeKB,
          PageCount,
          Copies,
          TotalSheets
        )
        VALUES
        (
          @RequestId,
          @OriginalFileName,
          @StoredFileName,
          @FilePath,
          @FileType,
          @FileSizeKB,
          @PageCount,
          @Copies,
          @TotalSheets
        )
      `);

    // ============================================
    // Return success response to frontend
    // ============================================

    return res.status(201).json({
      message: "File uploaded successfully",
      file: {
        originalName: originalFileName,
        storedName: storedFileName,
        filePath,
        fileSizeKB: Math.round(fileSizeKB),
        fileType,
        pageCount: finalPageCount,
        copies: finalCopies,
        totalSheets: finalTotalSheets,
      },
    });
  } catch (error) {
    // ============================================
    // Handle upload error
    // ============================================

    console.error("Upload Error:", error);

    return res.status(500).json({
      message: "Upload failed",
      error: error.message,
    });
  }
};