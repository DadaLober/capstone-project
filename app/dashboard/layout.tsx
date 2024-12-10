'use client';

import React from 'react';
import SideNav from './(components)/sidenav';
import { usePathname } from 'next/navigation';
import { useUserInfo } from '@/hooks/useUserInfo';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { userInfo } = useUserInfo();

    const mainClassName = `flex-1 p-4 ${pathname === '/dashboard/statistics' ||
            pathname === '/dashboard/performance' ||
            userInfo?.role === 'admin'
            ? 'overflow-y-auto'
            : 'overflow-y-hidden'
        } custom-scrollbar`;
    return (
        <div className="flex h-screen">
            {userInfo?.role === "broker" || userInfo?.role === "agent" ? <SideNav /> : null}
            <div className="flex-1 flex flex-col">
                <main className={mainClassName}>
                    {children}
                </main>
                <div id="modal-root"></div>
            </div>
        </div>
    );
}
