-- ============================================
-- ARAB UNITY SCHOOL
-- Real Users Seed Script
-- Run after clean-reset.sql
--
-- Employee ID Format:
-- A001+ = SuperAdmin / PrintingAdmin / HOS
-- T001+ = HOD / Teacher
--
-- User Rules:
-- Teacher       = Subject NULL
-- HOD           = Subject required
-- HOS           = Subject NULL
-- PrintingAdmin = Subject NULL
-- SuperAdmin    = Subject NULL
-- ============================================

USE PhotocopyManagementDB;
GO

-- ============================================
-- Default Password Hash
-- Same hash used in previous working seed
-- ============================================

DECLARE @DefaultPasswordHash NVARCHAR(MAX);
SET @DefaultPasswordHash = N'$2b$10$fkfTy6u5eZfF3hEcnXPEtepLA6nn6MT2EyTdH3U6VSo/gTImtBQCa';

-- ============================================
-- Super Admin Users
-- DepartmentId 6 = IT
-- ============================================

INSERT INTO Users
(EmployeeId, FullName, SchoolEmail, DepartmentId, Subject, Role, PasswordHash, MustChangePassword, IsActive)
VALUES
('A001', 'System Super Admin', 'superadmin1@arabunityschool.ae', 6, NULL, 'SuperAdmin', @DefaultPasswordHash, 0, 1),
('A002', 'Assistant Super Admin', 'superadmin2@arabunityschool.ae', 6, NULL, 'SuperAdmin', @DefaultPasswordHash, 0, 1);

-- ============================================
-- Printing Admin Users
-- DepartmentId 7 = Administration
-- ============================================

INSERT INTO Users
(EmployeeId, FullName, SchoolEmail, DepartmentId, Subject, Role, PasswordHash, MustChangePassword, IsActive)
VALUES
('A101', 'Fatima Noor', 'printing1@arabunityschool.ae', 7, NULL, 'PrintingAdmin', @DefaultPasswordHash, 0, 1),
('A102', 'Ahmed Khan', 'printing2@arabunityschool.ae', 7, NULL, 'PrintingAdmin', @DefaultPasswordHash, 0, 1),
('A103', 'Mariam Ali', 'printing3@arabunityschool.ae', 7, NULL, 'PrintingAdmin', @DefaultPasswordHash, 0, 1);

-- ============================================
-- Head of School Users
-- 1 FS, 2 Primary, 3 Secondary, 4 Sixth Form, 5 Inclusion
-- ============================================

INSERT INTO Users
(EmployeeId, FullName, SchoolEmail, DepartmentId, Subject, Role, PasswordHash, MustChangePassword, IsActive)
VALUES
('A201', 'Aisha Rahman', 'hos.fs@arabunityschool.ae', 1, NULL, 'HOS', @DefaultPasswordHash, 0, 1),
('A202', 'Omar Siddiqui', 'hos.primary@arabunityschool.ae', 2, NULL, 'HOS', @DefaultPasswordHash, 0, 1),
('A203', 'Sarah Williams', 'hos.secondary@arabunityschool.ae', 3, NULL, 'HOS', @DefaultPasswordHash, 0, 1),
('A204', 'David Thompson', 'hos.sixthform@arabunityschool.ae', 4, NULL, 'HOS', @DefaultPasswordHash, 0, 1),
('A205', 'Nadia Hassan', 'hos.inclusion@arabunityschool.ae', 5, NULL, 'HOS', @DefaultPasswordHash, 0, 1);

-- ============================================
-- HOD Users
-- One HOD per Subject per Department
-- T001 - T040
-- ============================================

