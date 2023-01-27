@echo off

Rem initialize config - remember to replace your connection string and the authentication section
dab init --database-type mssql --connection-string "Server=;Database=cms-db;Integrated Security=True;"  --cors-origin "http://localhost:3000"

Rem add entities
dab add User -s "users" --permissions "authenticated:read"
dab add Article -s "articles" --permissions "authenticated:read"
dab add Status -s "article_statuses" --permissions "anonymous:read"
dab update Status  --permissions "authenticated:read"
dab add ArticleDetailed -s "articles_detailed" --permissions "authenticated:read"

Rem add entity relationships
dab update User  --relationship articles --target.entity Article --cardinality many --mapping.fields "guid:author_id"
dab update Article  --relationship users --target.entity User --cardinality one --mapping.fields "author_id:guid"
dab update Article  --relationship article_statuses --target.entity Status --cardinality one --mapping.fields "status:id"
dab update Status  --relationship articles --target.entity Article --cardinality many --mapping.fields "id:status"

Rem add granular permissions

Rem add read permissions to anonymous 
dab update ArticleDetailed  --permissions "anonymous:read"
dab update Article  --permissions "anonymous:read"

Rem restrict anonymous read to only published
dab update ArticleDetailed  --permissions "anonymous:read" --fields.include "*" --policy-database "@item.status eq 'published'"
dab update Article  --permissions "anonymous:read" --fields.include "*" --policy-database "@item.status eq 2"

Rem add user creation for authenticated
dab update User  --permissions "authenticated:create"

Rem restrict authenticated read permission with policy
dab update Article  --permissions "authenticated:read" --fields.include "*" --policy-database "@claims.oid eq @item.author_id"
dab update ArticleDetailed  --permissions "authenticated:read" --fields.include "*" --policy-database "@claims.oid eq @item.author_id"

Rem add create, update, delete for authenticated
dab update Article  --permissions "authenticated:create"
dab update Article  --permissions "authenticated:update,delete"

Rem restrict update, delete articles for authenticated users
dab update Article  --permissions "authenticated:update" --fields.include "*" --policy-database "@claims.oid eq @item.author_id"
dab update Article  --permissions "authenticated:delete" --fields.include "*" --policy-database "@claims.oid eq @item.author_id"

Rem add read permission for authenticated
dab update User --permissions "authenticated:read" --fields.include "*" --policy-database "@claims.oid eq @item.guid"

Rem add update, delete user info for authenticated
dab update User  --permissions "authenticated:update,delete"

Rem restrict update, delete for users
dab update User  --permissions "authenticated:update" --fields.include "*" --fields.exclude "email" --policy-database "@claims.oid eq @item.guid"
dab update User  --permissions "authenticated:delete" --fields.include "*" --policy-database "@claims.oid eq @item.guid"
