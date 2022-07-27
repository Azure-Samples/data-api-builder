// Next Imports
import { useRouter } from 'next/router'

// React Imports
import React, { useState, useEffect } from 'react';

// Styles
import '../styles/globals.css'

// Chakra UI Imports
import { ChakraProvider, ColorModeScript, useToast } from '@chakra-ui/react'

// Apollo Imports
import { ApolloProvider } from "@apollo/client";

// Msal Imports
import { MsalProvider, AuthenticatedTemplate, UnauthenticatedTemplate, MsalAuthenticationTemplate } from "@azure/msal-react";

// Module Imports
import client from "../apollo-client";
import Header from "../components/header.js"
import SimpleSidebar from "../components/sidebar.js"
import { msalInstance, scopes } from "../auth_config"
import { rest_functions as func } from "../utils/rest"
import { error_toast } from "../utils/misc"

async function checkActiveUser(setUser, setDbUser, setCacheChecked, toast) {
    const activeAccount = await msalInstance.getActiveAccount();
    console.log(activeAccount == null ? "no active account found, cannot silently login" : `using active account with username: ${activeAccount.username}`)

    if (activeAccount != null) {
        setUser(activeAccount);
        const associatedDbUser = await func.get_user();
        if (associatedDbUser == null || associatedDbUser == undefined) {
            error_toast(toast, { title: "User Not Found", description: <>You&apos;re signed in but we can&apos;t find your user <br/> please sign out and sign back in </> })
        } else {
            setDbUser(associatedDbUser);
        }
        setCacheChecked(true); // waits to do so until after db user inferred
    } else {
        setCacheChecked(true);
    }
}

function MyApp({ Component, pageProps }) {
    const [user, setUser] = useState(null); // user as per msal account
    const [dbUser, setDbUser] = useState(null); // user as they appear in cms-db
    const [cacheChecked, setCacheChecked] = useState(false);
    const router = useRouter();
    const toast = useToast();

    useEffect(() => {
        checkActiveUser(setUser, setDbUser, setCacheChecked, toast);
    }, [toast]);

    return (
        <MsalProvider instance={msalInstance}>
            <ChakraProvider>
                <ApolloProvider client={client}>
                    <Header user={user} setUser={setUser} dbUser={dbUser} setDbUser={setDbUser} />
                    <AuthenticatedTemplate>
                        {/* Don't render sidebar on sign in page */}
                        {router.pathname != "/auth" && <SimpleSidebar>
                            <Component {...pageProps} user={user} setUser={setUser} dbUser={dbUser} setDbUser={setDbUser} cacheChecked={cacheChecked} />
                        </SimpleSidebar>}
                        {router.pathname == "/auth" && <Component {...pageProps} user={user} setUser={setUser} dbUser={dbUser} setDbUser={setDbUser} cacheChecked={cacheChecked} /> }
                    </AuthenticatedTemplate>
                    {/* Don't render sidebar until authenticated */}
                    <UnauthenticatedTemplate>
                        <Component {...pageProps} user={user} setUser={setUser} dbUser={dbUser} setDbUser={setDbUser} cacheChecked={cacheChecked} />
                    </UnauthenticatedTemplate>
                </ApolloProvider>
            </ChakraProvider>
        </MsalProvider>
    )
}

export default MyApp