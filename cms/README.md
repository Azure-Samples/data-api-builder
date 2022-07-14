# Hawaii-CMS
This is a Content Management System (CMS) built entirely on project hawaii for data management and authorization handling - a fully serverless implementation.

The sample is divided into 
- `backend` - which houses the database initialization and hawaii startup scripts 
- `frontend` - which houses the Next.js app 

## Backend Scripts

### `backend/database/ms-sql`

#### `init-db.bat`
> - Runs the included `init-cms-db.sql` SQL script to initialize a fresh cms database
> - Run in `cmd` or powershell with `./init-db`

#### `init-cms-db.sql` 

> - The MsSql schema the CMS uses.
> - Run using SSMS, using the `sqlcmd` utility, or preferably just use `init-db.bat` script

### `backend/hawaii-server`

#### `run-server.bat` and `run-server.sh`
> - Runs the hawaii server with the `hawaii-config.MsSql.json` configuration file included
> - Only use after initializing database

#### `run-new.bat`
> - An all-in-one backend startup
> - Initializes database by calling `init-db.bat` then starts up hawaii with `run-server.bat`
> - Gives a fresh db copy every time, so if you want to persist database changes, instead choose `run-server.bat`

## Frontend

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

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

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
