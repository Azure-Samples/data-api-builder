# Deploy the sample Library database

## Using Visual Studio Code

You can deploy the Library database in Azure SQL or SQL Server using the provided database project in `LibraryDB` folder. The database project is created using the new "SDK-Style" project format. You can read more about that here: [Use SDK-style SQL projects with the SQL Database Projects extension](https://learn.microsoft.com/sql/azure-data-studio/extensions/sql-database-project-extension-build?view=sql-server-ver16).

## Manually

To manually deploy the database, make sure you have installed the following pre-requisites:

- [.NET Core SDK](https://dotnet.microsoft.com/download/dotnet)
- [SQLPackage](https://learn.microsoft.com/sql/tools/sqlpackage/sqlpackage-download?view=sql-server-ver16)

To deploy the database, create a `.env` file in the `_database\mssql` folder and set the variable `MSSQL_DEPLOY` to contain the connection string to point to the server where you want to deploy to. For example, for Azure SQL:

```text
MSSQL_DEPLOY="Server=<server>;Database=LibraryDB;User ID=<server>;Password=<server>!;"
```

and for SQL Server: 

```
MSSQL_DEPLOY="Server=<server>;Database=LibraryDB;User ID=<server>;Password=<server>!;TrustServerCertificate=true"
```

once the `.env` file is created, run the `deploy-db' script to deploy the database.