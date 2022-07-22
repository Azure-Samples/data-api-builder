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

async function checkActiveUser(setUser, setCacheChecked) {
    const activeAccount = await msalInstance.getActiveAccount();
    console.log(activeAccount == null ? "no active account found, cannot silently login" : `using active account with username: ${activeAccount.username}`)
    setUser(activeAccount);
    setCacheChecked(true);
}

function MyApp({ Component, pageProps }) {
    const [user, setUser] = useState(null);
    const [cacheChecked, setCacheChecked] = useState(false);
    const router = useRouter();

    useEffect(() => {
        checkActiveUser(setUser, setCacheChecked);
    }, []);

    return (
        <MsalProvider instance={msalInstance}>
            <ChakraProvider>
                <ApolloProvider client={client}>
                    <Header user={user} setUser={setUser} />
                    <AuthenticatedTemplate>
                        {/* Don't render sidebar on sign in page */}
                        {router.pathname != "/auth" && <SimpleSidebar>
                            <Component {...pageProps} user={user} setUser={setUser} cacheChecked={cacheChecked} />
                        </SimpleSidebar>}
                        {router.pathname == "/auth" && <Component {...pageProps} user={user} setUser={setUser} cacheChecked={cacheChecked} /> }
                    </AuthenticatedTemplate>
                    {/* Don't render sidebar until authenticated */}
                    <UnauthenticatedTemplate>
                        <Component {...pageProps} user={user} setUser={setUser} cacheChecked={cacheChecked} />
                    </UnauthenticatedTemplate>
                </ApolloProvider>
            </ChakraProvider>
        </MsalProvider>
    )
}

export default MyApp