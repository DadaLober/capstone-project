'use client';

import React, { useState, useEffect } from 'react';
import { User, ChevronDown } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Toggle } from "@/components/ui/toggle";
import { Moon, Sun } from "lucide-react";
import { useUserInfo } from '@/hooks/useUserInfo';
import axios from 'axios';
import UserSettingsModal from './user-settings';
import SearchBar from './searchbar';
import { usePathname } from 'next/navigation';

const Header: React.FC<{
    onSearch?: (query: string) => void;
    onSort?: (criteria: string) => void;
}> = ({ onSearch, onSort }) => {
    const pathname = usePathname();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const { userInfo, isLoading } = useUserInfo();

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSearch = (query: string) => {
        if (onSearch) {
            onSearch(query);
        }
    };

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    if (!mounted) {
        return null;
    }

    const handleLogout = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/logout`);
            console.log(response.data);
            window.location.href = '/login';
        } catch (error) {
            console.error(error);
        }
    };

    const showSearchBar = pathname === '/dashboard';

    return (
        <>
            <header className="bg-background text-foreground shadow-sm">
                <div className="flex items-center justify-between w-full">
                    {showSearchBar && (
                        <div className="flex-1">
                            <SearchBar
                                onSearch={handleSearch}
                                onSort={(criteria) => onSort?.(criteria)}
                            />
                        </div>
                    )}
                    <div className="flex items-center space-x-4 p-4 ml-auto">
                        <Toggle
                            aria-label="Toggle theme"
                            pressed={theme === 'dark'}
                            onPressedChange={toggleTheme}
                        >
                            {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                        </Toggle>
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center space-x-2 focus:outline-none"
                            >
                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                    <User size={20} className="text-primary" />
                                </div>
                                <span className="hidden md:block text-sm font-medium text-foreground">
                                    {isLoading ? 'Loading...' : userInfo?.firstName || 'User'}
                                </span>
                                <ChevronDown size={16} className="text-muted-foreground" />
                            </button>
                            {isProfileOpen && (
                                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 z-[900] bg-popover text-popover-foreground">
                                    <a href="#" className="block px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground" onClick={() => setIsSettingsOpen(true)}>Profile</a>
                                    <a href="#" className="block px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground" onClick={handleLogout}>Logout</a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header >
            <UserSettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        </>
    );
};

export default Header;