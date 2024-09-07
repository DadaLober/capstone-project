'use client'

import axios from 'axios';
import { useMutation, useQuery } from '@tanstack/react-query';
import { PropertyInfo } from './types';

const getPropertyInfo = (property: PropertyInfo): PropertyInfo => ({
    ...property,
    priceHistory: property.priceHistory?.map(priceHistoryItem => ({
        date: new Date().toISOString(),
        price: priceHistoryItem.price,
    })),
});

export const useProperties = () => {
    const fetchProperties = async (): Promise<PropertyInfo[]> => {
        const response = await axios.get<PropertyInfo[]>('api/getProperties');
        return response.data.map(getPropertyInfo);
    };

    const deleteProperty = async (id: number): Promise<void> => {
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
    });

    return { properties, isLoading, isError, mutation };
};