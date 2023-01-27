@echo off

Rem initialize config - remember to replace your connection string and the authentication section
dab init --database-type mssql --connection-string "Server=;Database=cms-db;Integrated Security=True;" -n "dab-config" --cors-origin "http://localhost:3000"

Rem add entities
dab add User -n "dab-config" -s "users" --permissions "authenticated:read"
dab update User -n "dab-config" --permissions "authenticated:read" --fields.include "*" --policy-database "@claims.oid eq @item.guid"
dab add Article -n "dab-config" -s "articles" --permissions "authenticated:read"
dab add Status -n "dab-config" -s "article_statuses" --permissions "anonymous:read"
dab update Status -n "dab-config" --permissions "authenticated:read"
dab add ArticleDetailed -n "dab-config" -s "articles_detailed" --permissions "authenticated:read"

Rem add entity relationships
dab update User -n "dab-config" --relationship articles --target.entity Article --cardinality many --mapping.fields "guid:author_id"
dab update Article -n "dab-config" --relationship users --target.entity User --cardinality one --mapping.fields "author_id:guid"
dab update Article -n "dab-config" --relationship article_statuses --target.entity Status --cardinality one --mapping.fields "status:id"
dab update Status -n "dab-config" --relationship articles --target.entity Article --cardinality many --mapping.fields "id:status"

Rem add granular permissions
Rem add read permissions to anonymous 
dab update ArticleDetailed -n "dab-config" --permissions "anonymous:read"
dab update Article -n "dab-config" --permissions "anonymous:read"

Rem restrict anonymous read to only published
dab update ArticleDetailed -n "dab-config" --permissions "anonymous:read" --fields.include "*" --policy-database "@item.status eq 'published'"
dab update Article -n "dab-config" --permissions "anonymous:read" --fields.include "*" --policy-database "@item.status eq 2"

Rem add user creation for authenticated
dab update User -n "dab-config" --permissions "authenticated:create"

Rem restrict authenticated read permission with policy
dab update Article -n "dab-config" --permissions "authenticated:read" --fields.include "*" --policy-database "@claims.oid eq @item.author_id"
dab update ArticleDetailed -n "dab-config" --permissions "authenticated:read" --fields.include "*" --policy-database "@claims.oid eq @item.author_id"

Rem add create, update, delete for authenticated
dab update Article -n "dab-config" --permissions "authenticated:create"
dab update Article -n "dab-config" --permissions "authenticated:update,delete"

Rem restrict update, delete articles for authenticated users
dab update Article -n "dab-config" --permissions "authenticated:update" --fields.include "*" --policy-database "@claims.oid eq @item.author_id"
dab update Article -n "dab-config" --permissions "authenticated:delete" --fields.include "*" --policy-database "@claims.oid eq @item.author_id"

Rem add update, delete user info for authenticated
dab update User -n "dab-config" --permissions "authenticated:update,delete"

Rem restrict update, delete for users
dab update User -n "dab-config" --permissions "authenticated:update" --fields.include "*" --fields.exclude "email" --policy-database "@claims.oid eq @item.guid"
dab update User -n "dab-config" --permissions "authenticated:delete" --fields.include "*" --policy-database "@claims.oid eq @item.guid"
