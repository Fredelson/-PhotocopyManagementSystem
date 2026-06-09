USE PhotocopyManagementDB;
GO

----------------------------------------------------
-- IMPORTANT
----------------------------------------------------
-- Temporary Password For All Users:
--
-- Password123
--
-- Replace HASH_VALUE below with your
-- generated bcrypt hash.
----------------------------------------------------

DECLARE @Hash NVARCHAR(500);

SET @Hash = '$2b$10$VxybM5P68HM6vqTy3ZFGh.43DlqR4d8FN0Bu/jQdKKPLyklRBT2wO';

----------------------------------------------------
-- SUPER ADMIN
----------------------------------------------------

INSERT INTO Users
(
    FullName,
    EmployeeId,
    SchoolEmail,
    PasswordHash,
    Role,
    DepartmentId,
    SectionId
)
VALUES
(
    'Super Administrator',
    'SA001',
    'superadmin@arabunityschool.ae',
    @Hash,
    'SuperAdmin',
    NULL,
    NULL
);

----------------------------------------------------
-- ADMIN PRINTING
----------------------------------------------------

INSERT INTO Users
(
    FullName,
    EmployeeId,
    SchoolEmail,
    PasswordHash,
    Role,
    DepartmentId,
    SectionId
)
VALUES
(
    'Printing Administrator',
    'ADM001',
    'admin@arabunityschool.ae',
    @Hash,
    'Admin',
    NULL,
    NULL
);

----------------------------------------------------
-- HOD USERS
----------------------------------------------------

INSERT INTO Users
(
    FullName,
    EmployeeId,
    SchoolEmail,
    PasswordHash,
    Role,
    DepartmentId,
    SectionId
)
VALUES

(
    'English HOD',
    'HOD001',
    'hod.english@arabunityschool.ae',
    @Hash,
    'HOD',
    1,
    NULL
),

(
    'Mathematics HOD',
    'HOD002',
    'hod.math@arabunityschool.ae',
    @Hash,
    'HOD',
    2,
    NULL
),

(
    'Science HOD',
    'HOD003',
    'hod.science@arabunityschool.ae',
    @Hash,
    'HOD',
    3,
    NULL
),

(
    'ICT HOD',
    'HOD004',
    'hod.ict@arabunityschool.ae',
    @Hash,
    'HOD',
    4,
    NULL
),

(
    'Arabic HOD',
    'HOD005',
    'hod.arabic@arabunityschool.ae',
    @Hash,
    'HOD',
    5,
    NULL
);

----------------------------------------------------
-- HOS USERS
----------------------------------------------------

INSERT INTO Users
(
    FullName,
    EmployeeId,
    SchoolEmail,
    PasswordHash,
    Role,
    DepartmentId,
    SectionId
)
VALUES

(
    'FS HOS',
    'HOS001',
    'hos.fs@arabunityschool.ae',
    @Hash,
    'HOS',
    NULL,
    1
),

(
    'Primary HOS',
    'HOS002',
    'hos.primary@arabunityschool.ae',
    @Hash,
    'HOS',
    NULL,
    2
),

(
    'Secondary HOS',
    'HOS003',
    'hos.secondary@arabunityschool.ae',
    @Hash,
    'HOS',
    NULL,
    3
),

(
    'Sixth Form HOS',
    'HOS004',
    'hos.sixthform@arabunityschool.ae',
    @Hash,
    'HOS',
    NULL,
    4
),

(
    'Inclusion HOS',
    'HOS005',
    'hos.inclusion@arabunityschool.ae',
    @Hash,
    'HOS',
    NULL,
    5
);

----------------------------------------------------
-- SAMPLE TEACHERS
----------------------------------------------------

INSERT INTO Users
(
    FullName,
    EmployeeId,
    SchoolEmail,
    PasswordHash,
    Role,
    DepartmentId,
    SectionId
)
VALUES

(
    'English Teacher',
    'TCH001',
    'teacher.english@arabunityschool.ae',
    @Hash,
    'Teacher',
    1,
    2
),

(
    'Mathematics Teacher',
    'TCH002',
    'teacher.math@arabunityschool.ae',
    @Hash,
    'Teacher',
    2,
    2
),

(
    'Science Teacher',
    'TCH003',
    'teacher.science@arabunityschool.ae',
    @Hash,
    'Teacher',
    3,
    3
),

(
    'ICT Teacher',
    'TCH004',
    'teacher.ict@arabunityschool.ae',
    @Hash,
    'Teacher',
    4,
    3
),

(
    'Arabic Teacher',
    'TCH005',
    'teacher.arabic@arabunityschool.ae',
    @Hash,
    'Teacher',
    5,
    1
);
GO

PRINT 'Users seeded successfully.';
GO