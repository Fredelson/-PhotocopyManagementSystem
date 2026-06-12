// ============================================
// ARAB UNITY SCHOOL
// Generate Password Hashes
// Password = Employee ID
//
// Example:
// A001 -> Password A001
// T010 -> Password T010
// T120 -> Password T120
// ============================================

const bcrypt = require("bcryptjs");

async function generateHashes() {
  const users = [];

  // ============================================
  // Super Admin
  // ============================================

  users.push("A001");
  users.push("A002");

  // ============================================
  // Printing Admin
  // ============================================

  users.push("A101");
  users.push("A102");
  users.push("A103");

  // ============================================
  // HOS
  // ============================================

  users.push("A201");
  users.push("A202");
  users.push("A203");
  users.push("A204");
  users.push("A205");

  // ============================================
  // HOD
  // T001 - T040
  // ============================================

  for (let i = 1; i <= 40; i++) {
    users.push(`T${String(i).padStart(3, "0")}`);
  }

  // ============================================
  // Teachers
  // T101 - T120
  // ============================================

  for (let i = 101; i <= 120; i++) {
    users.push(`T${i}`);
  }

  console.log(`
-- ============================================
-- ARAB UNITY SCHOOL
-- Password Update Script
-- Password = Employee ID
-- ============================================
`);

  for (const employeeId of users) {
    const hash = await bcrypt.hash(employeeId, 10);

    console.log(`
UPDATE Users
SET PasswordHash = '${hash}'
WHERE EmployeeId = '${employeeId}';
`);
  }

  console.log(`
-- ============================================
-- Total Users: ${users.length}
-- ============================================
`);
}

generateHashes();