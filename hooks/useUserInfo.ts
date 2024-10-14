'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

interface UserInfo {
    role: string;
    [key: string]: any;
}

export function useUserInfo() {
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get('/api/user');
                setUserInfo(response.data);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('An error occurred'));
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserInfo();
    }, []);

    return { userInfo, isLoading, error };
}