INSERT INTO Users
(EmployeeId, FullName, SchoolEmail, DepartmentId, Subject, Role, PasswordHash, MustChangePassword, IsActive)
VALUES
-- FS HODs
('T001', 'Layla Ahmed', 'hod.fs.arabic@arabunityschool.ae', 1, 'Arabic', 'HOD', @DefaultPasswordHash, 0, 1),
('T002', 'Rebecca Clark', 'hod.fs.english@arabunityschool.ae', 1, 'English', 'HOD', @DefaultPasswordHash, 0, 1),
('T003', 'Salma Ibrahim', 'hod.fs.general@arabunityschool.ae', 1, 'General', 'HOD', @DefaultPasswordHash, 0, 1),
('T004', 'Rania Saleh', 'hod.fs.humanities@arabunityschool.ae', 1, 'Humanities', 'HOD', @DefaultPasswordHash, 0, 1),
('T005', 'James Wilson', 'hod.fs.ict@arabunityschool.ae', 1, 'ICT', 'HOD', @DefaultPasswordHash, 0, 1),
('T006', 'Samira Khalid', 'hod.fs.islamic@arabunityschool.ae', 1, 'Islamic', 'HOD', @DefaultPasswordHash, 0, 1),
('T007', 'Mona Youssef', 'hod.fs.math@arabunityschool.ae', 1, 'Math', 'HOD', @DefaultPasswordHash, 0, 1),
('T008', 'Huda Mansour', 'hod.fs.science@arabunityschool.ae', 1, 'Science', 'HOD', @DefaultPasswordHash, 0, 1),

-- Primary HODs
('T009', 'Amal Nasser', 'hod.primary.arabic@arabunityschool.ae', 2, 'Arabic', 'HOD', @DefaultPasswordHash, 0, 1),
('T010', 'John Smith', 'hod.primary.english@arabunityschool.ae', 2, 'English', 'HOD', @DefaultPasswordHash, 0, 1),
('T011', 'Noor Al Ali', 'hod.primary.general@arabunityschool.ae', 2, 'General', 'HOD', @DefaultPasswordHash, 0, 1),
('T012', 'Emma Johnson', 'hod.primary.humanities@arabunityschool.ae', 2, 'Humanities', 'HOD', @DefaultPasswordHash, 0, 1),
('T013', 'Mark Evans', 'hod.primary.ict@arabunityschool.ae', 2, 'ICT', 'HOD', @DefaultPasswordHash, 0, 1),
('T014', 'Yusuf Abdullah', 'hod.primary.islamic@arabunityschool.ae', 2, 'Islamic', 'HOD', @DefaultPasswordHash, 0, 1),
('T015', 'Priya Sharma', 'hod.primary.math@arabunityschool.ae', 2, 'Math', 'HOD', @DefaultPasswordHash, 0, 1),
('T016', 'Daniel Brown', 'hod.primary.science@arabunityschool.ae', 2, 'Science', 'HOD', @DefaultPasswordHash, 0, 1),

-- Secondary HODs
('T017', 'Khaled Farouk', 'hod.secondary.arabic@arabunityschool.ae', 3, 'Arabic', 'HOD', @DefaultPasswordHash, 0, 1),
('T018', 'Michael Green', 'hod.secondary.english@arabunityschool.ae', 3, 'English', 'HOD', @DefaultPasswordHash, 0, 1),
('T019', 'Sofia Martins', 'hod.secondary.general@arabunityschool.ae', 3, 'General', 'HOD', @DefaultPasswordHash, 0, 1),
('T020', 'Thomas Carter', 'hod.secondary.humanities@arabunityschool.ae', 3, 'Humanities', 'HOD', @DefaultPasswordHash, 0, 1),
('T021', 'Imran Khan', 'hod.secondary.ict@arabunityschool.ae', 3, 'ICT', 'HOD', @DefaultPasswordHash, 0, 1),
('T022', 'Zainab Omar', 'hod.secondary.islamic@arabunityschool.ae', 3, 'Islamic', 'HOD', @DefaultPasswordHash, 0, 1),
('T023', 'Hassan Malik', 'hod.secondary.math@arabunityschool.ae', 3, 'Math', 'HOD', @DefaultPasswordHash, 0, 1),
('T024', 'Laura Bennett', 'hod.secondary.science@arabunityschool.ae', 3, 'Science', 'HOD', @DefaultPasswordHash, 0, 1),

