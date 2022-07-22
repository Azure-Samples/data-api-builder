import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

//process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const httpLink = new HttpLink({
    uri: "https://localhost:5001/graphql/",
    credentials: 'same-origin',
    headers: {
        'Content-Type': 'application/graphql',
    }
})

const defaultOptions = {
    watchQuery: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'ignore',
    },
    query: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'all',
    },
}

const client = new ApolloClient({
    cache: new InMemoryCache({
        addTypename: false
    }),
    link: httpLink,
    defaultOptions: defaultOptions
});

export default client;