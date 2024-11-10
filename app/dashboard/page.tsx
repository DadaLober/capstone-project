'use client';

import { useEffect, useState } from 'react';
import DashboardContent from './(components)/DashboardContent';
import PendingStatusScreen from './(components)/PendingStatus';
import axios from 'axios';

function Dashboard() {
    const [userStatus, setUserStatus] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/status`);
                setUserStatus(response.data.status);
            } catch (error) {
                console.error('Failed to fetch user status:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStatus();
    }, []);


    if (isLoading) {
        return <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>;
    }

    if (userStatus === 'pending') {
        return <PendingStatusScreen />;
    }

    return <DashboardContent />;
}

export default Dashboard;