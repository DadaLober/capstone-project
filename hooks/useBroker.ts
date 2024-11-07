'use client';

import { useQuery } from '@tanstack/react-query';

interface BrokerResponse {
    isBroker: boolean;
}

export function useBroker() {
    const { data, isLoading, error } = useQuery<BrokerResponse>({
        queryKey: ['broker'],
        queryFn: async () => {
            const response = await fetch('/api/auth/broker');
            if (!response.ok) {
                throw new Error('Failed to fetch broker status');
            }
            return response.json();
        },
    });

    return {
        isBroker: data?.isBroker ?? false,
        isLoading,
        error
    };
}