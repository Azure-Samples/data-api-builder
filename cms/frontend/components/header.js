// Next Imports 
import Link from "next/link";

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

const logout = async (setUser) => {
    const currentAccount = await msalInstance.getActiveAccount();
    await msalInstance.logoutPopup(
        {
            account: currentAccount,
            postLogoutRedirectUri: "http://localhost:3000/auth"
        });
    setUser(null);
}

export default function Header({ user, setUser }) {
    const { colorMode, toggleColorMode } = useColorMode();
    return (
        <>
            <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
                <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
                    <Link href="/">
                        <Button><Icon as={AiFillHome} boxSize={5} /></Button>
                    </Link>
                    <Box>{user != null ? `Welcome, ${user.username}` : ""}</Box>

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
                                    <Button onClick={()=>logout(setUser)}> Sign Out </Button>
                                }
                                    </Center>
                        </Stack>
                    </Flex>
                </Flex>
            </Box>
        </>
    );
}