'use client';

import { useQuery } from '@tanstack/react-query';
import { CustomJWTPayload } from '@/lib/auth';

type UserResponse = Omit<CustomJWTPayload['user'], 'roles'> & {
    role: string;
};

export function useUser() {
    const { data: user, isLoading, error } = useQuery<UserResponse>({
        queryKey: ['user'],
        queryFn: async () => {
            const response = await fetch('/api/auth/user');
            if (!response.ok) {
                throw new Error('Failed to fetch user');
            }
            return response.json();
        },
    });

    return {
        user,
        isLoading,
        error,
        isAuthenticated: !!user,
    };
}