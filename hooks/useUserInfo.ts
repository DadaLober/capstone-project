'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

interface UserInfo {
    role: string;
    [key: string]: any;
}

let cachedUserInfo: UserInfo | null = null;

export function useUserInfo() {
    const [userInfo, setUserInfo] = useState<UserInfo | null>(cachedUserInfo);
    const [isLoading, setIsLoading] = useState(!cachedUserInfo);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (cachedUserInfo) return;

        const fetchUserInfo = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/user`);
                console.log(response.data);
                cachedUserInfo = response.data;
                setUserInfo(cachedUserInfo);
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
