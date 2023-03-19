-- Add sample data 

insert into dbo.authors 
    (id, first_name, middle_name, last_name)
values
    (1, 'Isaac', null, 'Asimov'),
    (2, 'Robert', 'A.', 'Heinlein'),
    (3, 'Robert', null, 'Silvenberg'),
    (4, 'Dan', null, 'Simmons'),
    (5, 'Davide', null, 'Mauri'),
    (6, 'Bob', null, 'Ward'),
    (7, 'Anna', null, 'Hoffman'),
    (8, 'Silvano', null, 'Coriani'),
    (9, 'Sanjay', null, 'Mishra'),
    (10, 'Jovan', null, 'Popovic')
go

insert into dbo.books 
    (id, title, [year], [pages])
values
    (1000, 'Prelude to Foundation', 1988, 403),
    (1001, 'Forward the Foundation', 1993, 417),
    (1002, 'Foundation', 1951, 255),
    (1003, 'Foundation and Empire', 1952, 247),
    (1004, 'Second Foundation', 1953, 210),
    (1005, 'Foundation''s Edge', 1982, 367),
    (1006, 'Foundation and Earth', 1986, 356),
    (1007, 'Nemesis', 1989, 386),
    (1008, 'Starship Troopers', null, null),
    (1009, 'Stranger in a Strange Land', null, null),
    (1010, 'Nightfall', null, null),
    (1011, 'Nightwings', null, null),
    (1012, 'Across a Billion Years', null, null),
    (1013, 'Hyperion', 1989, 482),
    (1014, 'The Fall of Hyperion', 1990, 517),
    (1015, 'Endymion', 1996, 441),
    (1016, 'The Rise of Endymion', 1997, 579),
    (1017, 'Practical Azure SQL Database for Modern Developers', 2020, 326),
    (1018, 'SQL Server 2019 Revealed: Including Big Data Clusters and Machine Learning', 2019, 444),
    (1019, 'Azure SQL Revealed: A Guide to the Cloud for SQL Server Professionals', 2020, 528),
    (1020, 'SQL Server 2022 Revealed: A Hybrid Data Platform Powered by Security, Performance, and Availability', 2022, 506)
go

insert into dbo.author_types
    (id, author_type)
values  
    (2000, 'Main'),
    (2001, 'Contributor'),
    (2002, 'Co-Author')
go

insert into dbo.books_authors 
    (author_id, book_id, author_type_id)
values
    (1, 1000, null),
    (1, 1001, null),
    (1, 1002, null),
    (1, 1003, null),
    (1, 1004, null),
    (1, 1005, null),
    (1, 1006, null),
    (1, 1007, null),
    (1, 1010, 2002),
    (2, 1008, null),
    (2, 1009, null),
    (2, 1011, null),
    (3, 1010, 2002),
    (3, 1012, null),
    (4, 1013, null),
    (4, 1014, null),
    (4, 1015, null),
    (4, 1016, null),
    (5, 1017, 2002),
    (6, 1018, null),
    (6, 1019, null),
    (6, 1020, null),
    (7, 1017, 2002), 
    (8, 1017, 2002), 
    (9, 1017, 2002), 
    (10, 1017, 2002)
go

insert into dbo.series values
    (10000, 'Foundation'),
    (10001, 'Hyperion Cantos')
go

update dbo.books 
set series_id = 10000
where id in (1000, 1001, 1002, 1003, 1004, 1005, 1006)
go

update dbo.books 
set series_id = 10001
where id in (1013, 1014, 1015, 1016)
go

-- Create app user

if (serverproperty('Edition') = 'SQL Azure') begin

    if not exists (select * from sys.database_principals where [type] in ('E', 'S') and [name] = 'library_dab_user')
    begin 
        create user [library_dab_user] with password = 'rANd0m_PAzzw0rd!'        
    end

    alter role db_owner add member [library_dab_user]
    
end else begin

    if not exists (select * from sys.server_principals where [type] in ('E', 'S') and [name] = 'library_dab_user')
    begin 
        create login [library_dab_user] with password = 'rANd0m_PAzzw0rd!'
    end    

    if not exists (select * from sys.database_principals where [type] in ('E', 'S') and [name] = 'library_dab_user')
    begin
        create user [library_dab_user] from login [library_dab_user]            
    end

    alter role db_owner add member [library_dab_user]
end
