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
A: Hawaii not supporting views for Postgres and cosmos not supporting views.. at all.. prevents them from fitting in to the agnostic frontend code.

## `backend/ms-sql`
Note: startup scripts that use `sqlcmd` to initialize the database attempt to use windows authentication mode. If for any reason this fails, update `init-db.bat` to the following: `sqlcmd -U {your_user} -P {your_pw} -i init-cms-db.sql`. See more about available options [here](https://docs.microsoft.com/en-us/sql/tools/sqlcmd-utility?view=sql-server-ver16). 
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
> - Run in `cmd` or powershell with `./init-db`

### `init-cms-db.sql` 

> - The MsSql schema the CMS uses.
> - Run using SSMS, using the `sqlcmd` utility, or preferably just use `init-db.bat` script


## `backend/azure-sql`

## `backend/mysql`


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
