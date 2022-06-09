import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'

import React, { useState, useEffect } from 'react';

import styles from '../../styles/Home.module.css'

// Chakra UI Imports
import { Button, ButtonGroup, Icon, Heading, Textarea, VStack, StackDivider, Box, CircularProgress } from '@chakra-ui/react'
import { BsPlusCircle, BsTrash } from "react-icons/bs";

import * as msal from "@azure/msal-browser";

const msalConfig = {
    auth: {
        clientId: 'e98794ab-cdaa-4ed3-ad08-0552c47254e2',
    }
};

export const msalInstance = new msal.PublicClientApplication(msalConfig);

async function auth(setUser, router) {
    msalInstance.acquireTokenSilent({}).then(tokenResponse => {
        console.log(tokenResponse);
        setUser(tokenResponse.account.username);
        router.push("/");
    }).catch(async (error) => {
        if (error.errorCode === "no_account_error") {
            console.log("No active account set, initiate interactive login")
        }
        // fallback to interaction when silent call fails
        msalInstance.acquireTokenPopup({}).then(tokenResponse => {
            console.log(tokenResponse);
            setUser(tokenResponse.account.username);
            msalInstance.setActiveAccount(tokenResponse.account);
            router.push("/");
        });
    }).catch(error => {
        console.log(error);
    });
    //console.log(msalInstance.getAllAccounts());
    
    
}



   

export default function Auth({ user, setUser }) {

    const router = useRouter()

    return (
        <div className={styles.container}>
            <Head>
                <title>Authenticate</title>
            </Head>
            <main className={styles.main}>
                <div className={styles.card}>
                    <Button onClick={() => auth(setUser, router)} padding="50px">
                        <h3 className={styles.title}>
                        
                        Authenticate with Azure AD
                        </h3>
                    </Button>

                    
                </div>

            </main>

        </div>
        )
}