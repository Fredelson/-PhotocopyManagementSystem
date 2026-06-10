USE master;
GO

IF DB_ID('PhotocopyManagementDB') IS NOT NULL
BEGIN
    ALTER DATABASE PhotocopyManagementDB SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE PhotocopyManagementDB;
END
GO

CREATE DATABASE PhotocopyManagementDB;
GO

USE PhotocopyManagementDB;
GO

CREATE TABLE Departments (
    DepartmentId INT IDENTITY(1,1) PRIMARY KEY,
    DepartmentName NVARCHAR(100) NOT NULL UNIQUE,
    IsActive BIT DEFAULT 1
);

CREATE TABLE Subjects (
    SubjectId INT IDENTITY(1,1) PRIMARY KEY,
    SubjectName NVARCHAR(100) NOT NULL UNIQUE,
    IsActive BIT DEFAULT 1
);

CREATE TABLE Purposes (
    PurposeId INT IDENTITY(1,1) PRIMARY KEY,
    PurposeName NVARCHAR(100) NOT NULL UNIQUE,
    IsActive BIT DEFAULT 1
);

CREATE TABLE Roles (
    RoleId INT IDENTITY(1,1) PRIMARY KEY,
    RoleName NVARCHAR(50) NOT NULL UNIQUE,
    IsActive BIT DEFAULT 1
);

CREATE TABLE Users (
    UserId INT IDENTITY(1,1) PRIMARY KEY,
    EmployeeId NVARCHAR(50) NOT NULL UNIQUE,
    FullName NVARCHAR(255) NOT NULL,
    SchoolEmail NVARCHAR(255) NOT NULL UNIQUE,
    DepartmentId INT NULL,
    RoleId INT NOT NULL,
    PasswordHash NVARCHAR(MAX) NOT NULL,
    MustChangePassword BIT DEFAULT 1,
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (DepartmentId) REFERENCES Departments(DepartmentId),
    FOREIGN KEY (RoleId) REFERENCES Roles(RoleId)
);

CREATE TABLE UserSubjects (
    UserSubjectId INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    SubjectId INT NOT NULL,
    IsActive BIT DEFAULT 1,

    CONSTRAINT UQ_User_Subject UNIQUE (UserId, SubjectId),
    FOREIGN KEY (UserId) REFERENCES Users(UserId),
    FOREIGN KEY (SubjectId) REFERENCES Subjects(SubjectId)
);

CREATE TABLE PhotocopyRequests (
    RequestId INT IDENTITY(1,1) PRIMARY KEY,
    RequestNumber NVARCHAR(50) NOT NULL UNIQUE,
    TeacherId INT NOT NULL,
    DepartmentId INT NOT NULL,
    SubjectId INT NOT NULL,
    PurposeId INT NOT NULL,

    Copies INT NOT NULL,
    TotalPages INT NOT NULL,
    TotalSheets INT NOT NULL,

    PaperSize NVARCHAR(20) DEFAULT 'A4',
    PrintType NVARCHAR(50) DEFAULT 'Black and White',
    PrintSide NVARCHAR(20) DEFAULT 'Single Sided',
    PriorityLevel NVARCHAR(20) DEFAULT 'Normal',
    IsExam BIT DEFAULT 0,
    DueDate DATETIME NULL,

    Status NVARCHAR(50) DEFAULT 'Pending',
    CurrentApproverId INT NULL,

    SubmittedAt DATETIME DEFAULT GETDATE(),
    ApprovedAt DATETIME NULL,
    PrintedAt DATETIME NULL,
    CompletedAt DATETIME NULL,
    Remarks NVARCHAR(MAX) NULL,

    FOREIGN KEY (TeacherId) REFERENCES Users(UserId),
    FOREIGN KEY (DepartmentId) REFERENCES Departments(DepartmentId),
    FOREIGN KEY (SubjectId) REFERENCES Subjects(SubjectId),
    FOREIGN KEY (PurposeId) REFERENCES Purposes(PurposeId),
    FOREIGN KEY (CurrentApproverId) REFERENCES Users(UserId)
);

CREATE TABLE RequestAttachments (
    AttachmentId INT IDENTITY(1,1) PRIMARY KEY,
    RequestId INT NOT NULL,
    OriginalFileName NVARCHAR(255) NOT NULL,
    StoredFileName NVARCHAR(255) NOT NULL,
    FilePath NVARCHAR(MAX) NULL,
    FileType NVARCHAR(100) NULL,
    FileSizeKB DECIMAL(18,2) NULL,
    PageCount INT NULL,
    Copies INT DEFAULT 1,
    TotalSheets INT NULL,
    UploadedAt DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (RequestId) REFERENCES PhotocopyRequests(RequestId)
);

CREATE TABLE RequestApprovals (
    ApprovalId INT IDENTITY(1,1) PRIMARY KEY,
    RequestId INT NOT NULL,
    ApproverId INT NOT NULL,
    ApprovalRole NVARCHAR(50) NOT NULL,
    ApprovalStatus NVARCHAR(50) DEFAULT 'Pending',
    Remarks NVARCHAR(MAX) NULL,
    ActionDate DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (RequestId) REFERENCES PhotocopyRequests(RequestId),
    FOREIGN KEY (ApproverId) REFERENCES Users(UserId)
);

