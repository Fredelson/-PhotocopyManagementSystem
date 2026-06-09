const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { poolPromise, sql } = require("../config/db");

/**
 * @desc    Login user using Employee ID and Password
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res) => {
  try {
    const { employeeId, password } = req.body;

    if (!employeeId || !password) {
      return res.status(400).json({
        message: "Employee ID and password are required",
      });
    }

    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("employeeId", sql.NVarChar, employeeId)
      .query(`
        SELECT
          Id,
          FullName,
          EmployeeId,
          SchoolEmail,
          PasswordHash,
          Role,
          DepartmentId,
          SectionId,
          IsActive
        FROM Users
        WHERE EmployeeId = @employeeId
      `);

    const user = result.recordset[0];

    if (!user) {
      return res.status(401).json({
        message: "Invalid employee ID or password",
      });
    }

    if (!user.IsActive) {
      return res.status(403).json({
        message: "Account is inactive. Please contact administrator.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.PasswordHash);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid employee ID or password",
      });
    }

    await pool
      .request()
      .input("userId", sql.Int, user.Id)
      .query(`
        UPDATE Users
        SET LastLoginAt = GETDATE()
        WHERE Id = @userId
      `);

    const token = jwt.sign(
      {
        id: user.Id,
        employeeId: user.EmployeeId,
        role: user.Role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.Id,
        fullName: user.FullName,
        employeeId: user.EmployeeId,
        schoolEmail: user.SchoolEmail,
        role: user.Role,
        departmentId: user.DepartmentId,
        sectionId: user.SectionId,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      message: "Server error during login",
    });
  }
};

/**
 * @desc    Get logged-in user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("userId", sql.Int, req.user.id)
      .query(`
        SELECT
          u.Id,
          u.FullName,
          u.EmployeeId,
          u.SchoolEmail,
          u.Role,
          u.DepartmentId,
          d.DepartmentName,
          u.SectionId,
          s.SectionName,
          u.IsActive,
          u.LastLoginAt,
          u.CreatedAt
        FROM Users u
        LEFT JOIN Departments d ON u.DepartmentId = d.Id
        LEFT JOIN SchoolSections s ON u.SectionId = s.Id
        WHERE u.Id = @userId
      `);

    const user = result.recordset[0];

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      id: user.Id,
      fullName: user.FullName,
      employeeId: user.EmployeeId,
      schoolEmail: user.SchoolEmail,
      role: user.Role,
      departmentId: user.DepartmentId,
      departmentName: user.DepartmentName,
      sectionId: user.SectionId,
      sectionName: user.SectionName,
      isActive: user.IsActive,
      lastLoginAt: user.LastLoginAt,
      createdAt: user.CreatedAt,
    });
  } catch (error) {
    console.error("Get Me Error:", error);

    return res.status(500).json({
      message: "Server error while fetching user profile",
    });
  }
};

module.exports = {
  login,
  getMe,
};