'use client'

import axios from 'axios';
import { useMutation, useQuery } from '@tanstack/react-query';
import { PropertyInfo } from './types';

export const useProperties = () => {
    const fetchProperties = async (): Promise<PropertyInfo[]> => {
        const response = await axios.get('http://localhost:3000/api/getProperties');
        console.log(response.data);
        return response.data;
    };

    const deleteProperty = async (id: number): Promise<void> => {
        console.log(id);
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