create table dbo.author_types
(
    id int not null constraint pk__author_types primary key default (next value for dbo.globalId),
    author_type nvarchar(100) not null
)
go