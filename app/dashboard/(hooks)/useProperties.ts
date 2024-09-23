'use client'

import axios from 'axios';
import { useMutation, useQuery } from '@tanstack/react-query';
import { PropertyInfo } from './types';

export const useProperties = () => {
    const fetchProperties = async (): Promise<PropertyInfo[]> => {
        const response = await axios.get('http://localhost:3000/api/getProperties');
        return response.data;
    };

    const deleteProperty = async (id: number): Promise<void> => {
        await axios.delete(`http://localhost:3000/api/deleteProperty`, { params: { id: id, } });
    };

    const editProperty = async (property: PropertyInfo): Promise<void> => {
        console.log(property);
        await axios.patch(`http://localhost:3000/api/editProperty`, property);
    };
    const queryKey = ['properties'];

    const { data: properties, isLoading, isError } = useQuery({
        queryKey,
        queryFn: fetchProperties,
    });

    const mutation = useMutation({
        mutationFn: (id: number) => deleteProperty(id),
    });

    const editMutation = useMutation({
        mutationFn: (property: PropertyInfo) => editProperty(property),
    });

    return { properties, isLoading, isError, mutation, editMutation };
};