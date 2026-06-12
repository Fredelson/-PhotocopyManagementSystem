-- ============================================
-- ARAB UNITY SCHOOL
-- Clean Reset Script
-- Removes all users and workflow data
-- Keeps master data tables
-- ============================================

USE PhotocopyManagementDB;
GO

-- ============================================
-- Delete Workflow Data
-- ============================================

DELETE FROM PrintingLogs;
DELETE FROM RequestApprovals;
DELETE FROM RequestAttachments;
DELETE FROM PhotocopyRequests;
DELETE FROM Notifications;
DELETE FROM AuditLogs;
DELETE FROM InventoryTransactions;
GO

-- ============================================
-- Delete User Subject Mapping
-- ============================================

DELETE FROM UserSubjects;
GO

-- ============================================
-- Delete All Users
-- ============================================

DELETE FROM Users;
GO

-- ============================================
-- Reset Identity Values
-- ============================================

DBCC CHECKIDENT ('Users', RESEED, 0);
DBCC CHECKIDENT ('UserSubjects', RESEED, 0);
DBCC CHECKIDENT ('PhotocopyRequests', RESEED, 0);
DBCC CHECKIDENT ('RequestApprovals', RESEED, 0);
DBCC CHECKIDENT ('RequestAttachments', RESEED, 0);
DBCC CHECKIDENT ('PrintingLogs', RESEED, 0);
DBCC CHECKIDENT ('Notifications', RESEED, 0);
DBCC CHECKIDENT ('AuditLogs', RESEED, 0);
DBCC CHECKIDENT ('InventoryTransactions', RESEED, 0);
GO

-- ============================================
-- Verification
-- ============================================

SELECT 'Users' AS TableName, COUNT(*) AS TotalRows FROM Users
UNION ALL
SELECT 'UserSubjects', COUNT(*) FROM UserSubjects
UNION ALL
SELECT 'PhotocopyRequests', COUNT(*) FROM PhotocopyRequests
UNION ALL
SELECT 'RequestApprovals', COUNT(*) FROM RequestApprovals
UNION ALL
SELECT 'RequestAttachments', COUNT(*) FROM RequestAttachments
UNION ALL
SELECT 'PrintingLogs', COUNT(*) FROM PrintingLogs
UNION ALL
SELECT 'Notifications', COUNT(*) FROM Notifications
UNION ALL
SELECT 'AuditLogs', COUNT(*) FROM AuditLogs
UNION ALL
SELECT 'InventoryTransactions', COUNT(*) FROM InventoryTransactions;
GO

-- ============================================
-- Master Tables Still Preserved
-- ============================================

SELECT * FROM Departments;
SELECT * FROM Subjects;
SELECT * FROM Purposes;
GO