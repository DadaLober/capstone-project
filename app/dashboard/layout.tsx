'use client';

import React from 'react';
import SideNav from './(components)/sidenav';
import Header from './(components)/header';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen">
            <SideNav />
            <div className="flex-1 flex flex-col">
                <Header />
                <main className="flex-1 p-4 overflow-y-auto custom-scrollbar">
                    {children}
                </main>
                <div id="modal-root"></div>
            </div>
        </div>
    );
}