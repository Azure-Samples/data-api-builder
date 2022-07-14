// Next Imports 
import Link from "next/link";
import { useRouter } from 'next/router'

// React Imports
import { ReactNode } from 'react';

// Chakra UI Imports
import {
    Box,
    Flex,
    Avatar,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    useDisclosure,
    useColorModeValue,
    Stack,
    useColorMode,
    Center,
    Icon
} from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { AiFillHome } from 'react-icons/ai';

// Module Imports
import { msalInstance } from "../auth_config"


const NavLink = ({ children }) => (
    <Link
        px={2}
        py={1}
        rounded={'md'}
        _hover={{
            textDecoration: 'none',
            bg: useColorModeValue('gray.200', 'gray.700'),
        }}
        href={'#'}>
        {children}
    </Link>
);

const logout = async (setUser, setAccessToken, router) => {
    const currentAccount = await msalInstance.getActiveAccount();
    await msalInstance.logoutPopup(
        {
            account: currentAccount,
            postLogoutRedirectUri: "http://localhost:3000/auth"
        });
    setUser(null);
    setAccessToken(null);
    router.push("/");
    // TODO: Error check logout and toast to client
}

export default function Header({ user, setUser, setAccessToken }) {
    const { colorMode, toggleColorMode } = useColorMode();
    const router = useRouter();

    return (
        <>
            <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4} >
                <Flex h={16} alignItems={'center'} justifyContent={'space-between'} >
                    {router.pathname == "/auth" && <Link href="/">
                        <Button><Icon as={AiFillHome} boxSize={5} /></Button>
                    </Link>}
                    <Box mr={'auto'} ml={'1em'}>{user != null ? `Welcome, ${user.username}` : ""}</Box>

                    <Flex alignItems={'center'}>
                        <Stack direction={'row'} spacing={7}>
                            <Button onClick={toggleColorMode}>
                                {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                            </Button>
                                    <br />
                                    <Center>
                                {user == null &&
                                    <Link href="/auth" >
                                        <Button> Sign In </Button>
                                    </Link>
                                }
                                {user != null &&  
                                    <Button onClick={()=>logout(setUser, setAccessToken, router)}> Sign Out </Button>
                                }
                                    </Center>
                        </Stack>
                    </Flex>
                </Flex>
            </Box>
        </>
    );
}