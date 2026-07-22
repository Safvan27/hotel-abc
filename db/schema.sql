-- Hotel ABC — SQL Server schema + seed data
-- Run this in SSMS / Azure Data Studio / sqlcmd against your SQL Server instance.
-- Recreates the shape of src/lib/data.ts (CATEGORIES, ITEMS, SECTIONS, TABLES) as real tables.

IF DB_ID('HotelABC') IS NULL
BEGIN
    CREATE DATABASE HotelABC;
END
GO

USE HotelABC;
GO

IF OBJECT_ID('dbo.MenuItems', 'U') IS NOT NULL DROP TABLE dbo.MenuItems;
IF OBJECT_ID('dbo.Categories', 'U') IS NOT NULL DROP TABLE dbo.Categories;
IF OBJECT_ID('dbo.HotelTables', 'U') IS NOT NULL DROP TABLE dbo.HotelTables;
IF OBJECT_ID('dbo.Sections', 'U') IS NOT NULL DROP TABLE dbo.Sections;
GO

CREATE TABLE dbo.Sections (
    id        INT IDENTITY(1,1) PRIMARY KEY,
    name      NVARCHAR(50) NOT NULL UNIQUE,
    sortOrder INT NOT NULL DEFAULT 0
);
GO

CREATE TABLE dbo.HotelTables (
    id            NVARCHAR(10) PRIMARY KEY,
    num           INT NOT NULL,
    sectionId     INT NOT NULL FOREIGN KEY REFERENCES dbo.Sections(id),
    seats         INT NOT NULL,
    status        NVARCHAR(20) NOT NULL DEFAULT 'free' CHECK (status IN ('free', 'occupied', 'ordered', 'billing')),
    occupiedSince DATETIME2 NULL,
    name          NVARCHAR(50) NULL
);
GO

CREATE TABLE dbo.Categories (
    id        NVARCHAR(20) PRIMARY KEY,
    label     NVARCHAR(50) NOT NULL,
    sortOrder INT NOT NULL DEFAULT 0
);
GO

CREATE TABLE dbo.MenuItems (
    id         NVARCHAR(20) PRIMARY KEY,
    categoryId NVARCHAR(20) NOT NULL FOREIGN KEY REFERENCES dbo.Categories(id),
    name       NVARCHAR(100) NOT NULL,
    price      DECIMAL(10, 2) NOT NULL
);
GO

-- Sections
INSERT INTO dbo.Sections (name, sortOrder) VALUES
    ('AC', 0),
    ('Outdoor', 1);
GO


-- Categories
INSERT INTO dbo.Categories (id, label, sortOrder) VALUES
    ('soft',     'SOFTDRINKS', 0),
    ('starters', 'STARTERS',   1),
    ('hot',      'HOTDRINK',   2),
    ('breads',   'BREADS',     3),
    ('biriyani', 'BIRIYANI',   4),
    ('rices',    'RICES',      5),
    ('mandi',    'MANDI',      6),
    ('chicken',  'CHICKEN',    7);
GO

-- Menu items
INSERT INTO dbo.MenuItems (id, categoryId, name, price) VALUES
    ('s1',  'soft',     'Water 2L',                   60),
    ('s2',  'soft',     '7UP 320ML',                  40),
    ('s3',  'soft',     'Pepsi 320ML',                40),
    ('s4',  'soft',     'Mirinda 320ML',              40),
    ('s5',  'soft',     'Sting 320ML',                40),
    ('s6',  'soft',     'Cola 250ML',                 35),
    ('s7',  'soft',     'Sprite 185ML',               30),
    ('s8',  'soft',     'Badam Milk',                 50),
    ('st1', 'starters', 'Chicken 65',                 180),
    ('st2', 'starters', 'Paneer Tikka',               200),
    ('st3', 'starters', 'Chilli Chicken',             220),
    ('st4', 'starters', 'Gobi Manchurian',            170),
    ('h1',  'hot',      'Filter Coffee',              40),
    ('h2',  'hot',      'Masala Chai',                30),
    ('h3',  'hot',      'Green Tea',                  35),
    ('b1',  'breads',   'Butter Naan',                40),
    ('b2',  'breads',   'Tandoori Roti',              20),
    ('b3',  'breads',   'Garlic Naan',                50),
    ('b4',  'breads',   'Kulcha',                     45),
    ('br1', 'biriyani', 'Hyderabadi Chicken Biryani', 250),
    ('br2', 'biriyani', 'Kerala Biryani',             230),
    ('br3', 'biriyani', 'Mutton Biryani',             350),
    ('br4', 'biriyani', 'Ambur Biryani',              200),
    ('br5', 'biriyani', 'Fish Biryani',               250),
    ('br6', 'biriyani', 'Veg Biryani',                180),
    ('r1',  'rices',    'Ghee Rice',                  90),
    ('r2',  'rices',    'Jeera Rice',                 100),
    ('r3',  'rices',    'Fried Rice',                 120),
    ('r4',  'rices',    'Curd Rice',                  80),
    ('m1',  'mandi',    'Chicken Mandi',              300),
    ('m2',  'mandi',    'Mutton Mandi',               450),
    ('m3',  'mandi',    'Veg Mandi',                  220),
    ('c1',  'chicken',  'Chicken Roast',              220),
    ('c2',  'chicken',  'Chicken Chilli',             240),
    ('c3',  'chicken',  'Butter Chicken',             260),
    ('c4',  'chicken',  'Tandoori Chicken',           280);
GO
