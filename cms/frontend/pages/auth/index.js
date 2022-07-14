// Next Imports
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'

// React Imports
import React, { useState, useEffect } from 'react';

// Styles
import styles from '../../styles/Home.module.css'

// Chakra UI Imports
import { Button, ButtonGroup, Icon, Heading, Textarea, VStack, StackDivider, Box, CircularProgress, Center, Stack, Text, useColorModeValue } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
import { BsPlusCircle, BsTrash } from "react-icons/bs";
import { SiMicrosoftazure } from "react-icons/si";

// Module Imports
import { acquireToken } from '../../auth_config'
import { BrowserAuthError } from '../../node_modules/@azure/msal-browser/dist/index';
import { rest_functions as func } from "../../rest-utilities.ts"


export default function Auth({ user, setUser, accessToken, setAccessToken }) {

    const router = useRouter()
    const toast = useToast()

    const error_toast = ({ title, description }) => {
        toast.closeAll();
        toast({
            title: title,
            description: description,
            status: 'error',
            duration: 9000,
            isClosable: true,
        })
    }

    const success_toast = ({ title, description }) => {
        toast.closeAll();
        toast({
            title: title,
            description: description,
            status: 'success',
            duration: 9000,
            isClosable: true,
        })
    }

    const flash_success = (token, toastTitle, toastDescription) => {
        success_toast({ title: toastTitle, description: toastDescription });
        setUser(token.account);
        setAccessToken(token.accessToken);
        setTimeout(() => router.push("/"), 1000);
    }

    const authenticate = async () => {
        acquireToken().then(async loginResponse => {
            if (loginResponse instanceof BrowserAuthError && loginResponse.errorCode == "user_cancelled") {
                // user didn't complete auth flow
                error_toast({ title: "Login Failed", description: "User Canceled Authentication" });

            } else if (loginResponse instanceof Error) {
                // couldn't obtain token for unknown reason
                error_toast({ title: "Login Failed", description: "Unsuccessful Login Attempt" });

            } else {
                // Successfully logged in/obtained a token
                // Now, check if user exists - if not, create account
                const data = await func.get_or_create_user(loginResponse.accessToken);
                // successfull post/insert into users table
                if (data instanceof Response && data.status == 201) {
                    // set state vars, flash account creation success, navigate back home
                    flash_success(loginResponse, "Account Created", "You've successfully added your account!");

                } else if (Array.isArray(data.value) && data.value.length == 1) {
                    // user already exists in db, just log them in
                    flash_success(loginResponse, "Login Success", `Welcome back, ${data.value[0].fname}`);

                } else {
                    error_toast({ title: 'Unexpected Error', description: "Something bad happened along the way" });
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
                        <Image src="/msft.png" alt="Microsoft Logo" width={150} height={100} quality={1} />
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
                        px={3}
                        rounded={'sm'}>
                        Authenticate With A Provider
                    </Text>
                    <Stack spacing={2} align={'center'} w={'full'}>
                            <Button onClick={authenticate} w={'full'} h={'100px'} variant={'outline'} leftIcon={<SiMicrosoftazure w={8} />}>
                            <Center>
                                    <Text fontSize={'lg'} >Sign in with Azure AD </Text>
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