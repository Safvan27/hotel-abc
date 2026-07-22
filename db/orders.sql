-- Hotel ABC — Orders + OrderItems
-- Run against the HotelABC database created by db/schema.sql (adds to it, does not touch existing tables).

USE HotelABC;
GO

IF OBJECT_ID('dbo.OrderItems', 'U') IS NOT NULL DROP TABLE dbo.OrderItems;
IF OBJECT_ID('dbo.Orders', 'U') IS NOT NULL DROP TABLE dbo.Orders;
GO

CREATE TABLE dbo.Orders (
    id            INT IDENTITY(1,1) PRIMARY KEY,
    tableId       NVARCHAR(10) NOT NULL FOREIGN KEY REFERENCES dbo.HotelTables(id),
    status        NVARCHAR(20) NOT NULL DEFAULT 'open'
                  CHECK (status IN ('open', 'held', 'sent', 'billing', 'completed', 'cancelled')),
    serveSection  NVARCHAR(20) NOT NULL DEFAULT 'Dine In',
    customerName  NVARCHAR(100) NULL,
    customerPhone NVARCHAR(30) NULL,
    createdAt     DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    updatedAt     DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);
GO

-- name/price are captured at order time, independent of later MenuItems edits
CREATE TABLE dbo.OrderItems (
    id      INT IDENTITY(1,1) PRIMARY KEY,
    orderId INT NOT NULL FOREIGN KEY REFERENCES dbo.Orders(id) ON DELETE CASCADE,
    itemId  NVARCHAR(20) NOT NULL,
    name    NVARCHAR(100) NOT NULL,
    price   DECIMAL(10, 2) NOT NULL,
    qty     INT NOT NULL,
    note    NVARCHAR(200) NULL
);
GO

CREATE INDEX IX_Orders_TableId_Status ON dbo.Orders(tableId, status);
GO

-- Seed data — one open order per table that schema.sql marks occupied/billing.
-- Free tables get no rows here, so their order stays empty until the waiter adds items.
DECLARE @OrderId INT;

-- T1 — occupied 18 min ago
INSERT INTO dbo.Orders (tableId, status, serveSection, customerName, customerPhone, createdAt, updatedAt)
VALUES ('T1', 'sent', 'Dine In', '', '', DATEADD(MINUTE, -18, SYSDATETIME()), DATEADD(MINUTE, -18, SYSDATETIME()));
SET @OrderId = SCOPE_IDENTITY();
INSERT INTO dbo.OrderItems (orderId, itemId, name, price, qty, note) VALUES
    (@OrderId, 'st1', 'Chicken 65',    180, 1, ''),
    (@OrderId, 'b1',  'Butter Naan',   40,  2, ''),
    (@OrderId, 's7',  'Sprite 185ML',  30,  2, '');
GO

-- T2 — billing 31 min ago
DECLARE @OrderId INT;
INSERT INTO dbo.Orders (tableId, status, serveSection, customerName, customerPhone, createdAt, updatedAt)
VALUES ('T2', 'billing', 'Dine In', '', '', DATEADD(MINUTE, -31, SYSDATETIME()), DATEADD(MINUTE, -5, SYSDATETIME()));
SET @OrderId = SCOPE_IDENTITY();
INSERT INTO dbo.OrderItems (orderId, itemId, name, price, qty, note) VALUES
    (@OrderId, 'br1', 'Hyderabadi Chicken Biryani', 250, 2, ''),
    (@OrderId, 'st1', 'Chicken 65',                 180, 1, ''),
    (@OrderId, 's1',  'Water 2L',                   60,  1, '');
GO

-- T5 — occupied 70 min ago
DECLARE @OrderId INT;
INSERT INTO dbo.Orders (tableId, status, serveSection, customerName, customerPhone, createdAt, updatedAt)
VALUES ('T5', 'sent', 'Dine In', '', '', DATEADD(MINUTE, -70, SYSDATETIME()), DATEADD(MINUTE, -60, SYSDATETIME()));
SET @OrderId = SCOPE_IDENTITY();
INSERT INTO dbo.OrderItems (orderId, itemId, name, price, qty, note) VALUES
    (@OrderId, 'br3', 'Mutton Biryani', 350, 1, ''),
    (@OrderId, 'c3',  'Butter Chicken', 260, 1, ''),
    (@OrderId, 'b3',  'Garlic Naan',    50,  3, ''),
    (@OrderId, 'h2',  'Masala Chai',    30,  2, '');
GO

-- T7 — billing 6 min ago
DECLARE @OrderId INT;
INSERT INTO dbo.Orders (tableId, status, serveSection, customerName, customerPhone, createdAt, updatedAt)
VALUES ('T7', 'billing', 'Dine In', '', '', DATEADD(MINUTE, -6, SYSDATETIME()), DATEADD(MINUTE, -1, SYSDATETIME()));
SET @OrderId = SCOPE_IDENTITY();
INSERT INTO dbo.OrderItems (orderId, itemId, name, price, qty, note) VALUES
    (@OrderId, 'h1', 'Filter Coffee',   40,  2, ''),
    (@OrderId, 'c2', 'Chicken Chilli',  240, 1, '');
GO

-- T10 — occupied 45 min ago
DECLARE @OrderId INT;
INSERT INTO dbo.Orders (tableId, status, serveSection, customerName, customerPhone, createdAt, updatedAt)
VALUES ('T10', 'sent', 'Dine In', '', '', DATEADD(MINUTE, -45, SYSDATETIME()), DATEADD(MINUTE, -40, SYSDATETIME()));
SET @OrderId = SCOPE_IDENTITY();
INSERT INTO dbo.OrderItems (orderId, itemId, name, price, qty, note) VALUES
    (@OrderId, 'm1', 'Chicken Mandi',  300, 2, ''),
    (@OrderId, 'm3', 'Veg Mandi',      220, 1, ''),
    (@OrderId, 'b2', 'Tandoori Roti',  20,  4, ''),
    (@OrderId, 's6', 'Cola 250ML',     35,  3, '');
GO

-- T12 — occupied 71 min ago
DECLARE @OrderId INT;
INSERT INTO dbo.Orders (tableId, status, serveSection, customerName, customerPhone, createdAt, updatedAt)
VALUES ('T12', 'sent', 'Dine In', '', '', DATEADD(MINUTE, -71, SYSDATETIME()), DATEADD(MINUTE, -65, SYSDATETIME()));
SET @OrderId = SCOPE_IDENTITY();
INSERT INTO dbo.OrderItems (orderId, itemId, name, price, qty, note) VALUES
    (@OrderId, 'c1', 'Chicken Roast', 220, 1, ''),
    (@OrderId, 'r1', 'Ghee Rice',     90,  1, '');
GO
