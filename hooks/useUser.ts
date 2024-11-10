'use client';

import { useQuery } from '@tanstack/react-query';
import { CustomJWTPayload } from '@/lib/auth';
import axios from 'axios';

type UserResponse = Omit<CustomJWTPayload['user'], 'roles'> & {
    role: string;
};

export function useUser() {
    const { data: user, isLoading, error } = useQuery<UserResponse>({
        queryKey: ['user'],
        queryFn: async () => {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/user`);
            return response.data;
        },
    });

    return {
        user,
        isLoading,
        error,
        isAuthenticated: !!user,
    };
}