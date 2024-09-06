'use client'

import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { PropertyInfo } from './types';

const getPropertyInfo = (property: PropertyInfo): PropertyInfo => ({
    ...property,
    priceHistory: property.priceHistory?.map(priceHistoryItem => ({
        date: new Date().toISOString(),
        price: priceHistoryItem.price,
    })),
});

export const useProperties = () => {
    return useQuery<PropertyInfo[], Error>({
        queryKey: ['properties'],
        queryFn: async () => {
            const response = await axios.get<PropertyInfo[]>('api/getProperties');
            return response.data.map(getPropertyInfo);
        },
    });
};
