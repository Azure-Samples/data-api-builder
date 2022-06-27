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

export default function Auth({ user, setUser, accessToken, setAccessToken }) {

    const router = useRouter()
    const toast = useToast()
    const authenticate = async () => {
        acquireToken(setUser, router, setAccessToken).then(loginResponse => {
            if (loginResponse instanceof BrowserAuthError && loginResponse.errorCode == "user_cancelled") {
                toast.closeAll()
                toast({
                    title: 'Login failed',
                    description: "Unsuccessful login attempt",
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                })
            } else {
                // If successfull login, set state vars, flash success, navigate back home
                setUser(loginResponse.account);
                setAccessToken(loginResponse.accessToken)
                toast.closeAll()
                toast({
                    title: 'Login success',
                    description: "You've successfully logged in",
                    status: 'success',
                    duration: 9000,
                    isClosable: true,
                });
                // Wait a second to navigate away for success to flash
                setTimeout(() => router.push("/"), 1000);
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