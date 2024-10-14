'use client';

import React, { useState, useEffect } from 'react';
import { Search, User, Bell, ChevronDown } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Toggle } from "@/components/ui/toggle";
import { Moon, Sun } from "lucide-react";

const Header: React.FC = () => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    if (!mounted) {
        return null;
    }

    return (
        <header className="bg-background text-foreground px-6 py-4 shadow-sm">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <h1 className="text-2xl font-bold text-primary">PortMan</h1>
                    {/* <div className="relative">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-64 pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground border-input"
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                    </div> */}
                </div>
                <div className="flex items-center space-x-4">
                    <Toggle
                        aria-label="Toggle theme"
                        pressed={theme === 'dark'}
                        onPressedChange={toggleTheme}
                    >
                        {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                    </Toggle>
                    <button className="text-muted-foreground hover:text-primary transition-colors">
                        <Bell size={20} />
                    </button>
                    <div className="relative">
                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center space-x-2 focus:outline-none"
                        >
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                <User size={20} className="text-primary" />
                            </div>
                            <span className="hidden md:block text-sm font-medium text-foreground">John Doe</span>
                            <ChevronDown size={16} className="text-muted-foreground" />
                        </button>
                        {isProfileOpen && (
                            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 z-[900] bg-popover text-popover-foreground">
                                <a href="#" className="block px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground">Profile</a>
                                <a href="#" className="block px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground">Logout</a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;