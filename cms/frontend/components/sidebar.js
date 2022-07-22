// Next Imports 
import Link from "next/link";
import { useRouter } from 'next/router'

// React Imports
import React from 'react';

// Chakra UI Imports
import { Box, Flex, Icon, Tabs, TabList, Tab, useColorModeValue } from '@chakra-ui/react'

// Icon Imports
import { FiHome } from 'react-icons/fi';
import { MdOutlineAccountCircle, MdViewHeadline, MdPostAdd } from 'react-icons/md';

const LinkItems = [
    { name: 'Explore', icon: FiHome, href: '/' },
    { name: 'Create Post', icon: MdPostAdd, href: '/myposts?create=true' },
    { name: 'My Posts', icon: MdViewHeadline, href: '/myposts' },
    { name: 'My Account', icon: MdOutlineAccountCircle, href: '/myaccount' },
];

export default function SimpleSidebar({ children }) {
    return (
        <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
            <SidebarContent boxShadow="xl"
                bg={useColorModeValue('gray.100', 'gray.900')}
                display={{ base: 'none', md: 'block' }}
            />

            <Box ml={{ base: 0, md: 60 }}>
                {children}
            </Box>
        </Box>
    );
};


const SidebarContent = ({ ...rest }) => {
    const router = useRouter();
    const [tabIndex, setTabIndex] = React.useState(LinkItems.map(x => x.href).indexOf(router.pathname)); //fancily ensure tabindex maintained on page refresh
    return (
        <Box
            bg={useColorModeValue('white', 'gray.900')}
            borderRight="1px"
            borderRightColor={useColorModeValue('gray.200', 'gray.700')}
            w={{ base: 'full', md: 60 }}
            pos="fixed"
            h="full"
            {...rest}>

            <Flex h="2" alignItems="center" mx="8" justifyContent="space-between" />

            <Tabs orientation="vertical" index={tabIndex} onChange={setTabIndex}>
                <TabList>
                    {LinkItems.map((link) => (
                        <NavItem key={link.name} href={link.href} icon={link.icon}>
                            {link.name}
                        </NavItem>
                    ))}
                </TabList>
            </Tabs>
        </Box>
    );
};

const NavItem = ({ icon, href, children }) => {

    return (

        <Link href={href}>
            <Tab _focus={{ outline: 'none' }} lineHeight="28px" >
                <Flex
                    align="center"
                    p="4"
                    w="full"
                    h="full"
                    borderRadius="lg"
                    role="group"
                    cursor="pointer"
                    _hover={{
                        bg: 'blue.400',
                        color: 'white',
                    }}
                    _active={{
                        bg: 'blue.600',
                        color: 'white'
                    }}
                >
                    {icon && (
                        <Icon
                            mr="4"
                            fontSize={children != "Explore" ? 24 : 20}
                            _groupHover={{
                                color: 'white',
                            }}
                            as={icon}
                        />
                    )}
                    {children}
                </Flex>
            </Tab>
        </Link>
    );
};