-- Sixth Form HODs
('T025', 'Maha Saeed', 'hod.sixthform.arabic@arabunityschool.ae', 4, 'Arabic', 'HOD', @DefaultPasswordHash, 0, 1),
('T026', 'Olivia Harris', 'hod.sixthform.english@arabunityschool.ae', 4, 'English', 'HOD', @DefaultPasswordHash, 0, 1),
('T027', 'Leah Roberts', 'hod.sixthform.general@arabunityschool.ae', 4, 'General', 'HOD', @DefaultPasswordHash, 0, 1),
('T028', 'Helen Cooper', 'hod.sixthform.humanities@arabunityschool.ae', 4, 'Humanities', 'HOD', @DefaultPasswordHash, 0, 1),
('T029', 'Rashid Salem', 'hod.sixthform.ict@arabunityschool.ae', 4, 'ICT', 'HOD', @DefaultPasswordHash, 0, 1),
('T030', 'Tariq Mahmoud', 'hod.sixthform.islamic@arabunityschool.ae', 4, 'Islamic', 'HOD', @DefaultPasswordHash, 0, 1),
('T031', 'Bilal Ahmed', 'hod.sixthform.math@arabunityschool.ae', 4, 'Math', 'HOD', @DefaultPasswordHash, 0, 1),
('T032', 'Grace Miller', 'hod.sixthform.science@arabunityschool.ae', 4, 'Science', 'HOD', @DefaultPasswordHash, 0, 1),

-- Inclusion HODs
('T033', 'Lina Kareem', 'hod.inclusion.arabic@arabunityschool.ae', 5, 'Arabic', 'HOD', @DefaultPasswordHash, 0, 1),
('T034', 'Farah Hussein', 'hod.inclusion.english@arabunityschool.ae', 5, 'English', 'HOD', @DefaultPasswordHash, 0, 1),
('T035', 'Mary Thomas', 'hod.inclusion.general@arabunityschool.ae', 5, 'General', 'HOD', @DefaultPasswordHash, 0, 1),
('T036', 'Robert Taylor', 'hod.inclusion.humanities@arabunityschool.ae', 5, 'Humanities', 'HOD', @DefaultPasswordHash, 0, 1),
('T037', 'Naveed Akhtar', 'hod.inclusion.ict@arabunityschool.ae', 5, 'ICT', 'HOD', @DefaultPasswordHash, 0, 1),
('T038', 'Amina Yusuf', 'hod.inclusion.islamic@arabunityschool.ae', 5, 'Islamic', 'HOD', @DefaultPasswordHash, 0, 1),
('T039', 'Adam Scott', 'hod.inclusion.math@arabunityschool.ae', 5, 'Math', 'HOD', @DefaultPasswordHash, 0, 1),
('T040', 'Dina Mostafa', 'hod.inclusion.science@arabunityschool.ae', 5, 'Science', 'HOD', @DefaultPasswordHash, 0, 1);

-- ============================================
-- Teacher Users
-- T101 - T120
-- Teachers do NOT have fixed subjects.
-- They choose subject only when creating a request.
-- ============================================

INSERT INTO Users
(EmployeeId, FullName, SchoolEmail, DepartmentId, Subject, Role, PasswordHash, MustChangePassword, IsActive)
VALUES
('T101', 'Sarah Ahmed', 'sarah.ahmed@arabunityschool.ae', 2, NULL, 'Teacher', @DefaultPasswordHash, 0, 1),
('T102', 'Mohammed Ali', 'mohammed.ali@arabunityschool.ae', 2, NULL, 'Teacher', @DefaultPasswordHash, 0, 1),
('T103', 'Fatima Hassan', 'fatima.hassan@arabunityschool.ae', 2, NULL, 'Teacher', @DefaultPasswordHash, 0, 1),
('T104', 'Aisha Khan', 'aisha.khan@arabunityschool.ae', 2, NULL, 'Teacher', @DefaultPasswordHash, 0, 1),
('T105', 'David Wilson', 'david.wilson@arabunityschool.ae', 2, NULL, 'Teacher', @DefaultPasswordHash, 0, 1),

