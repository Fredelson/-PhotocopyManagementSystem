const bcrypt = require("bcrypt");

const users = [
  { email: "admin@arabunityschool.ae", employeeId: "A1001" },
  { email: "printing@arabunityschool.ae", employeeId: "P1001" },
  { email: "hod.primary@arabunityschool.ae", employeeId: "H1001" },
  { email: "hos.primary@arabunityschool.ae", employeeId: "S1001" },
  { email: "teacher@arabunityschool.ae", employeeId: "T1001" },
  { email: "superadmin1@arabunityschool.ae", employeeId: "SA0001" },
  { email: "superadmin2@arabunityschool.ae", employeeId: "SA0002" }
];

async function generateHashes() {
  for (const user of users) {
    const hash = await bcrypt.hash(user.employeeId, 10);

    console.log(`
UPDATE Users
SET PasswordHash = '${hash}'
WHERE SchoolEmail = '${user.email}';
`);
  }
}

generateHashes();