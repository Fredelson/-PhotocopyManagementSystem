// ============================================
// ARAB UNITY SCHOOL
// Printing Admin Controller
// Handles print queue, printing progress,
// completion, printing logs, and inventory deduction
// ============================================

const { poolPromise, sql } = require("../config/db");

/**
 * @desc    Printing Dashboard Statistics
 * @route   GET /api/printing/dashboard
 * @access  Private - PrintingAdmin / SuperAdmin
 */
const getPrintingDashboard = async (req, res) => {
  try {
    const printingAdminId = req.user.id;
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("printingAdminId", sql.Int, printingAdminId)
      .query(`
        SELECT
          COUNT(*) AS TotalAssigned,

          SUM(CASE
            WHEN Status IN (
              'Approved by HOD',
              'Approved by HOS',
              'Forwarded to Printing'
            )
             AND CurrentApproverId = @printingAdminId
            THEN 1 ELSE 0
          END) AS PendingPrintQueue,

          SUM(CASE
            WHEN Status = 'Printing'
             AND CurrentApproverId = @printingAdminId
            THEN 1 ELSE 0
          END) AS InProgress,

          SUM(CASE
            WHEN Status = 'Completed'
            THEN 1 ELSE 0
          END) AS Completed,

          SUM(CASE
            WHEN Status = 'Completed'
             AND CAST(CompletedAt AS DATE) = CAST(GETDATE() AS DATE)
            THEN 1 ELSE 0
          END) AS CompletedToday

        FROM PhotocopyRequests
        WHERE CurrentApproverId = @printingAdminId
           OR Status = 'Completed'
      `);

    return res.status(200).json(result.recordset[0]);
  } catch (error) {
    console.error("Get Printing Dashboard Error:", error);

    return res.status(500).json({
      message: "Server error while fetching printing dashboard",
      error: error.message,
    });
  }
};

/**
 * @desc    Get requests assigned to Printing Admin
 * @route   GET /api/printing/requests
 * @access  Private - PrintingAdmin / SuperAdmin
 */
const getPrintingRequests = async (req, res) => {
  try {
    const printingAdminId = req.user.id;
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("printingAdminId", sql.Int, printingAdminId)
      .query(`
        SELECT
          r.RequestId,
          r.RequestNumber,
          r.Copies,
          r.TotalPages,
          r.TotalSheets,
          r.PriorityLevel,
          r.Status,
          r.SubmittedAt,
          r.ApprovedAt,
          r.PrintedAt,
          r.CompletedAt,
          r.PaperSize,
          r.PrintType,
          r.PrintSide,
          r.DueDate,
          r.IsExam,
          r.Remarks AS RequestRemarks,

          teacher.FullName AS TeacherName,
          teacher.EmployeeId,

          d.DepartmentName,
          s.SubjectName,
          p.PurposeName

        FROM PhotocopyRequests r

        LEFT JOIN Users teacher
          ON r.TeacherId = teacher.UserId

        LEFT JOIN Departments d
          ON r.DepartmentId = d.DepartmentId

        LEFT JOIN Subjects s
          ON r.SubjectId = s.SubjectId

        LEFT JOIN Purposes p
          ON r.PurposeId = p.PurposeId

        WHERE r.CurrentApproverId = @printingAdminId
          AND r.Status IN (
            'Approved by HOD',
            'Approved by HOS',
            'Forwarded to Printing',
            'Printing'
          )

        ORDER BY
          CASE
            WHEN r.PriorityLevel = 'Urgent' THEN 1
            WHEN r.PriorityLevel = 'High' THEN 2
            ELSE 3
          END,
          r.SubmittedAt ASC
      `);

    return res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Get Printing Requests Error:", error);

    return res.status(500).json({
      message: "Server error while fetching printing requests",
      error: error.message,
    });
  }
};

