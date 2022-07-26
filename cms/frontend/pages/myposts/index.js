// Next Imports
import Head from 'next/head'
import { useRouter } from 'next/router'

// React Imports
import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

// Styles
import styles from '../../styles/Home.module.css'
import mdStyles from '../../styles/github-markdown.module.css'

// Chakra UI Imports
import {
    Button, ButtonGroup, Icon, IconButton, Box, CircularProgress, useColorModeValue, Text, Tooltip, Tag, HStack,
    Collapse, useDisclosure, useToast, Center, Modal, ModalOverlay, ModalContent,
    AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay
} from '@chakra-ui/react'
import { BsTrash, BsX } from "react-icons/bs";
import { FiSend } from "react-icons/fi";
import { MdPostAdd, MdOutlineBookmarkAdd, MdEditNote } from 'react-icons/md';
import { TbCircleDot, TbCircleCheck } from "react-icons/tb"

// Msal Imports
import { AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";

// Module Imports
//import { gql_functions as func } from "../../utils/gql"
import { rest_functions as func } from "../../utils/rest"
import { human_time_diff, isNullOrWhitespace, success_toast, error_toast, info_toast, surface_appropriate_error } from "../../utils/misc"
import Footer from "../../components/footer"

// Welcome UI Imports
import { MarkdownEditor } from '@welcome-ui/markdown-editor'
import { Field } from '@welcome-ui/field'
import { createTheme, WuiProvider } from '@welcome-ui/core'
import { Icons } from '@welcome-ui/icons'
import { InputText } from '@welcome-ui/input-text'


// Constants shared between components
const wuiToolbar = [
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
];

const wuiTheme = {
    fonts: {
        texts: "system-ui, sans-serif",
        heading: "Georgia, serif",
    },
    labels: {
        "fontSize": "1.4rem",
    },
    icons: {
        md: "1.25rem",
    }
};

export default function MyPosts({ user, dbUser, setUser, cacheChecked }) {
    const [articles, setArticles] = useState([]);
    const [isFetched, setIsFetched] = useState(false);

    // Create article editor state vars
    const [createTitleInput, setCreateTitleInput] = useState("");
    const [createBodyInput, setCreateBodyInput] = useState("");

    // Have create article editor open depending on query params
    // On state initialization router is undefined, so have to listen for changes
    const router = useRouter();
    const [editing, setEditing] = useState("create" in router.query);
    useEffect(() => { setEditing("create" in router.query) }, [router]);

    const toast = useToast()
    const titleRef = useRef();
    const bodyRef = useRef();

    // Hiding welcome ui's awful scrollbars in the markdown editors
    useEffect(() => {
        Array.from(document.getElementsByClassName("CodeMirror-vscrollbar")).forEach(element => element.hidden = true);
    }, [createBodyInput])

    // Utility function for (re)fetching articles
    // This function shouldn't change, so useCallback memoizes it to prevent recreation each component render
    const fetch_articles = React.useCallback(async () => {
        try {
            const data = await func.get_my_articles();
            setArticles(data);
        } catch (err) {
            surface_appropriate_error(toast, err);
        } finally {
            setIsFetched(true);
        }
    }, [toast])

    // Initial data fetching (wait for cache to be checked)
    useEffect(() => {
        if (!isFetched && cacheChecked) {
            fetch_articles();
        }
    }, [cacheChecked, fetch_articles, isFetched])


    // Create an article and trigger data refetch, which triggers page rerender
    const submit_post = async (statusID) => {
        if (validate_post(titleRef, bodyRef, createTitleInput, createBodyInput)) {
            setIsFetched(false); //triggers loading animation
            try {
                await func.create_article(createTitleInput, createBodyInput, statusID);
                await fetch_articles();
                if (statusID == 1) {
                    info_toast(toast, { title: "Saved Draft", description: "Saved your article as a draft" })
                } else if (statusID == 2) {
                    success_toast(toast, { title: "Published", description: "Published your article!" })
                }
                closeEditor();
            } catch (err) {
                surface_appropriate_error(toast, err);
            } finally {
                setIsFetched(true);
            }
        }
    }

    // Validate the post title and body and toast error/warning if needed
    const validate_post = (titleRef, bodyRef, titleInput, bodyInput) => {
        if (isNullOrWhitespace(titleInput)) {
            titleRef.current.focus(); //focuses title field
            error_toast(toast, {
                title: "Article Creation Error",
                description: "Article title cannot be empty!"
            });
        } else if (isNullOrWhitespace(bodyInput)) {
            bodyRef.current.simpleMde.codemirror.focus(); //focuses body field
            error_toast(toast, {
                title: "Article Creation Error",
                description: "Article content cannot be empty!"
            });
        } else if (titleInput.length > 100) {
            titleRef.current.focus();
            error_toast(toast, {
                title: "Article Creation Error",
                description: "Title too long! Please keep your title under 100 characters.",
            })
        } else {
            return true;
        }
    }

    const delete_post = async (articleID) => {
        setIsFetched(false); //triggers loading animation
        try {
            await func.delete_article(articleID); 
            await fetch_articles();
            toast.closeAll();
            info_toast(toast, {
                title: "Delete Notification",
                description: `Deleted article with ID: ${articleID}`
            });
        } catch (err) {
            surface_appropriate_error(toast, err);
        } finally {
            setIsFetched(true);
        }
    }

    const convert_post = async (articleID, status) => {
        setIsFetched(false);
        try {
            await func.update_article_status(articleID, status);
            toast.closeAll();
            if (status == 1) {
                info_toast(toast, { title: "Reverted", description: "Converted your article to draft status" })
            } else if (status == 2) {
                success_toast(toast, { title: "Published", description: "Published your draft article!" })
            }
            await fetch_articles();
        } catch (err) {
            surface_appropriate_error(toast, err);
        } finally {
            setIsFetched(true);
        }
    }

    const update_post = async (article, titleRef, bodyRef, newTitle, newBody, newStatus, onClose, setIconLoading) => {
        setIconLoading(true);
        if (article.title != newTitle || article.body != newBody || article.status != newStatus) {
            if (validate_post(titleRef, bodyRef, newTitle, newBody)) {
                setIsFetched(false);
                try {
                    await func.update_article(article.id, newTitle, newBody, newStatus);
                    if (newStatus == 1) {
                        info_toast(toast, { title: "Updated", description: "Saved your updated article as a draft" })
                    } else if (newStatus == 2) {
                        success_toast(toast, { title: "Updated", description: "Published your updated article!" })
                    }
                    onClose();
                    setIconLoading(false);
                    await fetch_articles();
                } catch (err) {
                    surface_appropriate_error(toast, err);
                } finally {
                    setIsFetched(true);
                }
            } else {
                setIconLoading(false);
            } 
        } else {
            error_toast(toast, { title: "No changes detected", description: "Update title, body, or status" });
            setIconLoading(false);
        }
    }

    // Utility function for closing the editor interface
    const closeEditor = async () => {
        setEditing(false);
        setCreateTitleInput("");
        setCreateBodyInput("");
    }
    const basecolor = useColorModeValue('whitesmoke', 'gray.800');
    const bgcolor = useColorModeValue('white', 'gray.800');

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
                        <WuiProvider theme={createTheme(wuiTheme)}>
                            <Box bg={bgcolor} padding="2em" width="90%" borderRadius="20px" margin="2em auto 2em auto" boxShadow={'lg'}>
                                <Field label="Create Article" >
                                    <InputText ref={titleRef} placeholder="Title" value={createTitleInput} onChange={(e) => setCreateTitleInput(e.target.value)}
                                        borderRadius=".375rem .375rem 0 0" fontSize="1rem" />
                                </Field>
                                <MarkdownEditor ref={bodyRef} borderRadius={0} value={createBodyInput} onChange={(e) => setCreateBodyInput(e.target.value)}
                                    toolbar={wuiToolbar} name="welcome" placeholder="Markdown Body" minHeight="20em" maxHeight="80vh" overflowY="auto" fontSize="1rem"
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
                            <Post key={article.id} article={article} dbUser={dbUser} bgcolor={bgcolor}
                                delete_post={delete_post} convert_post={convert_post} update_post={update_post} />
                        ))}
                    </div>
                </AuthenticatedTemplate>
                <UnauthenticatedTemplate>
                    <Text m={5} fontSize="xl" > Sorry, you can&apos;t access this </Text>
                </UnauthenticatedTemplate>
            </main>
            <Footer />
        </Box>
    )
}

