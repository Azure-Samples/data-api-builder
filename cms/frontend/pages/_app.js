// Next Imports
import { useRouter } from 'next/router'

// React Imports
import React, { useState, useEffect } from 'react';

// Styles
import '../styles/globals.css'

// Chakra UI Imports
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'

// Apollo Imports
import { ApolloProvider } from "@apollo/client";

// Module Imports
import client from "../apollo-client";
import Header from "../components/header.js"
import { msalInstance, scopes } from "../auth_config"

async function checkActiveUser(setUser, setAccessToken, setCacheChecked) {
    const activeAccount = await msalInstance.getActiveAccount();
    console.log(activeAccount)
    if (activeAccount != null) {
        msalInstance.acquireTokenSilent({ account: activeAccount, scopes: scopes }).then(tokenResponse => {
            setAccessToken(tokenResponse.accessToken);
            setUser(activeAccount);
            setCacheChecked(true);
        }).catch(err => {
            console.log("active account found but interaction needed")
            setCacheChecked(true);
        })
    }
}

function MyApp({ Component, pageProps }) {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [cacheChecked, setCacheChecked] = useState(false);
    const router = useRouter();

    useEffect(() => {
        checkActiveUser(setUser, setAccessToken, setCacheChecked);
    }, []);

    return (
        <ChakraProvider>
            <ApolloProvider client={client}>
                <Header user={user} setUser={setUser} />
                <Component {...pageProps} user={user} setUser={setUser} accessToken={accessToken} setAccessToken={setAccessToken} cacheChecked={cacheChecked} />
            </ApolloProvider>
        </ChakraProvider>
    )
}

export default MyApp