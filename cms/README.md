# Hawaii-CMS
This is a Content Management System (CMS) built entirely on project hawaii for data management and authorization handling - a fully serverless implementation.

The sample is divided into 
- `backend` - which houses the database initialization scripts, hawaii startup scripts, and hawaii configuration files
- `frontend` - which houses the Next.js app, agnostic of whichever backend you choose

<br/>

> ### AuthN/AuthZ
> In this first version of the CMS sample, anyone (any/all users who visit the site) should be able to view the articles marked as _published_ in your chosen db. All other actions, such as drafting, publishing, updating, deleting posts are limited to those who authenticate through Azure AD. We are using the Microsoft AAD tenant, so all those present in that tenant can receive a valid token and be treated as authenticated, without any extra role configuration. You can see the Azure app registration [here](https://ms.portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationMenuBlade/~/Overview/appId/e98794ab-cdaa-4ed3-ad08-0552c47254e2/isMSAApp~/false).


# Choose Your Backend
This sample supports 3 backend options at this time:
- Local SQL Server db
- Azure SQL managed db - hosted [here](https://ms.portal.azure.com/#@microsoft.onmicrosoft.com/resource/subscriptions/f33eb08a-3fe1-40e6-a9b6-2a9c376c616f/resourceGroups/cms-sample/providers/Microsoft.Sql/servers/cms-sample/databases/cms-db/overview) if you're able to access
- Local MySQL db

Q: _Why not postgres or cosmos?_ 
A: Hawaii not supporting views for Postgres and cosmos not supporting views.. at all.. prevents them from fitting with the agnostic api calls the frontend makes.

## Configuration File
You may either use the included, static config files included in each subdirectory listed below for your chosen database (recommended for most), or you can use the included `backend/setup-config.bat` script that executes the sequence of CLI tool commands that generates a semantically identical `hawaii-config.json` file on demand. 

If you choose the latter:
- Remember to change the connection string in the first line of `setup-config.bat`. Also, remember to replace the `authentication` section if needed, as it defaults to `StaticWebApps`. If you use this method to generate your config file and also want to use the included startup scripts below, remember to either change the path to the config file in `run-server.bat` or simply move/rename the file to match the name referenced, e.g. if you want to use SQL Server, place it in the `ms-sql` directory and rename it `hawaii-config.MsSql.json`.

## `backend/ms-sql`
**Note:** startup scripts that use `sqlcmd` to initialize the database attempt to use windows authentication mode. If for any reason this fails, update `init-db.bat` to the following: `sqlcmd -U {your_user} -P {your_pw} -i init-cms-db.sql`. See more about available options [here](https://docs.microsoft.com/en-us/sql/tools/sqlcmd-utility?view=sql-server-ver16). 
<br/>

> ### hawaii-config.MsSql.json
> - Attempts to use windows integrated security by default. 
> - If needed, replace your `"connection-string"` with 
> 
>``` 
>"Server=tcp:127.0.0.1,1433;Database=cms-db;User ID=<user>;Password=<password>"
>```
> - Read more about SQL Server connection string options [here](https://docs.microsoft.com/en-us/sql/relational-databases/native-client/applications/using-connection-string-keywords-with-sql-server-native-client?view=sql-server-ver16)

### `run-new.bat`
> - An all-in-one backend startup
> - Initializes database by calling `init-db.bat` then starts up hawaii with `run-server.bat`
> - Gives a fresh db copy every time, so if you want to persist database changes, instead choose `run-server.bat`

### `run-server.bat` and `run-server.sh`
> - Runs the hawaii server with the included `hawaii-config.MsSql.json` configuration file
> - Only use after initializing database/if cms-db exists

### `init-db.bat`
> - Runs the included `init-cms-db.sql` SQL script to initialize a fresh cms database
> - Usually no need to run alone

### `init-cms-db.sql` 

> - The MsSql schema the CMS uses.
> - Run using SSMS, Azure Data Studio, using the `sqlcmd` utility, but preferably just use `init-db.bat` script


## `backend/azure-sql`
**Note:** Connecting to an Azure SQL DB through Azure AD requires multi-factor authentication (MFA). As such, commands and config attempt to use "Active Directory Interactive" authentication mode, which requires specifying your username. **As such, remember to replace your username in `hawaii-config.AzureSql.json` and `init-db.bat`.** Read more about the authentication modes [here](https://docs.microsoft.com/en-us/sql/tools/sqlcmd-utility?view=sql-server-ver16#:~:text=execute%20sqlcmd%20%2D%3F.-,%2DG,-This%20switch%20is). 

<br/>

> ### hawaii-config.AzureSql.json
> - Remember to replace the `User ID` in your connection string with your AAD username 
> - Same connection string options apply ([here](https://docs.microsoft.com/en-us/sql/relational-databases/native-client/applications/using-connection-string-keywords-with-sql-server-native-client?view=sql-server-ver16))
> 

### `run-new.bat`
> - Same behavior as described above

### `run-server.bat` and `run-server.sh`
> - Runs the hawaii server with the included `hawaii-config.AzureSql.json` configuration file

### `init-db.bat`
> - Resets the [Azure SQL DB instance](https://ms.portal.azure.com/#@microsoft.onmicrosoft.com/resource/subscriptions/f33eb08a-3fe1-40e6-a9b6-2a9c376c616f/resourceGroups/cms-sample/providers/Microsoft.Sql/servers/cms-sample/databases/cms-db/overview) to a fresh state
> - Remember to replace your AAD username after the `-U` flag
> - Ex: `sqlcmd -S tcp:cms-sample.database.windows.net,1433 -d cms-db -G -U t-vikhanna@microsoft.com -i init-cms-db.sql` 

### `init-cms-db.sql` 

> - Identical schema to MS SQL (minus USE/CREATE DATABASE statements)

## `backend/mysql`
**Prerequisites**: Other than having MySQL and .NET appropriate connectors installed, please also ensure you have added the `bin` and `lib` folders of your installation to your system PATH if you want to use the included database startup scripts (`run-new.bat` and `init-db.bat` specifically) as they use the `mysql` command-line client. On windows, the default installation is at `C:\Program Files\MySQL\MySQL Server 8.0`.

**Authentication**: All actions are attempted as the `root` user (feel free to change). To avoid being prompted for your password while running below scripts, I strongly recommend you create a `.mylogin.cnf` CONF file using the `mysql_config_editor` - see [here](https://dev.mysql.com/doc/refman/8.0/en/mysql-config-editor.html) for quickstart.

<br/>

> ### hawaii-config.MySql.json
> - Remember to replace the `User` and `Password` in your connection string with your database credentials
> - See [here](https://dev.mysql.com/doc/connector-net/en/connector-net-8-0-connection-options.html) for all connection string options

### `run-new.bat`
> - Same behavior as described above

### `run-server.bat` and `run-server.sh`
> - Runs the hawaii server with the included `hawaii-config.MySql.json` configuration file

### `init-db.bat`
> - (Re)initializes the db
> - See [here](https://dev.mysql.com/doc/refman/8.0/en/mysql-command-options.html) for full list of `mysql` command options

### `init-cms-db.sql` 

> - Semantically identical schema to MS SQL

# Frontend

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

### Getting Started

Navigate to `hawaii-cms/cms/frontend`

Install the required dependencies 

```bash
npm install
```

For an optimized build (production experience):
```
npm run build
npm run start
```

If not launched by default, open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

For future development and to see hot reloaded changes on the frontend:

```bash
npm run dev
# or
yarn dev
```

### Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

### Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
