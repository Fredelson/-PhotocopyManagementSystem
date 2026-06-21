// ============================================
// ARAB UNITY SCHOOL
// Master Data Controller
// Manages Subjects, Sections, and Purposes
// No hard delete - only activate/deactivate
// ============================================

const { sql, poolPromise } = require("../config/db");

// ============================================
// Config for allowed master tables only
// This prevents unsafe dynamic SQL
// ============================================
const masterTables = {
  subjects: {
    table: "Subjects",
    id: "SubjectId",
    name: "SubjectName",
  },
    departments: {
    table: "Departments",
    id: "DepartmentId",
    name: "DepartmentName",
  },
  purposes: {
    table: "Purposes",
    id: "PurposeId",
    name: "PurposeName",
  },
};

// ============================================
// Helper: Validate master type
// ============================================
const getConfig = (type) => {
  return masterTables[type] || null;
};

// ============================================
// GET /api/master/:type
// Example: /api/master/subjects
// ============================================
const getMasterData = async (req, res) => {
  try {
    const { type } = req.params;
    const config = getConfig(type);

    if (!config) {
      return res.status(400).json({
        message: "Invalid master data type",
      });
    }

    const pool = await poolPromise;

    const result = await pool.request().query(`
      SELECT
        ${config.id} AS Id,
        ${config.name} AS Name,
        IsActive
      FROM ${config.table}
      ORDER BY IsActive DESC, ${config.name} ASC
    `);

    return res.json(result.recordset);
  } catch (error) {
    console.error("Get Master Data Error:", error);

    return res.status(500).json({
      message: "Server error while fetching master data",
      error: error.message,
    });
  }
};

// ============================================
// POST /api/master/:type
// Body: { name: "Biology" }
// ============================================
const createMasterData = async (req, res) => {
  try {
    const { type } = req.params;
    const { name } = req.body;

    const config = getConfig(type);

    if (!config) {
      return res.status(400).json({
        message: "Invalid master data type",
      });
    }

    if (!name || name.trim() === "") {
      return res.status(400).json({
        message: "Name is required",
      });
    }

    const pool = await poolPromise;

    // Prevent duplicate active/inactive names
    const duplicate = await pool
      .request()
      .input("Name", sql.VarChar(100), name.trim())
      .query(`
        SELECT ${config.id}
        FROM ${config.table}
        WHERE ${config.name} = @Name
      `);

    if (duplicate.recordset.length > 0) {
      return res.status(400).json({
        message: "This name already exists",
      });
    }

    const result = await pool
      .request()
      .input("Name", sql.VarChar(100), name.trim())
      .query(`
        INSERT INTO ${config.table} (${config.name}, IsActive)
        OUTPUT
          INSERTED.${config.id} AS Id,
          INSERTED.${config.name} AS Name,
          INSERTED.IsActive
        VALUES (@Name, 1)
      `);

    return res.status(201).json({
      message: "Master data created successfully",
      data: result.recordset[0],
    });
  } catch (error) {
    console.error("Create Master Data Error:", error);

    return res.status(500).json({
      message: "Server error while creating master data",
      error: error.message,
    });
  }
};

// ============================================
// PUT /api/master/:type/:id
// Body: { name: "Updated Name" }
// ============================================
const updateMasterData = async (req, res) => {
  try {
    const { type, id } = req.params;
    const { name } = req.body;

    const config = getConfig(type);

    if (!config) {
      return res.status(400).json({
        message: "Invalid master data type",
      });
    }

    if (!name || name.trim() === "") {
      return res.status(400).json({
        message: "Name is required",
      });
    }

    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("Id", sql.Int, id)
      .input("Name", sql.VarChar(100), name.trim())
      .query(`
        UPDATE ${config.table}
        SET ${config.name} = @Name
        OUTPUT
          INSERTED.${config.id} AS Id,
          INSERTED.${config.name} AS Name,
          INSERTED.IsActive
        WHERE ${config.id} = @Id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        message: "Record not found",
      });
    }

    return res.json({
      message: "Master data updated successfully",
      data: result.recordset[0],
    });
  } catch (error) {
    console.error("Update Master Data Error:", error);

    return res.status(500).json({
      message: "Server error while updating master data",
      error: error.message,
    });
  }
};

// ============================================
// PATCH /api/master/:type/:id/status
// Body: { isActive: true/false }
// ============================================
const updateMasterStatus = async (req, res) => {
  try {
    const { type, id } = req.params;
    const { isActive } = req.body;

    const config = getConfig(type);

    if (!config) {
      return res.status(400).json({
        message: "Invalid master data type",
      });
    }

    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("Id", sql.Int, id)
      .input("IsActive", sql.Bit, Boolean(isActive))
      .query(`
        UPDATE ${config.table}
        SET IsActive = @IsActive
        OUTPUT
          INSERTED.${config.id} AS Id,
          INSERTED.${config.name} AS Name,
          INSERTED.IsActive
        WHERE ${config.id} = @Id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        message: "Record not found",
      });
    }

    return res.json({
      message: "Status updated successfully",
      data: result.recordset[0],
    });
  } catch (error) {
    console.error("Update Master Status Error:", error);

    return res.status(500).json({
      message: "Server error while updating status",
      error: error.message,
    });
  }
};

module.exports = {
  getMasterData,
  createMasterData,
  updateMasterData,
  updateMasterStatus,
};