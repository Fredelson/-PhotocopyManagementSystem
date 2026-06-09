USE master;
GO

IF DB_ID('PhotocopyManagementDB') IS NULL
BEGIN
    CREATE DATABASE PhotocopyManagementDB;
END
GO

USE PhotocopyManagementDB;
GO

----------------------------------------------------
-- DROP TABLES IN CORRECT ORDER
----------------------------------------------------

DROP TABLE IF EXISTS AuditLogs;
DROP TABLE IF EXISTS Notifications;
DROP TABLE IF EXISTS InventoryUsage;
DROP TABLE IF EXISTS ApprovalHistory;
DROP TABLE IF EXISTS RequestAttachments;
DROP TABLE IF EXISTS PhotocopyRequests;
DROP TABLE IF EXISTS InventoryItems;
DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS PaperSizes;
DROP TABLE IF EXISTS Departments;
DROP TABLE IF EXISTS SchoolSections;
GO

----------------------------------------------------
-- SCHOOL SECTIONS
-- FS, Primary, Secondary, Sixth Form, Inclusion
----------------------------------------------------

CREATE TABLE SchoolSections (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    SectionName NVARCHAR(100) NOT NULL UNIQUE,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE()
);
GO

----------------------------------------------------
-- DEPARTMENTS
-- English, Math, Science, ICT, etc.
----------------------------------------------------

CREATE TABLE Departments (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    DepartmentName NVARCHAR(100) NOT NULL UNIQUE,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE()
);
GO

----------------------------------------------------
-- PAPER SIZES
-- A4, A3
----------------------------------------------------

CREATE TABLE PaperSizes (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    SizeName NVARCHAR(50) NOT NULL UNIQUE,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE()
);
GO

----------------------------------------------------
-- USERS
----------------------------------------------------

CREATE TABLE Users (
    Id INT IDENTITY(1,1) PRIMARY KEY,

    FullName NVARCHAR(200) NOT NULL,
    SchoolEmail NVARCHAR(255) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(500) NOT NULL,

    Role NVARCHAR(50) NOT NULL,
    -- SuperAdmin, Admin, Teacher, HOD, HOS

    DepartmentId INT NULL,
    SectionId INT NULL,

    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME NULL,

    CONSTRAINT FK_Users_Departments
    FOREIGN KEY (DepartmentId) REFERENCES Departments(Id),

    CONSTRAINT FK_Users_SchoolSections
    FOREIGN KEY (SectionId) REFERENCES SchoolSections(Id)
);
GO

----------------------------------------------------
-- PHOTOCOPY REQUESTS
----------------------------------------------------

CREATE TABLE PhotocopyRequests (
    Id INT IDENTITY(1,1) PRIMARY KEY,

    RequestNumber NVARCHAR(50) NOT NULL UNIQUE,
    TeacherId INT NOT NULL,

    Title NVARCHAR(255) NOT NULL,
    Purpose NVARCHAR(255) NULL,

    DepartmentId INT NOT NULL,
    SectionId INT NOT NULL,
    PaperSizeId INT NULL,

    TotalPages INT NOT NULL DEFAULT 0,
    TotalSheets INT NOT NULL DEFAULT 0,
    Copies INT NOT NULL DEFAULT 1,

    Status NVARCHAR(50) NOT NULL DEFAULT 'Pending',
    -- Pending, HOD Approved, HOS Approved, Rejected, Printing, Completed, Cancelled

    ApprovalLevel INT NOT NULL DEFAULT 1,
    CurrentApproverRole NVARCHAR(50) NULL,
    RequiredApprovalRole NVARCHAR(50) NULL,

    NeededDate DATE NULL,
    Notes NVARCHAR(MAX) NULL,

    PrintedBy INT NULL,
    PrintedAt DATETIME NULL,
    CompletedAt DATETIME NULL,
    ActualPagesPrinted INT NULL,

    CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME NULL,

    CONSTRAINT FK_PhotocopyRequests_Teacher
    FOREIGN KEY (TeacherId) REFERENCES Users(Id),

    CONSTRAINT FK_PhotocopyRequests_Department
    FOREIGN KEY (DepartmentId) REFERENCES Departments(Id),

    CONSTRAINT FK_PhotocopyRequests_Section
    FOREIGN KEY (SectionId) REFERENCES SchoolSections(Id),

    CONSTRAINT FK_PhotocopyRequests_PaperSize
    FOREIGN KEY (PaperSizeId) REFERENCES PaperSizes(Id),

    CONSTRAINT FK_PhotocopyRequests_PrintedBy
    FOREIGN KEY (PrintedBy) REFERENCES Users(Id)
);
GO

----------------------------------------------------
-- REQUEST ATTACHMENTS
----------------------------------------------------

CREATE TABLE RequestAttachments (
    Id INT IDENTITY(1,1) PRIMARY KEY,

    RequestId INT NOT NULL,

    OriginalFileName NVARCHAR(255) NOT NULL,
    StoredFileName NVARCHAR(255) NOT NULL,
    FilePath NVARCHAR(500) NOT NULL,
    FileType NVARCHAR(100) NULL,
    FileSize BIGINT NULL,

    PageCount INT NOT NULL DEFAULT 0,

    UploadedAt DATETIME NOT NULL DEFAULT GETDATE(),

    CONSTRAINT FK_RequestAttachments_Requests
    FOREIGN KEY (RequestId) REFERENCES PhotocopyRequests(Id)
    ON DELETE CASCADE
);
GO

