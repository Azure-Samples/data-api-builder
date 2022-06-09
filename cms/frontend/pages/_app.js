import '../styles/globals.css'

import { ApolloProvider } from "@apollo/client";
import client from "../apollo-client";

import { ChakraProvider } from '@chakra-ui/react'

import Header from "../components/header.js"

import React, { useState, useEffect } from 'react';

function MyApp({ Component, pageProps }) {

    const [user, setUser] = useState(null);
    return (
        <ChakraProvider>
            <ApolloProvider client={client}>
                <Header user={user} setUser={setUser} />
                <Component {...pageProps} user={user} setUser={setUser} />
            </ApolloProvider>
        </ChakraProvider>
    )
}

export default MyApp