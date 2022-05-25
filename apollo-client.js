import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const httpLink = new HttpLink({
    uri: "https://localhost:5001/graphql/",
    credentials: 'same-origin',
    headers: {
        'Content-Type': 'application/graphql',
    },
    //fetchOptions: {
    //    mode: 'no-cors'
    //}
})

const client = new ApolloClient({
    cache: new InMemoryCache({
        addTypename: false
    }),
    link: httpLink,
});

//const client = new ApolloClient({
//    uri: "https://localhost:5001/graphql",
//    cache: new InMemoryCache(),
//    rejectUnauthorized: false,
    
//});

export default client;