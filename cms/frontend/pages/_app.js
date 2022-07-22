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

// Msal Imports
import { MsalProvider, AuthenticatedTemplate, UnauthenticatedTemplate, MsalAuthenticationTemplate } from "@azure/msal-react";

// Module Imports
import client from "../apollo-client";
import Header from "../components/header.js"
import SimpleSidebar from "../components/sidebar.js"
import { msalInstance, scopes } from "../auth_config"

async function checkActiveUser(setUser, setAccessToken, setCacheChecked) {
    const activeAccount = await msalInstance.getActiveAccount();
    console.log(activeAccount == null ? "no active account found, cannot silently login" : `using active account with username: ${activeAccount.username}`)
    if (activeAccount != null) {
        msalInstance.acquireTokenSilent({ account: activeAccount, scopes: scopes }).then(tokenResponse => {
            setAccessToken(tokenResponse.accessToken);
            setUser(activeAccount);
            setCacheChecked(true);
            console.log(tokenResponse)
        }).catch(err => {
            console.log("active account found but interaction needed")
            setCacheChecked(true);
        })
    } else {
        setCacheChecked(true);
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
        <MsalProvider instance={msalInstance}>
            <ChakraProvider>
                <ApolloProvider client={client}>
                    <Header user={user} setUser={setUser} setAccessToken={setAccessToken} />
                    <AuthenticatedTemplate>
                        {/* Don't render sidebar on sign in page */}
                        {router.pathname != "/auth" && <SimpleSidebar>
                            <Component {...pageProps} user={user} setUser={setUser} accessToken={accessToken} setAccessToken={setAccessToken} cacheChecked={cacheChecked} />
                        </SimpleSidebar>}
                        {router.pathname == "/auth" && <Component {...pageProps} user={user} setUser={setUser} accessToken={accessToken} setAccessToken={setAccessToken} cacheChecked={cacheChecked} /> }
                    </AuthenticatedTemplate>
                    {/* Don't render sidebar until authenticated */}
                    <UnauthenticatedTemplate>
                        <Component {...pageProps} user={user} setUser={setUser} accessToken={accessToken} setAccessToken={setAccessToken} cacheChecked={cacheChecked} />
                    </UnauthenticatedTemplate>
                </ApolloProvider>
            </ChakraProvider>
        </MsalProvider>
    )
}

export default MyApp