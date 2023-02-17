/*
	If running on SQL Server:
*/
create database DAB_Todo
go

create login dab_test_user with password = 'DAB_Pas$w0rD!'
go

use DAB_Todo
go

create user dab_test_user from login dab_test_user
go

alter role db_owner add member dab_test_user
go
