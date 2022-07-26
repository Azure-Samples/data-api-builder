// Next Imports
import Head from 'next/head'
import { useRouter } from 'next/router'

// React Imports
import React, { useState, useEffect, useRef } from 'react';

// Styles
import styles from '../../styles/Home.module.css'
import mdStyles from '../../styles/github-markdown.module.css'

// Chakra UI Imports
import {
    Button, ButtonGroup, Icon, Box, useColorModeValue, Text, Tooltip, Tag, Stack,
    useDisclosure, useToast, Center, Input, InputGroup, InputLeftAddon, Heading, SkeletonText,
    AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay,
} from '@chakra-ui/react'
import { BiRename } from "react-icons/bi";
import { MdOutlineMailOutline } from 'react-icons/md';

// Msal Imports
import { AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";

// Module Imports
//import { gql_functions as func } from "../../utils/gql"
import { rest_functions as func } from "../../utils/rest"
import { success_toast, error_toast, info_toast, surface_appropriate_error } from "../../utils/misc"
import { msalInstance } from "../../auth_config"
import Footer from "../../components/footer"



export default function MyAccount({ user, setUser, setDbUser, cacheChecked }) {
    
    const [userData, setUserData] = useState({});
    const [fname, setFname] = useState("");
    const [lname, setLname] = useState("");
    const [email, setEmail] = useState("");

    const [isFetched, setIsFetched] = useState(false);
    const toast = useToast();
    const router = useRouter();

    const cancelDeleteRef = useRef();
    const fnameRef = useRef();
    const lnameRef = useRef();
    const emailRef = useRef();

    const {
        isOpen: isOpenDelete,
        onOpen: onOpenDelete,
        onClose: onCloseDelete
    } = useDisclosure();

    const basecolor = useColorModeValue('whitesmoke', 'gray.800');
    const bgcolor = useColorModeValue('white', 'gray.800');

    // Utility function for (re)fetching account data
    // This function shouldn't change, so useCallback memoizes it to prevent recreation each component render
    const fetch_account = React.useCallback(async () => {
        try {
            const data = await func.get_user();
            setUserData(data == null || data == undefined ? {} : data);
            setDbUser(data);
        } catch (err) {
            console.log(toast);
            surface_appropriate_error(toast, err);
            setUserData({});
        } finally {
            setIsFetched(true);
        }
    }, [setDbUser, toast]);

    // Initial data fetching (wait for cache to be checked)
    useEffect(() => {
        if (!isFetched && cacheChecked) {
            fetch_account();
        }
    }, [cacheChecked, fetch_account, isFetched])


    const update_account = async () => {
        if (validate_update()) {
            setIsFetched(false);
            try {
                await func.update_user(userData.guid, fname == "" ? null : fname.trim(), lname == "" ? null : lname.trim(), email == "" ? null : email.trim())
                success_toast(toast, { title: "Account Updated", description: "Updated your user account info" });
                await fetch_account();
                setFname(fname.trim());
                setLname(lname.trim());
                setEmail(email.trim());
            } catch (err) {
                surface_appropriate_error(toast, err);
            } finally {
                setIsFetched(true);
            }
        }
    }

    // Validate the account fname and lname are non-empty, single words
    const validate_update = () => {
        if (fname != "" && !fname.trim()) {
            fnameRef.current.focus();
            error_toast(toast, {
                title: "Update Error",
                description: "First name must be non-empty"
            });
        } else if (lname != "" && !lname.trim()) {
            lnameRef.current.focus();
            error_toast(toast, {
                title: "Update Error",
                description: "Last name must be non-empty"
            });
        } else if (email != "" && !email.trim()) {
            emailRef.current.focus();
            error_toast(toast, {
                title: "Update Error",
                description: "Email must be non-empty"
            });
        } else if (fname.trim().split(' ').length != 1) {
            fnameRef.current.focus();
            error_toast(toast, {
                title: "Update Error",
                description: "Please limit names to one word (you may hyphenate)",
            });
        } else if (lname.trim().split(' ').length != 1) {
            lnameRef.current.focus();
            error_toast(toast, {
                title: "Update Error",
                description: "Please limit names to one word (you may hyphenate)",
            });
        } else {
            return true;
        }
    }

    const delete_account = async () => {
        setIsFetched(false); //triggers loading animation
        try {
            await func.delete_user(userData.guid); 
            toast.closeAll();
            info_toast(toast, {
                title: "Account Deleted",
                description: `Deleted account associated with: ${userData.email}`
            });
            // Tear down all stored state
            await router.push("/")
            const currentAccount = await msalInstance.getActiveAccount();
            await msalInstance.logoutPopup(
                {
                    account: currentAccount,
                    postLogoutRedirectUri: "http://localhost:3000"
                });
            setUser(null);
            setDbUser(null);
        } catch (err) {
            surface_appropriate_error(toast, err);
        } finally {
            setIsFetched(true);
        }
    }

    return (
        <Box bg={basecolor} className={styles.container}>
            <Head>
                <title>Hawaii-CMS</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <Box bg={bgcolor} className={styles.header} boxShadow="md">
                    <h1 className={styles.title}>
                        View Your Account
                    </h1>

                    <p className={styles.description}>
                        View, edit, or delete your account

                    </p>
                </Box>
                <AuthenticatedTemplate>
                    <Center mt={'5%'} bg={useColorModeValue('white', 'gray.700')} borderRadius="lg" boxShadow="lg" w="60%">
                        <Stack spacing={5} w="full">
                            <Text
                                align={'center'}
                                fontSize={'2xl'}
                                fontWeight={600}
                                bg={useColorModeValue('gray.200', 'gray.900')}
                                p={2}
                                px={3}
                                borderTopRadius={"md"}>
                                    User Account Info
                            </Text>
                            <Stack spacing={4} p={8}>
                            {
                                [
                                    { label: "First Name", initial: userData.fname, icon: BiRename, value: fname, change: setFname, ref: fnameRef},
                                    { label: "Last Name", initial: userData.lname, icon: BiRename, value: lname, change: setLname, ref: lnameRef},
                                    { label: "Email", initial: userData.email, icon: MdOutlineMailOutline, value: email, change: setEmail, ref: emailRef}
                                ].map((elem, idx) => (
                                    <InputGroup key={idx} boxShadow="md">
                                        <InputLeftAddon w="10em" borderRadius="md">
                                            <Icon as={elem.icon} mr={4} /> {elem.label} </InputLeftAddon>
                                        {isFetched ? <Input ref={elem.ref} value={elem.value} onChange={(e) => elem.change(e.target.value)} w="full" placeholder={`${elem.initial}`} /> :
                                            <SkeletonText isLoaded={isFetched} borderRadius="md" w="full" /> 
                                        }
                                    </InputGroup>
                                ))
                            }
                            
                            </Stack>
                            <ButtonGroup px={8} pb={4} justifyContent="space-between" >
                                <Button w="10em" variant="outline" colorScheme="linkedin" isLoading={!isFetched} onClick={update_account}> Update Info </Button>
                                <Button w="10em" colorScheme="red" onClick={onOpenDelete} isLoading={!isFetched}> Delete Account </Button>
                            </ButtonGroup>
                            <AlertDialog
                                isOpen={isOpenDelete}
                                leastDestructiveRef={cancelDeleteRef}
                                onClose={onCloseDelete}
                                preserveScrollBarGap
                                returnFocusOnClose={false}
                                isCentered
                            >
                                <AlertDialogOverlay>
                                    <AlertDialogContent>
                                        <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                                            Delete Account
                                        </AlertDialogHeader>

                                        <AlertDialogBody>
                                            Are you sure? You can&apos;t undo this action afterwards.
                                            <br />
                                            This action will result in <strong> all your posts being deleted. </strong> 
                                        </AlertDialogBody>

                                        <AlertDialogFooter>
                                            <Button ref={cancelDeleteRef} onClick={onCloseDelete}>
                                                Cancel
                                            </Button>
                                            <Button colorScheme='red' onClick={() => { onCloseDelete(); delete_account(); }} ml={3}>
                                                Delete
                                            </Button>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialogOverlay>
                            </AlertDialog>
                        </Stack>
                    </Center>

                    
                </AuthenticatedTemplate>
                <UnauthenticatedTemplate>
                    <Text m={5} fontSize="xl" > Sorry, you can&apos;t access this </Text>
                </UnauthenticatedTemplate>
            </main>
            <Footer />
        </Box>
    )
}
