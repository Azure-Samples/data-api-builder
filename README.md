# Data API builder for Azure Databases samples

Samples on how to use Data API builder for Azure Databases 

## What the Data API builder for Azure Database can do for me?

Azure Data API builder for Azure Databases allows you to automatically expose database objects (tables, views, stored procedures or collections), already existing in your Azure Databases, as REST and GraphQL endpoints. The supported database are:
- Azure SQL and SQL Server
- PostgreSQL
- MariaDB and MySQL
- Azure Cosmos DB 

## How I do get started?

If this is the very first time you'll be using Data API builder for Azure Databases, you may want to start from the [Getting Started](https://github.com/Azure/hawaii-engine/getting-started.md) in the engine repository document

## What samples I can found in this repo?

TDB

### Running the samples

You can use the provided sample configuration file to run the sample. Before running `dab start` make sure to set the environment variable `CONNSTR` to the connection string you want to use.

```powerhsell
$env:CONNSTR='<connection-string>'
```

or 

```bash
export CONNSTR='<connection-string>'
```

The configuration files are using the `mssql` database. If you are using another database other the Azure SQL or SQL Server, please change the `database-type` in the configuration file before running the sample.

You can then run the sample using the usual `dab start` command, pointing to the configuration file you want to use:

```shell
dab start --config '<config-file>'
```

## There are any end-to-end samples available?

Absolutely. To make it easier to deploy, each end-to-end sample has its own repo:

### To Do App

The well-known  [ToDo MVC sample](https://todomvc.com/) using Vue, Azure Static Web Apps and Data API builder: 

https://github.com/Azure-Samples/dab-swa-todo

### Library Management App

Organize and keep track of books in your personal library with this sample app built with Angular, Azure Static Web Apps and Data API builder:

https://github.com/Azure-Samples/dab-swa-library-demo

### Tour of Super Heroes App

The Tour of Super Heroes App built with Angular, Data API builder with many of the features that you'd expect to find in a data-driven app.

https://github.com/Azure-Samples/dab-swa-super-heroes

## Can I contribute?

Absolutely! If you have a sample using Data API builder, make sure to take a look at the [Code of Conduct](./CODE_OF_CONDUCT.md) and then please submit a PR to this repo.