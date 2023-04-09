create table dbo.series
(
    id int not null constraint pk__series primary key default (next value for dbo.globalId),
    [name] nvarchar(1000) not null
)
go