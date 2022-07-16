// Next Imports
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'

// React Imports
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

// Styles
import styles from '../../styles/Home.module.css'
import mdStyles from '../../styles/github-markdown.module.css'

// Chakra UI Imports
import {
    Button, ButtonGroup, Icon, IconButton, Heading, Textarea, VStack,
    StackDivider, Box, CircularProgress, useColorModeValue, Text, Tooltip,
    Tag, HStack, Collapse, useDisclosure, useToast, Center, ChakraProvider
} from '@chakra-ui/react'
import { BsPlusCircle, BsTrash, BsX, BsXSquareFill } from "react-icons/bs";
import { CloseIcon } from '@chakra-ui/icons';
import { FiSend } from "react-icons/fi";
import { MdPostAdd, MdOutlineBookmarkAdd } from 'react-icons/md';

// Msal Imports
import { AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";

// Module Imports
//import { gql_functions as func } from "../../utils/gql"
import { rest_functions as func } from "../../utils/rest"
import { human_time_diff, isNullOrWhitespace } from "../../utils/misc"
import Footer from "../../components/footer"

// Welcome UI Imports
import { MarkdownEditor } from '@welcome-ui/markdown-editor'
import { Field } from '@welcome-ui/field'
import { createTheme, WuiProvider } from '@welcome-ui/core'
import { Icons } from '@welcome-ui/icons'
import { InputText } from '@welcome-ui/input-text'


export default function MyPosts({ user, setUser, accessToken, cacheChecked }) {
    const [articles, setArticles] = useState([]);
    const [isFetched, setIsFetched] = useState(false);
    const [titleInput, setTitleInput] = useState("");
    const [bodyInput, setBodyInput] = useState("");

    // Have editor open depending on query params
    // On state initialization router is undefined, so have to listen for changes
    const router = useRouter();
    const [editing, setEditing] = useState("create" in router.query);
    useEffect(() => { setEditing("create" in router.query) }, [router]);

    const toast = useToast()

    // Utility function for (re)fetching articles
    const fetch_articles = async () => {
        func.get_my_articles(accessToken).then(data => {
            if (data != null && data != undefined) {
                setArticles(data);
            } else {
                console.log('null/undefined data')
                // let the loader know to stop on edge case of no data
                setIsFetched(true);
            }
        }).catch(err => {
            console.log(err);
            setIsFetched(true);
        });
    }

    // Initial data fetching (wait for cache to be checked)
    useEffect(() => {
        if (!isFetched && cacheChecked) {
            fetch_articles();
        }
    }, [cacheChecked])

    // Remove loading animation on data being fetched
    useEffect(() => {
        if (cacheChecked) {
            setIsFetched(true);
        }
    }, [articles])

    // Create an article and trigger data refetch, which triggers page rerender
    const submit_post = async (statusID) => {
        if (validate_post()) {
            closeEditor();
            setIsFetched(false); //triggers loading animation
            await func.create_article(accessToken, titleInput, bodyInput, statusID);
            await fetch_articles();
        }
    }

    // Validate the post title and body and toast error/warning if needed
    const validate_post = () => {
        if (isNullOrWhitespace(titleInput) || isNullOrWhitespace(bodyInput)) {
            toast({
                title: "Article Creation Error",
                description: "Article title/body cannot be empty!",
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
        } else if (titleInput.length > 100) {
            toast({
                title: "Article Creation Error",
                description: "Title too long! Please keep your title under 100 characters.",
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
        } else {
            return true;
        }
    }

    const delete_post = async (articleID) => {
        setIsFetched(false); //triggers loading animation
        try {
            await func.delete_article(accessToken, articleID);
        } catch (Error) {
            toast({
                title: "Unexpected Deletion Error",
                description: "I don't know what happened. Sorry.",
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
            return;
        }
        await fetch_articles();
        toast({
            title: "Delete Notification",
            description: `Deleted article with ID: ${articleID}`,
            status: 'info',
            duration: 9000,
            isClosable: true,
        })
    }

    // Utility function for closing the editor interface
    const closeEditor = async () => {
        setEditing(false);
        setTitleInput("");
        setBodyInput("");
    }
    const basecolor = useColorModeValue('whitesmoke', 'gray.800');
    const bgcolor = useColorModeValue('white', 'gray.800');
    const codebgcolor = useColorModeValue('#fafafa', 'black');

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
                        View Your Posts
                    </h1>

                    <p className={styles.description}>
                        See all your posts, both draft and published!

                    </p>
                </Box>
                <AuthenticatedTemplate>
                    <Collapse bg={bgcolor} style={{ width: "100%" }} in={editing} animateOpacity>
                        <WuiProvider theme={createTheme({
                            fonts: {
                                texts: "system-ui, sans-serif",
                                heading: "Georgia, serif",
                            },
                            "labels": {
                                "fontSize": "1.4rem",
                            },
                            "icons": {
                                "md": "1.25rem",
                            }})}>
                            <Box bg={bgcolor} padding="20px" width="90%" borderRadius="20px" margin="2em auto 2em auto" boxShadow={'lg'}>
                                <Field label="Create Article" >
                                    <InputText placeholder="Title" value={titleInput} onChange={(e) => setTitleInput(e.target.value)} borderRadius=".375rem .375rem 0 0" />
                                </Field>
                                <MarkdownEditor borderRadius={0} value={bodyInput} onChange={(e) => setBodyInput(e.target.value)}
                                    toolbar={[
                                        { name: 'bold', title: 'Bold' },
                                        { name: 'italic', title: 'Italic' },
                                        { name: 'strikethrough', title: 'Strikethrough' },
                                        { name: 'link', title: 'Link' },
                                        { name: 'divider' },
                                        { name: 'heading_1', title: 'Heading 1' },
                                        { name: 'heading_2', title: 'Heading 2' },
                                        { name: 'divider' },
                                        { name: 'unordered_list', title: 'Unordered list' },
                                        { name: 'ordered_list', title: 'Ordered list' },
                                        { name: 'divider' },
                                        { name: 'code', title: 'Code' },
                                        { name: 'quote', title: 'Quote' },
                                    ]} name="welcome" placeholder="Markdown Body" minHeight="20em"
                                />
                                <ButtonGroup isAttached colorScheme="gray" variant="outline" w="full">
                                    <Tooltip label="Discard this post">
                                        <IconButton flexGrow={1} _hover={{ color: "red.600", bg: "gray.100" }} borderTopLeftRadius={0} onClick={closeEditor} icon={<Icon as={BsTrash} boxSize={5} />} />
                                    </Tooltip>
                                    <Tooltip label="Save as draft">
                                        <IconButton flexGrow={1} _hover={{ color: "purple", bg: "gray.100" }} onClick={()=>submit_post(1)} icon={<Icon as={MdOutlineBookmarkAdd} boxSize="1.4rem" />}/>
                                    </Tooltip>
                                    <Tooltip label="Publish this post">
                                        <IconButton flexGrow={1} _hover={{ color: "blue.600", bg: "gray.100" }} borderTopRightRadius={0} onClick={()=>submit_post(2)} icon={<Icon as={FiSend} boxSize={5} />} />
                                    </Tooltip>
                                </ButtonGroup>
                            </Box>
                        </WuiProvider>

                    </Collapse>
                    
                    {!editing && <Button onClick={() => setEditing(true)} border="1px" boxShadow={'lg'} w="90%" borderColor="gray.300" size="lg" margin="2rem 0" rightIcon={<MdPostAdd />}> Create Post </Button>}
                    
                    <div className={styles.grid}>
                        {!isFetched && <div className={styles.loader}><CircularProgress isIndeterminate color='green.300' /></div>}
                        {articles.slice(0).reverse().map((article) => (
                            <Box key={article.id} className={styles.card} bg={bgcolor} boxShadow={'lg'}>
                                <div className={styles.post_header} style={{ backgroundColor: "#ddf4ff" }}>
                                    <HStack>
                                        <Tooltip label={user.username}>
                                            <Text fontWeight="semibold"> {user.idTokenClaims.name} </Text>
                                        </Tooltip>
                                        <Tooltip label={
                                            <span>
                                                {new Date(article.published).toLocaleDateString()}
                                                <span> &#183; </span>
                                                {new Date(article.published).toLocaleTimeString()}
                                            </span>}>
                                            <Text> {article.status == 2 ? "published" : "saved"} {human_time_diff(article.published)} ago </Text>
                                        </Tooltip>
                                    </HStack>
                                    <HStack>
                                        <Tooltip label="Edit this post" shouldWrapChildren>

                                        </Tooltip>
                                        <Tooltip label="Delete this post" shouldWrapChildren>
                                            <Center>
                                                <Icon as={BsX} boxSize="1.5em" cursor="pointer" _hover={{ color: "red" }} onClick={() => delete_post(article.id)} />
                                            </Center>
                                        </Tooltip>

                                    </HStack>
                                </div>

                                <div className={mdStyles["markdown-body"]} style={{ padding: "1.5em", borderRadius: "0px 0px 10px 10px" }} >
                                    <h1 style={{ fontSize: "2.5em" }}> {article.title} </h1>
                                    <ReactMarkdown className={mdStyles["markdown-body"]} remarkPlugins={[remarkGfm]} >
                                        {article.body}
                                    </ReactMarkdown>
                                </div>
                            </Box>

                        ))}
                    </div>
                </AuthenticatedTemplate>
                <UnauthenticatedTemplate>
                    <h1> Sorry, you can't access this </h1>
                </UnauthenticatedTemplate>
            </main>
            <Footer />
        </Box>
    )
}
