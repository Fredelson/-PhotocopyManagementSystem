USE PhotocopyManagementDB;
GO

-- ============================================
-- AUS OPERATIONS PLATFORM
-- SUPER ADMIN FOUNDATION SCHEMA
-- Run inside PhotocopyManagementDB
-- ============================================

-- 1. Roles
IF OBJECT_ID('dbo.Roles', 'U') IS NULL
BEGIN
    CREATE TABLE Roles (
        RoleId INT IDENTITY(1,1) PRIMARY KEY,
        RoleKey NVARCHAR(50) NOT NULL UNIQUE,
        RoleName NVARCHAR(100) NOT NULL,
        Description NVARCHAR(255) NULL,
        IsSystemRole BIT NOT NULL DEFAULT 0,
        IsActive BIT NOT NULL DEFAULT 1,
        CreatedAt DATETIME NOT NULL DEFAULT GETDATE()
    );
END
GO

-- 2. Permission Groups
IF OBJECT_ID('dbo.PermissionGroups', 'U') IS NULL
BEGIN
    CREATE TABLE PermissionGroups (
        PermissionGroupId INT IDENTITY(1,1) PRIMARY KEY,
        GroupKey NVARCHAR(100) NOT NULL UNIQUE,
        GroupName NVARCHAR(150) NOT NULL,
        Description NVARCHAR(255) NULL,
        SortOrder INT NOT NULL DEFAULT 0,
        CreatedAt DATETIME NOT NULL DEFAULT GETDATE()
    );
END
GO

-- 3. Permissions
IF OBJECT_ID('dbo.Permissions', 'U') IS NULL
BEGIN
    CREATE TABLE Permissions (
        PermissionId INT IDENTITY(1,1) PRIMARY KEY,
        PermissionKey NVARCHAR(100) NOT NULL UNIQUE,
        PermissionName NVARCHAR(150) NOT NULL,
        ModuleKey NVARCHAR(100) NOT NULL,
        PermissionGroupId INT NULL,
        Description NVARCHAR(255) NULL,
        IsActive BIT NOT NULL DEFAULT 1,
        CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),

        CONSTRAINT FK_Permissions_PermissionGroups
            FOREIGN KEY (PermissionGroupId)
            REFERENCES PermissionGroups(PermissionGroupId)
    );
END
GO

-- 4. Role Permissions
IF OBJECT_ID('dbo.RolePermissions', 'U') IS NULL
BEGIN
    CREATE TABLE RolePermissions (
        RolePermissionId INT IDENTITY(1,1) PRIMARY KEY,
        RoleId INT NOT NULL,
        PermissionId INT NOT NULL,
        IsAllowed BIT NOT NULL DEFAULT 1,
        CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),

        CONSTRAINT FK_RolePermissions_Roles
            FOREIGN KEY (RoleId) REFERENCES Roles(RoleId),

        CONSTRAINT FK_RolePermissions_Permissions
            FOREIGN KEY (PermissionId) REFERENCES Permissions(PermissionId),

        CONSTRAINT UQ_RolePermissions UNIQUE (RoleId, PermissionId)
    );
END
GO

-- 5. User Permission Overrides
IF OBJECT_ID('dbo.UserPermissionOverrides', 'U') IS NULL
BEGIN
    CREATE TABLE UserPermissionOverrides (
        UserPermissionOverrideId INT IDENTITY(1,1) PRIMARY KEY,
        UserId INT NOT NULL,
        PermissionId INT NOT NULL,
        IsAllowed BIT NOT NULL,
        Reason NVARCHAR(255) NULL,
        CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),

        CONSTRAINT FK_UserPermissionOverrides_Users
            FOREIGN KEY (UserId) REFERENCES Users(UserId),

        CONSTRAINT FK_UserPermissionOverrides_Permissions
            FOREIGN KEY (PermissionId) REFERENCES Permissions(PermissionId),

        CONSTRAINT UQ_UserPermissionOverrides UNIQUE (UserId, PermissionId)
    );
END
GO

-- 6. Modules
IF OBJECT_ID('dbo.Modules', 'U') IS NULL
BEGIN
    CREATE TABLE Modules (
        ModuleId INT IDENTITY(1,1) PRIMARY KEY,
        ModuleKey NVARCHAR(100) NOT NULL UNIQUE,
        ModuleName NVARCHAR(150) NOT NULL,
        Description NVARCHAR(255) NULL,
        Icon NVARCHAR(100) NULL,
        BaseRoute NVARCHAR(150) NULL,
        Status NVARCHAR(30) NOT NULL DEFAULT 'Active',
        IsActive BIT NOT NULL DEFAULT 1,
        SortOrder INT NOT NULL DEFAULT 0,
        CreatedAt DATETIME NOT NULL DEFAULT GETDATE()
    );
END
GO

-- 7. Menus
IF OBJECT_ID('dbo.Menus', 'U') IS NULL
BEGIN
    CREATE TABLE Menus (
        MenuId INT IDENTITY(1,1) PRIMARY KEY,
        ModuleId INT NOT NULL,
        ParentMenuId INT NULL,
        MenuKey NVARCHAR(100) NOT NULL UNIQUE,
        MenuName NVARCHAR(150) NOT NULL,
        Route NVARCHAR(150) NULL,
        Icon NVARCHAR(100) NULL,
        RequiredPermissionKey NVARCHAR(100) NULL,
        IsVisible BIT NOT NULL DEFAULT 1,
        IsActive BIT NOT NULL DEFAULT 1,
        SortOrder INT NOT NULL DEFAULT 0,
        CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),

        CONSTRAINT FK_Menus_Modules
            FOREIGN KEY (ModuleId) REFERENCES Modules(ModuleId),

        CONSTRAINT FK_Menus_Parent
            FOREIGN KEY (ParentMenuId) REFERENCES Menus(MenuId)
    );