CREATE TABLE PrintingLogs (
    PrintingLogId INT IDENTITY(1,1) PRIMARY KEY,
    RequestId INT NOT NULL,
    PrintedBy INT NOT NULL,
    PrintedPages INT DEFAULT 0,
    PrintedSheets INT DEFAULT 0,
    Remarks NVARCHAR(MAX) NULL,
    PrintedAt DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (RequestId) REFERENCES PhotocopyRequests(RequestId),
    FOREIGN KEY (PrintedBy) REFERENCES Users(UserId)
);

CREATE TABLE InventoryItems (
    ItemId INT IDENTITY(1,1) PRIMARY KEY,
    ItemName NVARCHAR(255) NOT NULL,
    Category NVARCHAR(100) NOT NULL,
    CurrentStock INT DEFAULT 0,
    MinimumStock INT DEFAULT 0,
    Unit NVARCHAR(50) NOT NULL,
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME DEFAULT GETDATE()
);

CREATE TABLE InventoryTransactions (
    TransactionId INT IDENTITY(1,1) PRIMARY KEY,
    ItemId INT NOT NULL,
    RequestId INT NULL,
    TransactionType NVARCHAR(50) NOT NULL,
    Quantity INT NOT NULL,
    Remarks NVARCHAR(500) NULL,
    CreatedBy INT NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (ItemId) REFERENCES InventoryItems(ItemId),
    FOREIGN KEY (RequestId) REFERENCES PhotocopyRequests(RequestId),
    FOREIGN KEY (CreatedBy) REFERENCES Users(UserId)
);

CREATE TABLE Notifications (
    NotificationId INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    Title NVARCHAR(255) NOT NULL,
    Message NVARCHAR(MAX) NOT NULL,
    IsRead BIT DEFAULT 0,
    CreatedAt DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (UserId) REFERENCES Users(UserId)
);

CREATE TABLE AuditLogs (
    AuditLogId INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NULL,
    ActionType NVARCHAR(100) NOT NULL,
    Description NVARCHAR(MAX) NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (UserId) REFERENCES Users(UserId)
);

INSERT INTO Departments (DepartmentName)
VALUES
('FS'),
('Primary'),
('Secondary'),
('Sixth Form'),
('Inclusion'),
('IT'),
('Administration');

INSERT INTO Subjects (SubjectName)
VALUES
('English'),
('Math'),
('Science'),
('Arabic'),
('Islamic'),
('Humanities'),
('ICT'),
('General');

INSERT INTO Purposes (PurposeName)
VALUES
('Classwork'),
('Homework'),
('Assessment'),
('Mock Exam'),
('Final Exam'),
('Display Board'),
('Administrative'),
('Other');

INSERT INTO Roles (RoleName)
VALUES
('SuperAdmin'),
('Admin'),
('PrintingAdmin'),
('Teacher'),
('HOD'),
('HOS');

DECLARE @DefaultPasswordHash NVARCHAR(MAX);
SET @DefaultPasswordHash = '$2b$10$fkfTy6u5eZfF3hEcnXPEtepLA6nn6MT2EyTdH3U6VSo/gTImtBQCa';

INSERT INTO Users
(EmployeeId, FullName, SchoolEmail, DepartmentId, RoleId, PasswordHash, MustChangePassword)
VALUES
('SA0001', 'System Super Admin', 'superadmin1@arabunityschool.ae', 6, 1, @DefaultPasswordHash, 0),
('SA0002', 'Backup Super Admin', 'superadmin2@arabunityschool.ae', 6, 1, @DefaultPasswordHash, 0),
('A1001', 'System Administrator', 'admin@arabunityschool.ae', 7, 2, @DefaultPasswordHash, 0),
('P1001', 'Printing Administrator', 'printing@arabunityschool.ae', 7, 3, @DefaultPasswordHash, 0),
('T1001', 'Teacher Demo', 'teacher@arabunityschool.ae', 2, 4, @DefaultPasswordHash, 0),
('H1001', 'Primary HOD', 'hod.primary@arabunityschool.ae', 2, 5, @DefaultPasswordHash, 0),
('S1001', 'Primary HOS', 'hos.primary@arabunityschool.ae', 2, 6, @DefaultPasswordHash, 0);

INSERT INTO UserSubjects (UserId, SubjectId)
VALUES
(5, 1),
(6, 8),
(7, 1);

INSERT INTO InventoryItems
(ItemName, Category, CurrentStock, MinimumStock, Unit)
VALUES
('A4 Paper', 'Paper', 70, 10, 'Box'),
('A3 Paper', 'Paper', 10, 5, 'Box'),
('Black Toner', 'Toner', 5, 2, 'Piece'),
('Staple Holder SH-10', 'Riso Supplies', 5, 2, 'Box'),
('Brown Envelope', 'Stationery', 2000, 500, 'Piece'),
('White Label FSLA1-100', 'Stationery', 4, 2, 'Bundle');

SELECT 'Database reset and new schema created successfully.' AS Message;