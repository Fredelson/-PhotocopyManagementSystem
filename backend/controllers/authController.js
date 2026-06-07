const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sql, poolPromise } = require("../config/db");

const login = async (req, res) => {
  try {
    const { schoolEmail, password } = req.body;

    if (!schoolEmail || !password) {
      return res.status(400).json({
        message: "School email and password are required",
      });
    }

    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("schoolEmail", sql.NVarChar, schoolEmail)
      .query(`
        SELECT TOP 1
          Id,
          FullName,
          EmployeeId,
          SchoolEmail,
          PasswordHash,
          Role,
          Department,
          Section,
          MustChangePassword
        FROM Users
        WHERE SchoolEmail = @schoolEmail
          AND IsActive = 1
      `);

    const user = result.recordset[0];

    if (!user) {
      return res.status(401).json({
        message: "Invalid school email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.PasswordHash
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid school email or password",
      });
    }

    const token = jwt.sign(
      {
        id: user.Id,
        schoolEmail: user.SchoolEmail,
        role: user.Role,
        department: user.Department,
        section: user.Section,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.Id,
        fullName: user.FullName,
        employeeId: user.EmployeeId,
        schoolEmail: user.SchoolEmail,
        role: user.Role,
        department: user.Department,
        section: user.Section,
        mustChangePassword: user.MustChangePassword,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Server error during login",
      error: error.message,
    });
  }
};

module.exports = {
  login,
};