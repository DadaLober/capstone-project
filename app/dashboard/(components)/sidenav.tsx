'use client';

import React, { useState } from 'react';
import { LogOut, Home, Users, Archive, BookMarked, Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';

const links = [
    { name: 'Home', href: '/dashboard', icon: Home },
    { name: 'User Accounts', href: '/dashboard/user-accounts', icon: Users },
    { name: 'Reserved', href: '/dashboard/reserved', icon: BookMarked },
    { name: 'Archived', href: '/dashboard/archived', icon: Archive },
];

const SideNav = () => {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(true);
    const { theme } = useTheme();

    const handleLogout = () => {
        // Implement logout logic here
        console.log('Logout clicked');
    };

    return (
        <nav className={cn(
            "text-foreground border-r transition-all duration-300 ease-in-out",
            isOpen ? 'w-64' : 'w-20',
            theme === 'dark' ? 'gradient-green-bg' : 'bg-background'
        )}>
            <div className="h-full flex flex-col justify-between p-4">
                <div>
                    <div className="flex items-center justify-between mb-8">
                        <h2 className={cn("text-2xl font-bold", isOpen ? 'block' : 'hidden')}>PortMan</h2>
                        <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
                            <Menu className="h-5 w-5" />
                        </Button>
                    </div>
                    <div className="space-y-2">
                        {links.map((link) => {
                            const IconComponent = link.icon;
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={cn(
                                        "flex items-center gap-4 p-3 rounded-md transition-colors",
                                        pathname === link.href
                                            ? "active-link"
                                            : "hover:bg-accent hover:text-accent-foreground",
                                        !isOpen && "justify-center"
                                    )}
                                >
                                    <IconComponent className="h-5 w-5" />
                                    {isOpen && <span>{link.name}</span>}
                                </Link>
                            );
                        })}
                    </div>
                </div>
                <div className="space-y-2">
                    <Button
                        variant="destructive"
                        size={isOpen ? "default" : "icon"}
                        className={cn("w-full", isOpen ? "justify-start" : "justify-center")}
                        onClick={handleLogout}
                    >
                        <LogOut className={cn("h-4 w-4", isOpen && "mr-2")} />
                        {isOpen && 'Logout'}
                    </Button>
                </div>
            </div>
        </nav>
    );
};

export default SideNav;