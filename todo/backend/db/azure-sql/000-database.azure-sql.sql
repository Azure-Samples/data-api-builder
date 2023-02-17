/*
	If running on Azure SQL
*/

create user dab_test_user with password = 'DAB_Pas$w0rD!'
go

alter role db_owner add member dab_test_user
go