create table dbo.authors
(
    id int not null constraint pk__authors primary key default (next value for dbo.globalId),
    first_name nvarchar(100) not null,
    middle_name  nvarchar(100) null,
    last_name nvarchar(100) not null
)
go