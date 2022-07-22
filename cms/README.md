# Hawaii-CMS
This is a Content Management System (CMS) built entirely on project hawaii for data management and authorization handling - a fully serverless implementation.

The sample is divided into 
- `backend` - which houses the database initialization scripts, hawaii startup scripts, and hawaii configuration file
- `frontend` - which houses the Next.js app 

<br/>

> ### AuthN/AuthZ
> In this first version of the CMS sample, anyone (any/all users who visit the site) should be able to view the articles published in your local db copy. All other actions, such as drafting, publishing, updating, deleting posts are limited to those who authenticate through Azure AD. We are using the Microsoft AAD tenant, so all those present in that tenant can receive a valid token and be treated as authenticated, without any extra role configuration. You can see the Azure app registration [here](https://ms.portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationMenuBlade/~/Overview/appId/e98794ab-cdaa-4ed3-ad08-0552c47254e2/isMSAApp~/false).

<br/>

> ### Config Reminder
> 
> Remember to replace the `connection-string` in `backend/hawaii-server/hawaii-config.MsSql.json` 
> 1. ex: using SQL Server credentials: 
> 
> ```
> "connection-string": "Server=tcp:127.0.0.1,1433;Database=cms-db;User ID=<user>;Password=<password>"
> ```
> 
> 2. ex: using Windows Authentication: 
> ```
> "connection-string": "Server=tcp:127.0.0.1,1433;Database=cms-db;Integrated Security=true"
> ```
> 

## Backend Scripts

### `backend/database/ms-sql`

#### `init-db.bat`
> - Runs the included `init-cms-db.sql` SQL script to initialize a fresh cms database
> - Run in `cmd` or powershell with `./init-db`

#### `init-cms-db.sql` 

> - The MsSql schema the CMS uses.
> - Run using SSMS, using the `sqlcmd` utility, or preferably just use `init-db.bat` script

<br/>

### `backend/hawaii-server`

#### `run-server.bat` and `run-server.sh`
> - Runs the hawaii server with the `hawaii-config.MsSql.json` configuration file included
> - Only use after initializing database

#### `run-new.bat`
> - An all-in-one backend startup
> - Initializes database by calling `init-db.bat` then starts up hawaii with `run-server.bat`
> - Gives a fresh db copy every time, so if you want to persist database changes, instead choose `run-server.bat`

<br/>

## Frontend

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

### Getting Started

Navigate to `hawaii-cms/cms/frontend`

Install the required dependencies 

```bash
npm install
```

and then run the development server:

```bash
npm run dev
# or
yarn dev
```

If not launched by default, open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

For an optimized production build:
```
npm run build
npm run start
```

### Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

### Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
