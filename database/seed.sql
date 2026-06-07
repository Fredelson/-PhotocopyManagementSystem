USE PhotocopyManagementSystem;
GO

INSERT INTO Departments (DepartmentName)
VALUES
('FS'),
('Primary'),
('Secondary'),
('Sixth Form'),
('Inclusion');

INSERT INTO Subjects (SubjectName)
VALUES
('English'),
('Math'),
('Science'),
('Arabic'),
('ICT'),
('Humanities'),
('Inclusion');

INSERT INTO Purposes (PurposeName)
VALUES
('Examination'),
('Assessment'),
('Worksheet'),
('Homework'),
('Revision Material'),
('Project'),
('Display Board'),
('Student Activity'),
('Meeting Material'),
('Other');

INSERT INTO InventoryItems
(ItemName, Category, CurrentStock, MinimumStock, Unit)
VALUES
('A4 Paper', 'Paper', 500, 100, 'Boxes'),
('A3 Paper', 'Paper', 100, 20, 'Boxes'),
('Brown Envelope', 'Stationery', 5000, 1000, 'Pieces'),
('White Label FSLA10-100', 'Stationery', 100, 20, 'Bundles'),
('DXB Black Toner', 'Toner', 20, 5, 'Pieces'),
('DXB Color Toner', 'Toner', 10, 3, 'Pieces'),
('SH-10 Staples', 'Consumables', 50, 10, 'Boxes'),
('A3 Laminating Pouch', 'Lamination', 100, 20, 'Bundles'),
('A4 Laminating Pouch', 'Lamination', 100, 20, 'Bundles');
GO