('T106', 'Emily Davis', 'emily.davis@arabunityschool.ae', 3, NULL, 'Teacher', @DefaultPasswordHash, 0, 1),
('T107', 'Omar Farooq', 'omar.farooq@arabunityschool.ae', 3, NULL, 'Teacher', @DefaultPasswordHash, 0, 1),
('T108', 'Hannah White', 'hannah.white@arabunityschool.ae', 3, NULL, 'Teacher', @DefaultPasswordHash, 0, 1),
('T109', 'Ali Mahmoud', 'ali.mahmoud@arabunityschool.ae', 3, NULL, 'Teacher', @DefaultPasswordHash, 0, 1),
('T110', 'Mariam Saleh', 'mariam.saleh@arabunityschool.ae', 3, NULL, 'Teacher', @DefaultPasswordHash, 0, 1),

('T111', 'Sana Khalil', 'sana.khalil@arabunityschool.ae', 1, NULL, 'Teacher', @DefaultPasswordHash, 0, 1),
('T112', 'Peter Collins', 'peter.collins@arabunityschool.ae', 1, NULL, 'Teacher', @DefaultPasswordHash, 0, 1),
('T113', 'Noura Saeed', 'noura.saeed@arabunityschool.ae', 1, NULL, 'Teacher', @DefaultPasswordHash, 0, 1),
('T114', 'Rima Haddad', 'rima.haddad@arabunityschool.ae', 1, NULL, 'Teacher', @DefaultPasswordHash, 0, 1),

('T115', 'George Martin', 'george.martin@arabunityschool.ae', 4, NULL, 'Teacher', @DefaultPasswordHash, 0, 1),
('T116', 'Kareem Abbas', 'kareem.abbas@arabunityschool.ae', 4, NULL, 'Teacher', @DefaultPasswordHash, 0, 1),
('T117', 'Sophia Lee', 'sophia.lee@arabunityschool.ae', 4, NULL, 'Teacher', @DefaultPasswordHash, 0, 1),

('T118', 'Huda Al Mansoori', 'huda.mansoori@arabunityschool.ae', 5, NULL, 'Teacher', @DefaultPasswordHash, 0, 1),
('T119', 'Rachel Adams', 'rachel.adams@arabunityschool.ae', 5, NULL, 'Teacher', @DefaultPasswordHash, 0, 1),
('T120', 'Sameer Qureshi', 'sameer.qureshi@arabunityschool.ae', 5, NULL, 'Teacher', @DefaultPasswordHash, 0, 1);
GO

-- ============================================
-- Link HODs to Subjects
-- Teachers are NOT linked here because they choose
-- the request subject during request creation.
-- ============================================

INSERT INTO UserSubjects (UserId, SubjectId, IsActive)
SELECT
    u.UserId,
    s.SubjectId,
    1
FROM Users u
INNER JOIN Subjects s
    ON u.Subject = s.SubjectName
WHERE u.Role = 'HOD'
  AND NOT EXISTS (
      SELECT 1
      FROM UserSubjects us
      WHERE us.UserId = u.UserId
        AND us.SubjectId = s.SubjectId
  );
GO

-- ============================================
-- Verify User Counts
-- ============================================

SELECT
    Role,
    COUNT(*) AS TotalUsers
FROM Users
GROUP BY Role
ORDER BY Role;
GO

-- ============================================
-- Verify Seeded Users
-- ============================================

SELECT
    UserId,
    EmployeeId,
    FullName,
    DepartmentId,
    Subject,
    Role,
    IsActive
FROM Users
ORDER BY
    Role,
    EmployeeId;
GO