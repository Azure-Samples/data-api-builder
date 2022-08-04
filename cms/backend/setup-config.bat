@echo off

Rem initialize config - remember to replace your connection string and the authentication section
hawaii init --database-type mssql --connection-string "Server=;Database=cms-db;Integrated Security=True;" -n "hawaii-config" --cors-origin "http://localhost:3000"

Rem add entities
hawaii add User -n "hawaii-config" -s "users" --permissions "authenticated:read"
hawaii update User -n "hawaii-config" --permissions "authenticated:read" --fields.include "*" --policy-database "@claims.oid eq @item.guid"
hawaii add Article -n "hawaii-config" -s "articles" --permissions "authenticated:read"
hawaii add Status -n "hawaii-config" -s "article_statuses" --permissions "anonymous:read"
hawaii update Status -n "hawaii-config" --permissions "authenticated:read"
hawaii add ArticleDetailed -n "hawaii-config" -s "articles_detailed" --permissions "authenticated:read"

Rem add entity relationships
hawaii update User -n "hawaii-config" --relationship articles --target.entity Article --cardinality many --mapping.fields "guid:author_id"
hawaii update Article -n "hawaii-config" --relationship users --target.entity User --cardinality one --mapping.fields "author_id:guid"
hawaii update Article -n "hawaii-config" --relationship article_statuses --target.entity Status --cardinality one --mapping.fields "status:id"
hawaii update Status -n "hawaii-config" --relationship articles --target.entity Article --cardinality many --mapping.fields "id:status"

Rem add granular permissions
Rem add read permissions to anonymous 
hawaii update ArticleDetailed -n "hawaii-config" --permissions "anonymous:read"
hawaii update Article -n "hawaii-config" --permissions "anonymous:read"

Rem restrict anonymous read to only published
hawaii update ArticleDetailed -n "hawaii-config" --permissions "anonymous:read" --fields.include "*" --policy-database "@item.status eq 'published'"
hawaii update Article -n "hawaii-config" --permissions "anonymous:read" --fields.include "*" --policy-database "@item.status eq 2"

Rem add user creation for authenticated
hawaii update User -n "hawaii-config" --permissions "authenticated:create"

Rem restrict authenticated read permission with policy
hawaii update Article -n "hawaii-config" --permissions "authenticated:read" --fields.include "*" --policy-database "@claims.oid eq @item.author_id"
hawaii update ArticleDetailed -n "hawaii-config" --permissions "authenticated:read" --fields.include "*" --policy-database "@claims.oid eq @item.author_id"

Rem add create, update, delete for authenticated
hawaii update Article -n "hawaii-config" --permissions "authenticated:create"
hawaii update Article -n "hawaii-config" --permissions "authenticated:update,delete"

Rem restrict update, delete articles for authenticated users
hawaii update Article -n "hawaii-config" --permissions "authenticated:update" --fields.include "*" --policy-database "@claims.oid eq @item.author_id"
hawaii update Article -n "hawaii-config" --permissions "authenticated:delete" --fields.include "*" --policy-database "@claims.oid eq @item.author_id"

Rem add update, delete user info for authenticated
hawaii update User -n "hawaii-config" --permissions "authenticated:update,delete"

Rem restrict update, delete for users
hawaii update User -n "hawaii-config" --permissions "authenticated:update" --fields.include "*" --fields.exclude "email" --policy-database "@claims.oid eq @item.guid"
hawaii update User -n "hawaii-config" --permissions "authenticated:delete" --fields.include "*" --policy-database "@claims.oid eq @item.guid"
