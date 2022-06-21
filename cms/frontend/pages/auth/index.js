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
import { BsPlusCircle, BsTrash } from "react-icons/bs";
import { SiMicrosoftazure } from "react-icons/si"; 
// Module Imports
import { acquireToken } from '../../auth_config'

export default function Auth({ user, setUser, accessToken, setAccessToken }) {

    const router = useRouter()
    const authenticate = () => acquireToken(setUser, router, setAccessToken);

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