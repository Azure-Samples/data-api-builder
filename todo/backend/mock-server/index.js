const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const args = require('yargs').argv;
const { readFileSync } = require('fs')

if (args.file == null)
    console.log("--file parameter is mandatory");
else
     runServer();

async function runServer() {
    const typeDefs = readFileSync(args.file).toString('utf-8');

    const app = express();

    const server = new ApolloServer({
        typeDefs,
        mocks: true,
    });

    await server.start();

    server.applyMiddleware({ app, path: '/api/graphql' });

    await new Promise(resolve => app.listen({ port: 5000 }, resolve));
    console.log(`🚀 Server ready at http://localhost:5000${server.graphqlPath}`);
    return { server, app };    
}