function Post({ article, dbUser, delete_post, bgcolor, convert_post, update_post }) {
    // Populate the icon depending on draft/published status
    const [icon, setIcon] = useState(article.status == 2 ? "fill" : "outline");
    useEffect(() => setIcon(article.status == 2 ? "fill" : "outline"), [article]);

    // Update article editor state vars
    const [title, setTitle] = useState(article.title);
    const [body, setBody] = useState(article.body);

    // Draft and publish button loading animations on update article
    const [draftLoading, setDraftLoading] = useState(false);
    const [publishLoading, setPublishLoading] = useState(false);

    // Hiding welcome ui's awful scrollbars in the markdown editor
    useEffect(() => {
        Array.from(document.getElementsByClassName("CodeMirror-vscrollbar")).forEach(element => element.hidden = true);
    }, [body])

    // Delete dialog's state
    const {
        isOpen: isOpenDelete,
        onOpen: onOpenDelete,
        onClose: onCloseDelete
    } = useDisclosure();

    // Update modal's state
    const {
        isOpen: isOpenUpdateModal,
        onOpen: onOpenUpdateModal,
        onClose: onCloseUpdateModal
    } = useDisclosure();

    // Discards state changes
    const closeModal = () => {
        setTitle(article.title);
        setBody(article.body);
        onCloseUpdateModal();
    }

    const cancelDeleteRef = useRef();
    const titleRef = useRef();
    const bodyRef = useRef();

    return (
        <Box key={article.id} className={styles.card} bg={bgcolor} boxShadow={'lg'}>
            <div className={styles.post_header} style={{ backgroundColor: "#ddf4ff" }}>
                <HStack>
                    <Tooltip label={dbUser.email}>
                        <Text fontWeight="semibold"> {dbUser.fname} {dbUser.lname} </Text>
                    </Tooltip>
                    <Tooltip label={
                        <span>
                            {new Date(`${article.published}Z`).toLocaleDateString()}
                            <span> &#183; </span>
                            {new Date(`${article.published}Z`).toLocaleTimeString()}
                        </span>}>
                        <Text> {article.status == 2 ? "published" : "saved"} {human_time_diff(article.published)} ago </Text>
                    </Tooltip>
                </HStack>
                <HStack>
                    <Tag mr={"5px"} colorScheme={article.status == 2 ? "green" : "purple"} variant="outline"> {article.status == 2 ? "Published" : "Draft"} </Tag>
                    {article.status == 2 && 
                    <Center onMouseEnter={() => setIcon("outline")} onMouseLeave={() => setIcon("fill")}>
                        <Tooltip label="Convert to draft" shouldWrapChildren>
                            <Icon as={icon == "fill" ? TbCircleCheck : TbCircleDot} boxSize="1.5em" cursor="pointer" _hover={{ color: "purple" }} onClick={() => convert_post(article.id, 1)} />
                        </Tooltip>
                    </Center>}
                    {article.status == 1 && 
                    <Center onMouseEnter={() => setIcon("fill")} onMouseLeave={() => setIcon("outline")}>
                        <Tooltip label="Publish" shouldWrapChildren>
                            <Icon as={icon == "fill" ? TbCircleCheck : TbCircleDot} boxSize="1.5em" cursor="pointer" _hover={{ color: "green" }} onClick={() => convert_post(article.id, 2)} />
                        </Tooltip>
                    </Center>}
                    <Center pl={"5px"}>
                        <Tooltip label="Edit this post" shouldWrapChildren>
                            <Icon as={MdEditNote} boxSize="1.5em" cursor="pointer" _hover={{ color: "blue" }} onClick={onOpenUpdateModal} />
                        </Tooltip>
                        <Modal isOpen={isOpenUpdateModal}
                            onClose={closeModal}
                            preserveScrollBarGap
                            returnFocusOnClose={false}
                            isCentered
                            size="6xl"
                        >
                            <ModalOverlay />
                            <ModalContent borderRadius="20px">
                            <WuiProvider theme={createTheme(wuiTheme)}>
                                <Box bg={bgcolor} w="full" padding="2em" borderRadius="1em">
                                    <Field label="Update Article" >
                                        <InputText ref={titleRef} placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)}
                                            borderRadius=".375rem .375rem 0 0" fontSize=".9rem" />
                                    </Field>
                                    <MarkdownEditor ref={bodyRef} borderRadius={0} value={body} onChange={(e) => setBody(e.target.value)}
                                        toolbar={wuiToolbar} name="welcome" placeholder="Markdown Body" minHeight="20em" fontSize=".9rem" maxHeight="70vh" overflowY="auto" />
                                    <ButtonGroup isAttached colorScheme="gray" variant="outline" w="full">
                                        <Tooltip label="Discard update">
                                            <IconButton flexGrow={1} _hover={{ color: "red.600", bg: "gray.100" }} borderTopLeftRadius={0} isLoading={false}
                                                onClick={onCloseUpdateModal} icon={<Icon as={BsTrash} boxSize={5} />} />
                                        </Tooltip>
                                        <Tooltip label="Save as draft">
                                            <IconButton flexGrow={1} _hover={{ color: "purple", bg: "gray.100" }}  isLoading={draftLoading}
                                                onClick={() => update_post(article, titleRef, bodyRef, title, body, 1, onCloseUpdateModal, setDraftLoading)}
                                                icon={<Icon as={MdOutlineBookmarkAdd} boxSize="1.4rem" />} />
                                        </Tooltip>
                                        <Tooltip label="Publish update">
                                            <IconButton flexGrow={1} _hover={{ color: "blue.600", bg: "gray.100" }} borderTopRightRadius={0}  isLoading={publishLoading}
                                                onClick={() => update_post(article, titleRef, bodyRef, title, body, 2, onCloseUpdateModal, setPublishLoading)}
                                                icon={<Icon as={FiSend} boxSize={5} />} />
                                        </Tooltip>
                                    </ButtonGroup>
                                </Box>
                                </WuiProvider>
                            </ModalContent>
                        </Modal>
                    </Center>
                    <Center>
                        <Tooltip label="Delete this post" shouldWrapChildren>
                            <Icon as={BsX} boxSize="1.5em" cursor="pointer" _hover={{ color: "red" }} _active={{ color: "red.600" }} onClick={onOpenDelete} />
                        </Tooltip>
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
                                  Delete Article
                                </AlertDialogHeader>

                                <AlertDialogBody>
                                  Are you sure? You can&apos;t undo this action afterwards.
                                </AlertDialogBody>

                                <AlertDialogFooter>
                                  <Button ref={cancelDeleteRef} onClick={onCloseDelete}>
                                    Cancel
                                  </Button>
                                  <Button colorScheme='red' onClick={() => { onCloseDelete(); delete_post(article.id); } } ml={3}>
                                    Delete
                                  </Button>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialogOverlay>
                          </AlertDialog>
                    </Center>
                </HStack>
            </div>

            <div className={mdStyles["markdown-body"]} style={{ padding: "1.5em", borderRadius: "0px 0px 10px 10px" }} >
                <h1 style={{ fontSize: "2.5em" }}> {article.title} </h1>
                <ReactMarkdown className={mdStyles["markdown-body"]} remarkPlugins={[remarkGfm]} >
                    {article.body}
                </ReactMarkdown>
            </div>
        </Box>
    )
}