/**
 * @desc    Get single printing request details
 * @route   GET /api/printing/requests/:id
 * @access  Private - PrintingAdmin / SuperAdmin
 */
const getPrintingRequestById = async (req, res) => {
  try {
    const printingAdminId = req.user.id;
    const requestId = req.params.id;
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("requestId", sql.Int, requestId)
      .input("printingAdminId", sql.Int, printingAdminId)
      .query(`
        SELECT
          r.RequestId,
          r.RequestNumber,
          r.Copies,
          r.TotalPages,
          r.TotalSheets,
          r.PriorityLevel,
          r.Status,
          r.SubmittedAt,
          r.ApprovedAt,
          r.PrintedAt,
          r.CompletedAt,
          r.PaperSize,
          r.PrintType,
          r.PrintSide,
          r.DueDate,
          r.IsExam,
          r.Remarks AS RequestRemarks,

          teacher.FullName AS TeacherName,
          teacher.EmployeeId,

          d.DepartmentName,
          s.SubjectName,
          p.PurposeName

        FROM PhotocopyRequests r

        LEFT JOIN Users teacher
          ON r.TeacherId = teacher.UserId

        LEFT JOIN Departments d
          ON r.DepartmentId = d.DepartmentId

        LEFT JOIN Subjects s
          ON r.SubjectId = s.SubjectId

        LEFT JOIN Purposes p
          ON r.PurposeId = p.PurposeId

        WHERE r.RequestId = @requestId
          AND (
            r.CurrentApproverId = @printingAdminId
            OR r.Status = 'Completed'
          )
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        message: "Request not found or not assigned to this Printing Admin",
      });
    }

    return res.status(200).json(result.recordset[0]);
  } catch (error) {
    console.error("Get Printing Request By ID Error:", error);

    return res.status(500).json({
      message: "Server error while fetching printing request details",
      error: error.message,
    });
  }
};

/**
 * @desc    Start printing request
 * @route   PUT /api/printing/requests/:id/start
 * @access  Private - PrintingAdmin / SuperAdmin
 */
const startPrinting = async (req, res) => {
  try {
    const printingAdminId = req.user.id;
    const requestId = req.params.id;
    const pool = await poolPromise;

    const requestResult = await pool
      .request()
      .input("requestId", sql.Int, requestId)
      .input("printingAdminId", sql.Int, printingAdminId)
      .query(`
        SELECT RequestId
        FROM PhotocopyRequests
        WHERE RequestId = @requestId
          AND CurrentApproverId = @printingAdminId
          AND Status IN (
            'Approved by HOD',
            'Approved by HOS',
            'Forwarded to Printing'
          )
      `);

    if (requestResult.recordset.length === 0) {
      return res.status(404).json({
        message:
          "Request not found, already started, or not assigned to this Printing Admin",
      });
    }

    await pool
      .request()
      .input("requestId", sql.Int, requestId)
      .query(`
        UPDATE PhotocopyRequests
        SET
          Status = 'Printing',
          PrintedAt = GETDATE()
        WHERE RequestId = @requestId
      `);

    return res.status(200).json({
      success: true,
      message: "Printing started successfully.",
    });
  } catch (error) {
    console.error("Start Printing Error:", error);

    return res.status(500).json({
      message: "Server error while starting printing",
      error: error.message,
    });
  }
};

/**
 * @desc    Complete printing request
 * @route   PUT /api/printing/requests/:id/complete
 * @access  Private - PrintingAdmin / SuperAdmin
 *
 * Logic:
 * 1. Validate request is assigned and currently Printing
 * 2. Get PaperSize and TotalSheets
 * 3. Check PaperInventory stock
 * 4. Deduct stock
 * 5. Insert InventoryTransactions log
 * 6. Mark request Completed
 * 7. Insert PrintingLogs record
 *
 * All steps are inside one SQL transaction.
 */
const completePrinting = async (req, res) => {
  const printingAdminId = req.user.id;
  const requestId = req.params.id;
  const { remarks } = req.body || {};

  const pool = await poolPromise;
  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin();

    // ============================================
    // 1. Get request details
    // ============================================
    const requestResult = await new sql.Request(transaction)
      .input("requestId", sql.Int, requestId)
      .input("printingAdminId", sql.Int, printingAdminId)
      .query(`
        SELECT
          RequestId,
          TotalPages,
          TotalSheets,
          PaperSize
        FROM PhotocopyRequests
        WHERE RequestId = @requestId
          AND CurrentApproverId = @printingAdminId
          AND Status = 'Printing'
      `);

    if (requestResult.recordset.length === 0) {
      await transaction.rollback();

      return res.status(404).json({
        message:
          "Request not found, not printing, or not assigned to this Printing Admin",
      });
    }

    const request = requestResult.recordset[0];
    const totalSheets = request.TotalSheets || 0;
    const paperSize = request.PaperSize || "A4";

    // ============================================
    // 2. Get inventory record
    // ============================================
    const inventoryResult = await new sql.Request(transaction)
      .input("paperType", sql.VarChar, paperSize)
      .query(`
        SELECT
          InventoryId,
          PaperType,
          CurrentStock
        FROM PaperInventory
        WHERE PaperType = @paperType
      `);

    if (inventoryResult.recordset.length === 0) {
      await transaction.rollback();

      return res.status(400).json({
        message: `No inventory record found for ${paperSize}.`,
      });
    }

    const inventory = inventoryResult.recordset[0];
    const previousStock = inventory.CurrentStock;
    const newStock = previousStock - totalSheets;

    // ============================================
    // 3. Prevent negative stock
    // ============================================
    if (previousStock < totalSheets) {
      await transaction.rollback();

      return res.status(400).json({
        message: `Not enough ${paperSize} stock. Available: ${previousStock}, Required: ${totalSheets}.`,
      });
    }

    // ============================================
    // 4. Deduct paper stock
    // ============================================
    await new sql.Request(transaction)
      .input("inventoryId", sql.Int, inventory.InventoryId)
      .input("quantity", sql.Int, totalSheets)
      .query(`
        UPDATE PaperInventory
        SET
          CurrentStock = CurrentStock - @quantity,
          LastUpdated = GETDATE()
        WHERE InventoryId = @inventoryId
      `);

    // ============================================
    // 5. Save inventory transaction log
    // ============================================
    await new sql.Request(transaction)
      .input("paperType", sql.VarChar, paperSize)
      .input("transactionType", sql.VarChar, "DEDUCTION")
      .input("quantity", sql.Int, totalSheets)
      .input("previousStock", sql.Int, previousStock)
      .input("newStock", sql.Int, newStock)
      .input("referenceId", sql.Int, requestId)
      .input(
        "remarks",
        sql.VarChar,
        `Deducted ${totalSheets} sheets of ${paperSize} for completed print request`
      )
      .input("createdBy", sql.Int, printingAdminId)
      .query(`
        INSERT INTO InventoryTransactions
        (
          PaperType,
          TransactionType,
          Quantity,
          PreviousStock,
          NewStock,
          ReferenceId,
          Remarks,
          CreatedBy
        )
        VALUES
        (
          @paperType,
          @transactionType,
          @quantity,
          @previousStock,
          @newStock,
          @referenceId,
          @remarks,
          @createdBy
        )
      `);

    // ============================================
    // 6. Mark request as completed
    // ============================================
    await new sql.Request(transaction)
      .input("requestId", sql.Int, requestId)
      .query(`
        UPDATE PhotocopyRequests
        SET
          Status = 'Completed',
          CurrentApproverId = NULL,
          CompletedAt = GETDATE()
        WHERE RequestId = @requestId
      `);

    // ============================================
    // 7. Insert printing completion log
    // ============================================
    await new sql.Request(transaction)
      .input("requestId", sql.Int, requestId)
      .input("printedBy", sql.Int, printingAdminId)
      .input("printedPages", sql.Int, request.TotalPages || 0)
      .input("printedSheets", sql.Int, totalSheets)
      .input("remarks", sql.NVarChar, remarks || "Printing completed")
      .query(`
        INSERT INTO PrintingLogs
        (
          RequestId,
          PrintedBy,
          PrintedPages,
          PrintedSheets,
          Remarks,
          PrintedAt
        )
        VALUES
        (
          @requestId,
          @printedBy,
          @printedPages,
          @printedSheets,
          @remarks,
          GETDATE()
        )
      `);

    await transaction.commit();

    return res.status(200).json({
      success: true,
      message:
        "Printing completed successfully, inventory deducted, and transaction logged.",
    });
  } catch (error) {
    try {
      await transaction.rollback();
    } catch (rollbackError) {
      console.error("Rollback Error:", rollbackError);
    }

    console.error("Complete Printing Error:", error);

    return res.status(500).json({
      message: "Server error while completing printing",
      error: error.message,
    });
  }
};

/**
 * @desc    Get printing history
 * @route   GET /api/printing/history
 * @access  Private - PrintingAdmin / SuperAdmin
 */
const getPrintingHistory = async (req, res) => {
  try {
    const printingAdminId = req.user.id;
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("printingAdminId", sql.Int, printingAdminId)
      .query(`
        SELECT
          pl.PrintingLogId,
          pl.RequestId,
          pl.PrintedBy,
          pl.PrintedPages,
          pl.PrintedSheets,
          pl.Remarks,
          pl.PrintedAt,

          r.RequestNumber,
          r.Status,
          r.CompletedAt,

          teacher.FullName AS TeacherName,
          teacher.EmployeeId,

          printer.FullName AS PrintedByName,

          d.DepartmentName,
          s.SubjectName,
          p.PurposeName

        FROM PrintingLogs pl

        INNER JOIN PhotocopyRequests r
          ON pl.RequestId = r.RequestId

        LEFT JOIN Users teacher
          ON r.TeacherId = teacher.UserId

        LEFT JOIN Users printer
          ON pl.PrintedBy = printer.UserId

        LEFT JOIN Departments d
          ON r.DepartmentId = d.DepartmentId

        LEFT JOIN Subjects s
          ON r.SubjectId = s.SubjectId

        LEFT JOIN Purposes p
          ON r.PurposeId = p.PurposeId

        WHERE pl.PrintedBy = @printingAdminId

        ORDER BY pl.PrintedAt DESC
      `);

    return res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Get Printing History Error:", error);

    return res.status(500).json({
      message: "Server error while fetching printing history",
      error: error.message,
    });
  }
};

/**
 * @desc    Get inventory transaction logs
 * @route   GET /api/printing/inventory-transactions
 * @access  Private - PrintingAdmin / SuperAdmin
 */
const getInventoryTransactions = async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request().query(`
      SELECT
        it.TransactionId,
        it.PaperType,
        it.TransactionType,
        it.Quantity,
        it.PreviousStock,
        it.NewStock,
        it.ReferenceId,
        it.Remarks,
        it.CreatedAt,

        u.FullName AS CreatedByName,

        r.RequestNumber

      FROM InventoryTransactions it

      LEFT JOIN Users u
        ON it.CreatedBy = u.UserId

      LEFT JOIN PhotocopyRequests r
        ON it.ReferenceId = r.RequestId

      ORDER BY it.CreatedAt DESC
    `);

    return res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Get Inventory Transactions Error:", error);

    return res.status(500).json({
      message: "Server error while fetching inventory transactions",
      error: error.message,
    });
  }
};

module.exports = {
  getPrintingDashboard,
  getPrintingRequests,
  getPrintingRequestById,
  startPrinting,
  completePrinting,
  getPrintingHistory,
  getInventoryTransactions,
};