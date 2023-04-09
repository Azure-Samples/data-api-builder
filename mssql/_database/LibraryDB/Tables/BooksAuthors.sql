create table dbo.books_authors
(
    author_id int not null constraint fk__authors foreign key references dbo.authors(id),
    book_id int not null  constraint fk__books foreign key references dbo.books(id),
    author_type_id int null constraint fk__author_types foreign key references dbo.author_types(id),
    constraint pk__books_authors primary key (
        author_id,
        book_id
    )
)
go

create nonclustered index ixnc1 on dbo.books_authors(book_id, author_id)
go