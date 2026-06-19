// ============================================
// ARAB UNITY SCHOOL
// Upload Controller
// Saves uploaded file info into RequestAttachments
// ============================================

const { poolPromise, sql } = require("../config/db");

// ============================================
// Upload Request Attachment
// POST /api/uploads/request-attachment
// ============================================

exports.uploadRequestAttachment = async (req, res) => {
  try {
    // ============================================
    // Get form data from frontend
    // ============================================

    const { requestId, pageCount, copies, totalSheets } = req.body;

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
    // Prepare attachment values
    // ============================================

    const finalPageCount = Number(pageCount) || 0;
    const finalCopies = Number(copies) || 1;
    const finalTotalSheets = Number(totalSheets) || 0;

    const originalFileName = req.file.originalname;
    const storedFileName = req.file.filename;
    const filePath = `/uploads/${storedFileName}`;
    const fileType = req.file.mimetype;
    const fileSizeKB = req.file.size / 1024;

    // ============================================
    // Save attachment info to MSSQL
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
    // Return success response
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