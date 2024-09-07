'use client'

import axios from 'axios';
import { useMutation, useQuery, QueryClient } from '@tanstack/react-query';
import { PropertyInfo } from './types';

const getPropertyInfo = (property: PropertyInfo): PropertyInfo => ({
    ...property,
    priceHistory: property.priceHistory?.map(priceHistoryItem => ({
        date: new Date().toISOString(),
        price: priceHistoryItem.price,
    })),
});

export const useProperties = () => {
    const queryClient = new QueryClient();
    const fetchProperties = async (): Promise<PropertyInfo[]> => {
        const response = await axios.get<PropertyInfo[]>('api/getProperties');
        return response.data.map(getPropertyInfo);
    };

    const deleteProperty = async (id: number): Promise<void> => {
        console.log(`Deleting property with ID: ${id}`);
        await axios.delete(`api/deleteProperty`, {
            params: {
                id: id,
            }
        });
    };
    const queryKey = ['properties'];

    const { data: properties, isLoading, isError } = useQuery({
        queryKey,
        queryFn: fetchProperties,
    });

    const mutation = useMutation({
        mutationFn: (id: number) => deleteProperty(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
            fetchProperties();
        },
    });

    return { properties, isLoading, isError, mutation };
};