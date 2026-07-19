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
