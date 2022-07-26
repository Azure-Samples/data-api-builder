// Next Imports
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'

// React Imports
import React, { useState, useEffect } from 'react';

// Styles
import styles from '../../styles/Home.module.css'

// Chakra UI Imports
import {
    Button, ButtonGroup, Icon, Heading, Textarea, VStack, StackDivider,
    Box, CircularProgress, Center, Stack, Text, useColorModeValue, useToast
} from '@chakra-ui/react'
import { SiMicrosoftazure } from "react-icons/si";

// Module Imports
import { acquireToken, msalInstance } from '../../auth_config'
import { BrowserAuthError } from '../../node_modules/@azure/msal-browser/dist/index';
import { rest_functions as func } from "../../utils/rest"
import { success_toast, error_toast } from "../../utils/misc"


export default function Auth({ user, setUser, setDbUser }) {

    const router = useRouter()
    const toast = useToast()

    const flash_success = (token, toastTitle, toastDescription) => {
        success_toast(toast, { title: toastTitle, description: toastDescription });
        setUser(token.account);
        setTimeout(() => router.push("/"), 1000);
    }

    const authenticate = async () => {
        acquireToken().then(async loginResponse => {
            if (loginResponse instanceof BrowserAuthError && loginResponse.errorCode == "user_cancelled") {
                // user didn't complete auth flow
                error_toast(toast, { title: "Login Failed", description: "User Canceled Authentication" });

            } else if (loginResponse instanceof BrowserAuthError && loginResponse.errorCode == "interaction_in_progress") {
                // another auth flow is already in progress
                error_toast(toast, { title: "Error", description: "Authentication Already In Progress" });
            } else if (loginResponse instanceof Error) {
                // couldn't obtain token for unknown reason
                console.log(loginResponse);
                error_toast(toast, { title: "Login Failed", description: "Unsuccessful Login Attempt" });

            } else {
                // Successfully logged in/obtained a token
                // Now, check if user exists - if not, create account
                try {
                    const response = await func.get_or_create_user();
                    // successfull post/insert into users table
                    if (response instanceof Response && response.status == 201) {
                        // set state vars, flash account creation success, navigate back home
                        flash_success(loginResponse, "Account Created", "You've successfully added your account!");
                        const nameArray = loginResponse.account.name.split(' ');
                        setDbUser(
                            {
                                guid: loginResponse.account.idTokenClaims.oid,
                                fname: nameArray[0],
                                lname: nameArray[nameArray.length - 1],
                                email: loginResponse.account.username
                            });
                    } else if (response != null && response != undefined && Array.isArray(response.value) && response.value.length == 1) {
                        // user already exists in db, just log them in
                        flash_success(loginResponse, "Login Success", `Welcome back, ${response.value[0].fname}`);
                        setDbUser(response.value[0]);

                    } else {
                        error_toast(toast, { title: `${response.status}`, description: response.status == 403 ? `Unauthorized` : `${response.statusText}` });
                        await msalInstance.setActiveAccount(null);
                    }
                } catch (err) {
                    error_toast(toast, { title: 'Network Error', description: "Check network connection and/or developer console" });
                    await msalInstance.setActiveAccount(null);
                }
            }
        })
        
    };

    return (
        <div className={styles.container}>
            <Head>
                <title>Authenticate</title>
            </Head>
            <main className={styles.main}>
                <Center p={8} mt={'2%'}>
                    <VStack spacing={10}>
                        <Image src="/msft.png" alt="Microsoft Logo" width={150} height={100} />
                    <Box
                        w={'500px'}
                        bg={useColorModeValue('white', 'gray.800')}
                        boxShadow={'2xl'}
                        rounded={'md'}
                        overflow={'hidden'}>
                            <Text
                            align={'center' }
                            fontSize={'lg'}
                            fontWeight={500}
                            bg={useColorModeValue('gray.200', 'gray.900')}
                            p={2}
                            px={3}>
                                Authenticate With A Provider
                            </Text>
                            <Stack spacing={2} align={'center'} w={'full'}>
                                <Button onClick={authenticate} w={'full'} h={'100px'} variant={'outline'} borderTopRadius={0} leftIcon={<SiMicrosoftazure w={8} />} >
                                    <Center>
                                        <Text fontSize={'lg'}> Sign in with Azure AD </Text>
                                    </Center>
                                </Button>
                            </Stack>
                        </Box>
                    </VStack>
                </Center>

            </main>

        </div>
        )
}