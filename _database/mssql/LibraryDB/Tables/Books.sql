create table dbo.books
(
    id int not null constraint pk__books primary key default (next value for dbo.globalId),
    title nvarchar(1000) not null,
    [year] int null,
    [pages] int null,
    series_id int null constraint fk__series foreign key (series_id) references dbo.series(id)
)
go