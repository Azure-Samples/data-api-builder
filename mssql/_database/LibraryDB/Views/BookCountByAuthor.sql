create view dbo.vw_book_count_by_author
as
with books_count as
(
    select 
        author_id, 
        count(*) as books
    from 
        dbo.books_authors ba 
    group by 
        author_id
)
select 
    a.id as author_id,
    a.first_name,
    a.middle_name,
    a.last_name,
    bc.books
from
    dbo.authors a
inner join
    books_count bc on a.id = bc.author_id