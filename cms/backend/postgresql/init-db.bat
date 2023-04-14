@echo off

dropdb -U postgres --if-exists cms-db

Rem Only create schema if cms-db was successfully created 
createdb -U postgres cms-db && psql -d cms-db -U postgres -f init-cms-db.sql || echo encountered an issue creating cms-db, please resolve and re-run or try to use SSMS/Azure Data Studio

