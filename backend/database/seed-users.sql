USE PhotocopyManagementDB;
GO

INSERT INTO Users
(
    FullName,
    SchoolEmail,
    PasswordHash,
    Role,
    Department,
    Section
)
VALUES
(
    'System Administrator',
    'admin@arabunityschool.ae',
    'TEMP_HASH',
    'Admin',
    'Administration',
    NULL
),

(
    'Printing Administrator',
    'printing@arabunityschool.ae',
    'TEMP_HASH',
    'PrintingAdmin',
    'Administration',
    NULL
),

(
    'Primary HOD',
    'hod.primary@arabunityschool.ae',
    'TEMP_HASH',
    'HOD',
    'Primary',
    NULL
),

(
    'Primary HOS',
    'hos.primary@arabunityschool.ae',
    'TEMP_HASH',
    'HOS',
    'Primary',
    NULL
),

(
    'Teacher Demo',
    'teacher@arabunityschool.ae',
    'TEMP_HASH',
    'Teacher',
    'Primary',
    'Year 1'
);
GO