// Next Imports 
import Link from "next/link";

// React Imports
import React from 'react';

// Chakra UI Imports
import {
    IconButton,
    Box,
    CloseButton,
    Flex,
    Icon,
    useColorModeValue,
    Drawer,
    DrawerContent,
    Text,
    useDisclosure,
    BoxProps,
    FlexProps,
} from '@chakra-ui/react';

// Icon Imports
import {
    FiHome,
    FiTrendingUp,
    FiCompass,
    FiStar,
    FiSettings,
    FiMenu,
} from 'react-icons/fi';
import { MdOutlineAccountCircle } from 'react-icons/md';
import { IconType } from 'react-icons';

const LinkItems = [
    { name: 'Explore', icon: FiHome, href: '/' },
    { name: 'My Posts', icon: FiTrendingUp, href: '/myposts' },
    { name: 'My Account', icon: MdOutlineAccountCircle, href: '/myaccount' },
    { name: 'Settings', icon: FiSettings, href: '/' },
];

export default function SimpleSidebar({ children }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
        <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
            <SidebarContent
                bg={useColorModeValue('gray.100', 'gray.900')}
                display={{ base: 'none', md: 'block' }}
                onClose={onClose}
            />
            <Drawer
                autoFocus={false}
                isOpen={isOpen}
                placement="left"
                onClose={onClose}
                returnFocusOnClose={false}
                onOverlayClick={onClose}
                size="full">
                <DrawerContent>
                    <SidebarContent onClose={onClose} />
                </DrawerContent>
            </Drawer>
            <Box ml={{ base: 0, md: 60 }}>
                {children}
            </Box>
        </Box>
    );
};


const SidebarContent = ({ onClose, ...rest }) => {
    return (
        <Box
            bg={useColorModeValue('white', 'gray.900')}
            borderRight="1px"
            borderRightColor={useColorModeValue('gray.200', 'gray.700')}
            w={{ base: 'full', md: 60 }}
            pos="fixed"
            h="full"
            {...rest}>
            <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
                <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
                </Text>
                <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
            </Flex>
            {LinkItems.map((link) => (
                <a key={link.name} href={link.href} >
                    <NavItem icon={link.icon}>
                        {link.name}
                    </NavItem>
                </a>    
            ))}
        </Box>
    );
};

const NavItem = ({ icon, children }) => {
    return (
            <Flex
                align="center"
                p="4"
                mx="4"
                borderRadius="lg"
                role="group"
                cursor="pointer"
                _hover={{
                    bg: 'cyan.400',
                    color: 'white',
                }}>
                {icon && (
                    <Icon
                        mr="4"
                        fontSize="16"
                        _groupHover={{
                            color: 'white',
                        }}
                        as={icon}
                    />
                )}
                {children}
            </Flex>
    );
};