import '../styles/globals.css'

import { ApolloProvider } from "@apollo/client";
import client from "../apollo-client";

import { ChakraProvider } from '@chakra-ui/react'

function MyApp({ Component, pageProps }) {
    return (
        <ChakraProvider>
            <ApolloProvider client={client}>
                <Component {...pageProps}/>
            </ApolloProvider>
        </ChakraProvider>
    )
}

export default MyApp