----------------------------------------------------
-- APPROVAL HISTORY
----------------------------------------------------

CREATE TABLE ApprovalHistory (
    Id INT IDENTITY(1,1) PRIMARY KEY,

    RequestId INT NOT NULL,
    ApproverId INT NOT NULL,

    ApproverRole NVARCHAR(50) NOT NULL,
    Action NVARCHAR(50) NOT NULL,
    -- Approved, Rejected, Returned, Cancelled

    Comments NVARCHAR(MAX) NULL,
    ActionDate DATETIME NOT NULL DEFAULT GETDATE(),

    CONSTRAINT FK_ApprovalHistory_Requests
    FOREIGN KEY (RequestId) REFERENCES PhotocopyRequests(Id)
    ON DELETE CASCADE,

    CONSTRAINT FK_ApprovalHistory_Users
    FOREIGN KEY (ApproverId) REFERENCES Users(Id)
);
GO

----------------------------------------------------
-- INVENTORY ITEMS
----------------------------------------------------

CREATE TABLE InventoryItems (
    Id INT IDENTITY(1,1) PRIMARY KEY,

    ItemName NVARCHAR(200) NOT NULL,
    Category NVARCHAR(100) NOT NULL,
    -- Paper, Toner, Staple, Label, Envelope

    Unit NVARCHAR(50) NOT NULL,
    -- Ream, Box, Piece, Bundle, Cartridge

    CurrentStock INT NOT NULL DEFAULT 0,
    MinimumStock INT NOT NULL DEFAULT 0,

    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME NULL
);
GO

----------------------------------------------------
-- INVENTORY USAGE
----------------------------------------------------

CREATE TABLE InventoryUsage (
    Id INT IDENTITY(1,1) PRIMARY KEY,

    RequestId INT NOT NULL,
    InventoryItemId INT NOT NULL,

    QuantityUsed INT NOT NULL,
    UsedBy INT NULL,

    UsedAt DATETIME NOT NULL DEFAULT GETDATE(),

    CONSTRAINT FK_InventoryUsage_Request
    FOREIGN KEY (RequestId) REFERENCES PhotocopyRequests(Id),

    CONSTRAINT FK_InventoryUsage_Item
    FOREIGN KEY (InventoryItemId) REFERENCES InventoryItems(Id),

    CONSTRAINT FK_InventoryUsage_User
    FOREIGN KEY (UsedBy) REFERENCES Users(Id)
);
GO

----------------------------------------------------
-- NOTIFICATIONS
----------------------------------------------------

CREATE TABLE Notifications (
    Id INT IDENTITY(1,1) PRIMARY KEY,

    UserId INT NOT NULL,
    RequestId INT NULL,

    Title NVARCHAR(255) NOT NULL,
    Message NVARCHAR(MAX) NOT NULL,

    IsRead BIT NOT NULL DEFAULT 0,
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),

    CONSTRAINT FK_Notifications_Users
    FOREIGN KEY (UserId) REFERENCES Users(Id),

    CONSTRAINT FK_Notifications_Requests
    FOREIGN KEY (RequestId) REFERENCES PhotocopyRequests(Id)
);
GO

----------------------------------------------------
-- AUDIT LOGS
----------------------------------------------------

CREATE TABLE AuditLogs (
    Id INT IDENTITY(1,1) PRIMARY KEY,

    UserId INT NULL,

    Action NVARCHAR(200) NOT NULL,
    EntityName NVARCHAR(100) NOT NULL,
    EntityId INT NULL,
    Details NVARCHAR(MAX) NULL,

    CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),

    CONSTRAINT FK_AuditLogs_Users
    FOREIGN KEY (UserId) REFERENCES Users(Id)
);
GO

----------------------------------------------------
-- INDEXES
----------------------------------------------------

CREATE INDEX IX_Users_Role ON Users(Role);
CREATE INDEX IX_Users_DepartmentId ON Users(DepartmentId);
CREATE INDEX IX_Users_SectionId ON Users(SectionId);

CREATE INDEX IX_PhotocopyRequests_TeacherId ON PhotocopyRequests(TeacherId);
CREATE INDEX IX_PhotocopyRequests_Status ON PhotocopyRequests(Status);
CREATE INDEX IX_PhotocopyRequests_DepartmentId ON PhotocopyRequests(DepartmentId);
CREATE INDEX IX_PhotocopyRequests_SectionId ON PhotocopyRequests(SectionId);
CREATE INDEX IX_PhotocopyRequests_CreatedAt ON PhotocopyRequests(CreatedAt);

CREATE INDEX IX_ApprovalHistory_RequestId ON ApprovalHistory(RequestId);
CREATE INDEX IX_RequestAttachments_RequestId ON RequestAttachments(RequestId);
CREATE INDEX IX_Notifications_UserId ON Notifications(UserId);
CREATE INDEX IX_InventoryUsage_RequestId ON InventoryUsage(RequestId);
GO

PRINT 'PhotocopyManagementDB schema created successfully.';
GO