END
GO

-- 8. Menu Permissions
IF OBJECT_ID('dbo.MenuPermissions', 'U') IS NULL
BEGIN
    CREATE TABLE MenuPermissions (
        MenuPermissionId INT IDENTITY(1,1) PRIMARY KEY,
        MenuId INT NOT NULL,
        PermissionId INT NOT NULL,
        CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),

        CONSTRAINT FK_MenuPermissions_Menus
            FOREIGN KEY (MenuId) REFERENCES Menus(MenuId),

        CONSTRAINT FK_MenuPermissions_Permissions
            FOREIGN KEY (PermissionId) REFERENCES Permissions(PermissionId),

        CONSTRAINT UQ_MenuPermissions UNIQUE (MenuId, PermissionId)
    );
END
GO

-- 9. Buttons
IF OBJECT_ID('dbo.Buttons', 'U') IS NULL
BEGIN
    CREATE TABLE Buttons (
        ButtonId INT IDENTITY(1,1) PRIMARY KEY,
        ModuleId INT NOT NULL,
        ButtonKey NVARCHAR(100) NOT NULL UNIQUE,
        ButtonName NVARCHAR(150) NOT NULL,
        RequiredPermissionKey NVARCHAR(100) NULL,
        IsVisible BIT NOT NULL DEFAULT 1,
        IsActive BIT NOT NULL DEFAULT 1,
        CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),

        CONSTRAINT FK_Buttons_Modules
            FOREIGN KEY (ModuleId) REFERENCES Modules(ModuleId)
    );
END
GO

-- 10. Widgets
IF OBJECT_ID('dbo.Widgets', 'U') IS NULL
BEGIN
    CREATE TABLE Widgets (
        WidgetId INT IDENTITY(1,1) PRIMARY KEY,
        ModuleId INT NULL,
        WidgetKey NVARCHAR(100) NOT NULL UNIQUE,
        WidgetName NVARCHAR(150) NOT NULL,
        Description NVARCHAR(255) NULL,
        RequiredPermissionKey NVARCHAR(100) NULL,
        IsVisible BIT NOT NULL DEFAULT 1,
        IsActive BIT NOT NULL DEFAULT 1,
        SortOrder INT NOT NULL DEFAULT 0,
        CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),

        CONSTRAINT FK_Widgets_Modules
            FOREIGN KEY (ModuleId) REFERENCES Modules(ModuleId)
    );
END
GO

-- 11. Feature Flags
IF OBJECT_ID('dbo.FeatureFlags', 'U') IS NULL
BEGIN
    CREATE TABLE FeatureFlags (
        FeatureFlagId INT IDENTITY(1,1) PRIMARY KEY,
        FeatureKey NVARCHAR(100) NOT NULL UNIQUE,
        FeatureName NVARCHAR(150) NOT NULL,
        Description NVARCHAR(255) NULL,
        IsEnabled BIT NOT NULL DEFAULT 0,
        CreatedAt DATETIME NOT NULL DEFAULT GETDATE()
    );
END
GO

-- 12. Audit Logs
IF OBJECT_ID('dbo.AuditLogs', 'U') IS NULL
BEGIN
    CREATE TABLE AuditLogs (
        AuditId INT IDENTITY(1,1) PRIMARY KEY,
        UserId INT NULL,
        Action NVARCHAR(150) NOT NULL,
        ModuleKey NVARCHAR(100) NULL,
        RecordId NVARCHAR(100) NULL,
        OldValue NVARCHAR(MAX) NULL,
        NewValue NVARCHAR(MAX) NULL,
        IPAddress NVARCHAR(50) NULL,
        CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),

        CONSTRAINT FK_AuditLogs_Users
            FOREIGN KEY (UserId) REFERENCES Users(UserId)
    );
END
GO

-- 13. System Settings
IF OBJECT_ID('dbo.SystemSettings', 'U') IS NULL
BEGIN
    CREATE TABLE SystemSettings (
        SettingId INT IDENTITY(1,1) PRIMARY KEY,
        SettingKey NVARCHAR(100) NOT NULL UNIQUE,
        SettingValue NVARCHAR(MAX) NULL,
        SettingGroup NVARCHAR(100) NULL,
        Description NVARCHAR(255) NULL,
        IsEditable BIT NOT NULL DEFAULT 1,
        UpdatedAt DATETIME NOT NULL DEFAULT GETDATE()
    );
END
GO

-- FINAL CHECK
SELECT TABLE_NAME
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_NAME IN
(
    'Roles',
    'PermissionGroups',
    'Permissions',
    'RolePermissions',
    'UserPermissionOverrides',
    'Modules',
    'Menus',
    'MenuPermissions',
    'Buttons',
    'Widgets',
    'FeatureFlags',
    'AuditLogs',
    'SystemSettings'
)
ORDER BY TABLE_NAME;