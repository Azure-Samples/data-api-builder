@echo off

cd ../database/ms-sql
CALL init-db

cd ../../hawaii-server
CALL run-server