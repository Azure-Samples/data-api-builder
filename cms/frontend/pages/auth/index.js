// Next Imports
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'

// React Imports
import React, { useState, useEffect } from 'react';

// Styles
import styles from '../../styles/Home.module.css'

// Chakra UI Imports
import { Button, ButtonGroup, Icon, Heading, Textarea, VStack, StackDivider, Box, CircularProgress } from '@chakra-ui/react'
import { BsPlusCircle, BsTrash } from "react-icons/bs";

// Module Imports
import { acquireToken } from '../../auth_config'

export default function Auth({ user, setUser }) {

    const router = useRouter()
    const authenticate = () => acquireToken(setUser, router);

    return (
        <div className={styles.container}>
            <Head>
                <title>Authenticate</title>
            </Head>
            <main className={styles.main}>
                <div className={styles.card}>
                    <Button onClick={authenticate} padding="50px">
                        <h3 className={styles.title}>
                        
                        Authenticate with Azure AD
                        </h3>
                    </Button>

                    
                </div>

            </main>

        </div>
        )
}