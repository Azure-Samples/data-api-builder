@echo off

sqlcmd -S tcp:cms-sample.database.windows.net,1433 -d cms-db -G -U {your-aad-username} -i init-cms-db.sql
