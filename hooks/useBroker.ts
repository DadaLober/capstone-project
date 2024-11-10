'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface BrokerResponse {
    isBroker: boolean;
}

export function useBroker() {
    const { data, isLoading, error } = useQuery<BrokerResponse>({
        queryKey: ['broker'],
        queryFn: async () => {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/broker`);
            return response.data;
        },
    });

    return {
        isBroker: data?.isBroker ?? false,
        isLoading,
        error
    };
}