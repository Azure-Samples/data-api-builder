if (object_id('dbo.books_authors') is not null)  
begin
    delete from dbo.books_authors where book_id < 1000000;
    delete from dbo.books_authors where author_id < 1000000;
end

if object_id('dbo.books') is not null
    delete from dbo.books where id < 1000000;

if object_id('dbo.series') is not null
    delete from dbo.series where id < 1000000;

if object_id('dbo.authors') is not null
    delete from dbo.authors where id < 1000000;

if object_id('dbo.author_types') is not null
    delete from dbo.author_types where id < 1000000;
