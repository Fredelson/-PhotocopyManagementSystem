CREATE DATABASE PhotocopyManagementSystem;
GO

USE PhotocopyManagementSystem;
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

CREATE TABLE Users (
    UserId INT IDENTITY(1,1) PRIMARY KEY,
    SchoolId NVARCHAR(50) NOT NULL UNIQUE,
    FullName NVARCHAR(255) NOT NULL,
    Email NVARCHAR(255) NOT NULL UNIQUE,
    Department NVARCHAR(100) NULL,
    Subject NVARCHAR(100) NULL,
    Role NVARCHAR(50) NOT NULL,
    PasswordHash NVARCHAR(MAX) NOT NULL,
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME DEFAULT GETDATE(),
    DepartmentId INT NULL,
    FOREIGN KEY (DepartmentId) REFERENCES Departments(DepartmentId)
);

CREATE TABLE UserSubjects (
    UserSubjectId INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    SubjectId INT NOT NULL,
    IsActive BIT DEFAULT 1,
    FOREIGN KEY (UserId) REFERENCES Users(UserId),
    FOREIGN KEY (SubjectId) REFERENCES Subjects(SubjectId),
    CONSTRAINT UQ_User_Subject UNIQUE (UserId, SubjectId)
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
    PriorityLevel NVARCHAR(20) DEFAULT 'Normal',
    Status NVARCHAR(50) DEFAULT 'Pending',
    CurrentApproverId INT NULL,
    SubmittedAt DATETIME DEFAULT GETDATE(),
    ApprovedAt DATETIME NULL,
    PrintedAt DATETIME NULL,
    CompletedAt DATETIME NULL,
    Remarks NVARCHAR(MAX) NULL,
    PaperSize NVARCHAR(20) NULL,
    PrintType NVARCHAR(50) NULL,
    DueDate DATETIME NULL,
    PrintSide NVARCHAR(20) NULL,
    IsExam BIT DEFAULT 0,
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
    Copies INT NOT NULL DEFAULT 1,
    TotalSheets INT NULL,
    UploadedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (RequestId) REFERENCES PhotocopyRequests(RequestId)
);

CREATE TABLE RequestApprovals (
    ApprovalId INT IDENTITY(1,1) PRIMARY KEY,
    RequestId INT NOT NULL,
    ApproverId INT NOT NULL,
    ApprovalRole NVARCHAR(50) NOT NULL,
    ApprovalStatus NVARCHAR(50) NOT NULL,
    Remarks NVARCHAR(MAX) NULL,
    ActionDate DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (RequestId) REFERENCES PhotocopyRequests(RequestId),
    FOREIGN KEY (ApproverId) REFERENCES Users(UserId)
);

CREATE TABLE InventoryItems (
    ItemId INT IDENTITY(1,1) PRIMARY KEY,
    ItemName NVARCHAR(255) NOT NULL,
    Category NVARCHAR(100) NOT NULL,
    CurrentStock INT NOT NULL DEFAULT 0,
    MinimumStock INT NOT NULL DEFAULT 0,
    Unit NVARCHAR(50) NOT NULL,
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME DEFAULT GETDATE()
);

CREATE TABLE InventoryTransactions (
    TransactionId INT IDENTITY(1,1) PRIMARY KEY,
    ItemId INT NOT NULL,
    TransactionType NVARCHAR(50) NOT NULL,
    Quantity INT NOT NULL,
    Remarks NVARCHAR(500) NULL,
    CreatedBy INT NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (ItemId) REFERENCES InventoryItems(ItemId),
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
GO