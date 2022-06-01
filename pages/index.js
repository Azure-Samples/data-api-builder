import Head from 'next/head'
import Image from 'next/image'
import React, { useState, useEffect } from 'react';

import gql_functions from "../gql-utilities"

import styles from '../styles/Home.module.css'

// Chakra UI Imports
import { Button, ButtonGroup, Icon, Heading, Textarea, VStack, StackDivider, Box, CircularProgress } from '@chakra-ui/react'
import { BsPlusCircle, BsTrash } from "react-icons/bs";



export default function Home() {

    const [articles, setArticles] = useState([]);
    const [isFetched, setIsFetched] = useState(false);
    const [editing, setEditing] = useState(false);
    const [titleInput, setTitleInput] = useState("");
    const [bodyInput, setBodyInput] = useState("");

    // Listen on change of isFetched to refetch data
    useEffect(() => {
        gql_functions.get_articles().then(data => {
            setArticles(data);
            setIsFetched(true);
        });
    }, [isFetched])

    const post = async () => {
        closeEditor();
        setIsFetched(false);
        await gql_functions.create_article(titleInput, bodyInput);
    }

    const closeEditor = () => {
        setEditing(false);
        setTitleInput("");
        setBodyInput("");
    }


  return (
    <div className={styles.container}>
      <Head>
        <title>Hawaii-CMS</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to Hawaii-CMS!
        </h1>

        <p className={styles.description}>
                  Made with <a href="https://nextjs.org">Next.js</a>, apollo gql, and Azure data gateway.
          
        </p>
              {editing &&
                  <Box backgroundColor="white" padding="20px" width="33%" borderRadius="20px">
                    <VStack width="100%" spacing={0}  alignItems="none" borderWidth="5px" borderRadius="10px" divider={<StackDivider borderColor='gray.200' />}>'
                          <Heading padding="5px" borderRadius="5px" textAlign="center" color="white" width="100%" backgroundColor="gray" fontSize='xl'> Create Article </Heading>
                          <Textarea value={titleInput} onChange={(e) => setTitleInput(e.target.value)} id="title" size="lg" overflow="auto" resize="none" rows={1} placeholder='Title' />
                          <Textarea value={bodyInput} onChange={(e) => setBodyInput(e.target.value)} id="body" size="lg" rows={5} placeholder='Markdown Body' /> 
                          <ButtonGroup isAttached colorScheme="twitter">
                              <Button variant="outline" width="50%" onClick={closeEditor} leftIcon={<BsTrash />}>Discard</Button>
                              <Button colorScheme='twitter' width="50%" onClick={post}> Post </Button>
                          </ButtonGroup>
                          
                    </VStack>
                  </Box>}
              {!editing && <Button onClick={()=>setEditing(true)} size="lg" rightIcon={<BsPlusCircle />}> Create Post </Button>}
              <div className={styles.grid}>
                  {!isFetched && <div className={styles.card}><CircularProgress isIndeterminate color='green.300' /></div>}
                  {articles.slice(0).reverse().map((article) => (
                      <div key={article.id} className={styles.card}>
                          <Heading>
                              {article.title}
                          </Heading>
                          <code className={styles.code}>{article.body}</code>
                      </div>

                  ))}
              </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}
