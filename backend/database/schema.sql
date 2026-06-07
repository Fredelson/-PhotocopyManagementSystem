USE PhotocopyManagementDB;
GO

IF OBJECT_ID('Notifications', 'U') IS NOT NULL DROP TABLE Notifications;
IF OBJECT_ID('InventoryItems', 'U') IS NOT NULL DROP TABLE InventoryItems;
IF OBJECT_ID('ApprovalHistory', 'U') IS NOT NULL DROP TABLE ApprovalHistory;
IF OBJECT_ID('RequestAttachments', 'U') IS NOT NULL DROP TABLE RequestAttachments;
IF OBJECT_ID('PhotocopyRequests', 'U') IS NOT NULL DROP TABLE PhotocopyRequests;
IF OBJECT_ID('Users', 'U') IS NOT NULL DROP TABLE Users;
GO

CREATE TABLE Users (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    FullName NVARCHAR(200) NOT NULL,
    SchoolEmail NVARCHAR(255) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(500) NOT NULL,
    Role NVARCHAR(50) NOT NULL,
    Department NVARCHAR(100) NULL,
    Section NVARCHAR(100) NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME NULL
);
GO

CREATE TABLE PhotocopyRequests (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    RequestNumber NVARCHAR(50) NOT NULL UNIQUE,
    TeacherId INT NOT NULL,
    Title NVARCHAR(255) NOT NULL,
    Purpose NVARCHAR(255) NULL,
    Department NVARCHAR(100) NULL,
    Section NVARCHAR(100) NULL,
    TotalPages INT NOT NULL DEFAULT 0,
    TotalSheets INT NOT NULL DEFAULT 0,
    Copies INT NOT NULL DEFAULT 1,
    Status NVARCHAR(50) NOT NULL DEFAULT 'Pending',
    CurrentApproverRole NVARCHAR(50) NULL,
    RequiredApprovalRole NVARCHAR(50) NULL,
    NeededDate DATE NULL,
    Notes NVARCHAR(MAX) NULL,
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME NULL,

    CONSTRAINT FK_PhotocopyRequests_Users
    FOREIGN KEY (TeacherId) REFERENCES Users(Id)
);
GO

CREATE TABLE RequestAttachments (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    RequestId INT NOT NULL,
    FileName NVARCHAR(255) NOT NULL,
    FilePath NVARCHAR(500) NOT NULL,
    FileType NVARCHAR(100) NULL,
    PageCount INT NOT NULL DEFAULT 0,
    UploadedAt DATETIME NOT NULL DEFAULT GETDATE(),

    CONSTRAINT FK_RequestAttachments_Requests
    FOREIGN KEY (RequestId) REFERENCES PhotocopyRequests(Id)
);
GO

CREATE TABLE ApprovalHistory (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    RequestId INT NOT NULL,
    ApproverId INT NOT NULL,
    ApproverRole NVARCHAR(50) NOT NULL,
    Action NVARCHAR(50) NOT NULL,
    Comments NVARCHAR(MAX) NULL,
    ActionDate DATETIME NOT NULL DEFAULT GETDATE(),

    CONSTRAINT FK_ApprovalHistory_Requests
    FOREIGN KEY (RequestId) REFERENCES PhotocopyRequests(Id),

    CONSTRAINT FK_ApprovalHistory_Users
    FOREIGN KEY (ApproverId) REFERENCES Users(Id)
);
GO

CREATE TABLE InventoryItems (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    ItemName NVARCHAR(200) NOT NULL,
    Category NVARCHAR(100) NOT NULL,
    Unit NVARCHAR(50) NOT NULL,
    CurrentStock INT NOT NULL DEFAULT 0,
    MinimumStock INT NOT NULL DEFAULT 0,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME NULL
);
GO

CREATE TABLE Notifications (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    Title NVARCHAR(255) NOT NULL,
    Message NVARCHAR(MAX) NOT NULL,
    IsRead BIT NOT NULL DEFAULT 0,
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),

    CONSTRAINT FK_Notifications_Users
    FOREIGN KEY (UserId) REFERENCES Users(Id)
);
GO