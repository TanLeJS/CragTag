"use client"

import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    BottomNavigation,
    BottomNavigationAction,
    Badge,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import CreatePostModal from '../post/CreatePostModal';
import { useNotifications } from '@/context/notification/NotificationContext';

interface AppLayoutProps {
    children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [mobileNavValue, setMobileNavValue] = useState(0);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [userName, setUserName] = useState<string | null>(null);
    const { unreadCount } = useNotifications();

    // Load username from localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const user = localStorage.getItem('user');
            if (user) {
                try {
                    const parsedUser = JSON.parse(user);
                    setUserName(parsedUser.userName);
                } catch (error) {
                    console.error('Error parsing user from localStorage:', error);
                }
            }
        }
    }, []);

    // Update active tab based on pathname
    useEffect(() => {
        if (pathname === '/') {
            setMobileNavValue(0);
        } else if (userName && pathname === `/${userName}`) {
            setMobileNavValue(3);
        }
    }, [pathname, userName]);

    const handleMobileNavChange = (event: React.SyntheticEvent, newValue: number) => {
        setMobileNavValue(newValue);

        switch (newValue) {
            case 0: // Home
                if (pathname === '/') {
                    window.location.reload();
                } else {
                    router.push('/');
                }
                break;
            case 1: // Create Post
                setCreateModalOpen(true);
                break;
            case 2: // Notifications (placeholder)
                // Note: Notifications are handled via Sidebar on desktop
                // Mobile notification drawer not yet implemented
                break;
            case 3: // Profile
                if (userName) {
                    router.push(`/${userName}`);
                }
                break;
        }
    };

    const handlePostCreated = () => {
        setCreateModalOpen(false);
        router.refresh();
    };

    return (
        <Box
            suppressHydrationWarning
            sx={{
                minHeight: '100vh',
                display: 'flex',
            }}
        >
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <Box
                suppressHydrationWarning
                sx={{
                    flex: 1,
                    ml: { xs: 0, md: '245px' },
                    pt: { xs: 8, md: 4 },
                    pb: { xs: 10, md: 4 },
                    minHeight: '100vh',
                    bgcolor: '#E9EDE8',
                }}
            >
                {children}
            </Box>

            {/* Mobile Bottom Navigation */}
            <Paper
                suppressHydrationWarning
                sx={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    display: { xs: 'block', md: 'none' },
                    zIndex: 1000,
                    borderTop: '1px solid #dbdbdb',
                }}
                elevation={3}
            >
                <BottomNavigation
                    value={mobileNavValue}
                    onChange={handleMobileNavChange}
                    showLabels
                    sx={{
                        height: 70,
                        bgcolor: '#fff',
                        '& .MuiBottomNavigationAction-root': {
                            minWidth: 'auto',
                            padding: '6px 0',
                            touchAction: 'manipulation',
                        },
                        '& .MuiBottomNavigationAction-label': {
                            fontSize: '0.7rem',
                            marginTop: '4px',
                        },
                        '& .Mui-selected': {
                            color: '#2e7d32',
                        },
                    }}
                >
                    <BottomNavigationAction
                        label="Home"
                        icon={<HomeIcon />}
                        aria-label="Navigate to home"
                    />

                    <BottomNavigationAction
                        label=""
                        icon={
                            <AddCircleIcon
                                sx={{
                                    fontSize: 40,
                                    color: '#2e7d32',
                                }}
                            />
                        }
                        aria-label="Create new post"
                    />
                    <BottomNavigationAction
                        label="Notifications"
                        icon={
                            <Badge badgeContent={unreadCount} color="error">
                                <NotificationsIcon />
                            </Badge>
                        }
                        aria-label={`Notifications, ${unreadCount} unread`}
                    />
                    <BottomNavigationAction
                        label="Profile"
                        icon={<AccountCircleIcon />}
                        aria-label="View your profile"
                    />
                </BottomNavigation>
            </Paper>

            {/* Create Post Modal */}
            <CreatePostModal
                open={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
                onPostCreated={handlePostCreated}
            />
        </Box>
    );
}
